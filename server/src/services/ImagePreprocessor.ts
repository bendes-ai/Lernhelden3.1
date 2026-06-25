/**
 * ImagePreprocessor.ts
 *
 * Verbessert Bilder vor der OCR-Erkennung mit zwei Strategien:
 *
 * 1. PRIMÄR  – Sharp (nativ, schnell, keine WASM-Wartezeit)
 *    Graustufen → Kontrast/Helligkeit → Schärfen → PNG
 *
 * 2. FALLBACK – @techstark/opencv-js
 *    Adaptive Schwellenwert (GaussianAdaptiveThreshold) für kontrastarme Scans.
 *    Wird nur aktiviert wenn Sharp ein schlechtes Ergebnis liefert
 *    (= erkannter Text < OCR_MIN_CHARS nach Sharp-Versuch).
 */
import sharp  from 'sharp';
import path   from 'path';
import fs     from 'fs';
import { config } from '../config.js';

// OpenCV wird lazy geladen, damit der Server nicht blockiert
let cvPromise: Promise<any> | null = null;
async function getCV() {
  if (!cvPromise) {
    cvPromise = import('@techstark/opencv-js').then(m => {
      const CV = m.default ?? m;
      return new Promise<any>((resolve) => {
        if (CV.getBuildInformation) return resolve(CV); // bereits bereit
        CV.onRuntimeInitialized = () => resolve(CV);
      });
    });
  }
  return cvPromise;
}

// ── Sharp-Vorverarbeitung ────────────────────────────────────────────────────

export async function preprocessWithSharp(srcPath: string): Promise<string> {
  const outPath = srcPath.replace(/\.[^.]+$/, '_sharp.png');
  await sharp(srcPath)
    .grayscale()
    .normalise()
    .modulate({ brightness: 1.15, saturation: 0 })
    .sharpen({ sigma: 1.2 })
    .linear(1.4, -30)       // Kontrast anheben, dunkle Töne absenkten
    .threshold(128)          // Harte Schwarz/Weiß-Binarisierung
    .png({ compressionLevel: 6 })
    .toFile(outPath);
  return outPath;
}

// ── OpenCV Adaptive-Threshold-Vorverarbeitung ─────────────────────────────────

export async function preprocessWithOpenCV(srcPath: string): Promise<string> {
  const { createCanvas, loadImage } = await import('canvas');
  const cv = await getCV();

  const img    = await loadImage(srcPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx    = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);

  // Graustufen-Matrix erstellen
  const gray = new Uint8Array(img.width * img.height);
  for (let i = 0; i < gray.length; i++) {
    const r = imgData.data[i * 4];
    const g = imgData.data[i * 4 + 1];
    const b = imgData.data[i * 4 + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  const src = cv.matFromArray(img.height, img.width, cv.CV_8UC1, gray);
  const dst = new cv.Mat();

  // Adaptiver Gauß-Schwellenwert – ideal für ungleichmäßige Beleuchtung
  cv.adaptiveThreshold(
    src, dst,
    255,                           // maxVal
    cv.ADAPTIVE_THRESH_GAUSSIAN_C, // Gauß-gewichteter Mittelwert
    cv.THRESH_BINARY,              // Binäre Ausgabe
    31,                            // Blockgröße (ungerade, größer = robuster)
    10,                            // C-Konstante (subtrahiert vom Mittelwert)
  );

  // Leichtes Rausch-Entfernen (Morphologisches Opening)
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
  const cleaned = new cv.Mat();
  cv.morphologyEx(dst, cleaned, cv.MORPH_OPEN, kernel);

  // Zurück in ein PNG schreiben
  const outCanvas = createCanvas(img.width, img.height);
  const outCtx    = outCanvas.getContext('2d');
  const outData   = outCtx.createImageData(img.width, img.height);
  const cleanData = cleaned.data as Uint8Array;
  for (let i = 0; i < cleanData.length; i++) {
    outData.data[i * 4]     = cleanData[i];
    outData.data[i * 4 + 1] = cleanData[i];
    outData.data[i * 4 + 2] = cleanData[i];
    outData.data[i * 4 + 3] = 255;
  }
  outCtx.putImageData(outData, 0, 0);

  src.delete(); dst.delete(); kernel.delete(); cleaned.delete();

  const outPath = srcPath.replace(/\.[^.]+$/, '_cv.png');
  const buf = outCanvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);
  return outPath;
}
