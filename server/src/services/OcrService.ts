/**
 * OcrService.ts
 *
 * Ablauf:
 *   1. Sharp-Vorverarbeitung  → OCR
 *   2. Wenn erkannter Text < OCR_MIN_CHARS: OpenCV-Fallback → OCR
 *   3. Temporäre Dateien sofort löschen
 */
import Tesseract from 'tesseract.js';
import { config }           from '../config.js';
import { preprocessWithSharp, preprocessWithOpenCV } from './ImagePreprocessor.js';
import { safeDelete } from '../middleware/uploadMiddleware.js';

export interface OcrResult {
  text:          string;
  confidence:    number;
  lang:          string;
  wordCount:     number;
  processingMs:  number;
  method:        'sharp' | 'opencv' | 'raw';
}

export interface OcrError {
  code:    'OCR_FEHLGESCHLAGEN' | 'ZU_WENIG_TEXT' | 'TIMEOUT';
  message: string;
}

function clean(raw: string): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/([^\S\n]){3,}/g, ' ')
    .replace(/\n{4,}/g, '\n\n')
    .trim();
}

async function ocr(filePath: string): Promise<{ text: string; confidence: number; lang: string }> {
// ✅ Fix – Objekt nur mit logger bauen wenn isDev
const workerOptions = config.isDev
  ? {
      logger: (m: { status: string; progress: number }) => {
        if (m.status === 'recognizing text')
          process.stdout.write(`\r[OCR] ${Math.round(m.progress * 100)}%  `);
      },
    }
  : {};

const worker = await Tesseract.createWorker(config.ocrLangs, 1, workerOptions);

  const { data } = await worker.recognize(filePath);
  await worker.terminate();
  if (config.isDev) process.stdout.write('\n');
  return {
    text:       clean(data.text ?? ''),
    confidence: Math.round(data.confidence ?? 0),
    lang:       (data as any).lang ?? 'unknown',
  };
}

export async function runOcr(originalPath: string): Promise<OcrResult | OcrError> {
  const t0 = Date.now();
  let sharpPath: string | null = null;
  let cvPath: string    | null = null;

  try {
    // ── Schritt 1: Sharp-Vorverarbeitung ─────────────────────────────────
    console.log('[OCR] Starte Sharp-Vorverarbeitung …');
    sharpPath = await preprocessWithSharp(originalPath);
    const sharpResult = await ocr(sharpPath);

    if (sharpResult.text.length >= config.ocrMinChars) {
      console.log(`[OCR] Sharp OK – ${sharpResult.text.split(/\s+/).length} Wörter, ${sharpResult.confidence}%`);
      return {
        ...sharpResult,
        wordCount:    sharpResult.text.split(/\s+/).filter(w => w.length > 1).length,
        processingMs: Date.now() - t0,
        method:       'sharp',
      };
    }

    // ── Schritt 2: OpenCV-Fallback ─────────────────────────────────────
    console.log('[OCR] Sharp-Ergebnis zu kurz – starte OpenCV-Fallback …');
    cvPath = await preprocessWithOpenCV(originalPath);
    const cvResult = await ocr(cvPath);

    if (cvResult.text.length >= config.ocrMinChars) {
      console.log(`[OCR] OpenCV OK – ${cvResult.text.split(/\s+/).length} Wörter, ${cvResult.confidence}%`);
      return {
        ...cvResult,
        wordCount:    cvResult.text.split(/\s+/).filter(w => w.length > 1).length,
        processingMs: Date.now() - t0,
        method:       'opencv',
      };
    }

    // ── Schritt 3: Rohbild als letzter Versuch ─────────────────────────
    console.log('[OCR] Fallback auf Rohbild …');
    const rawResult = await ocr(originalPath);
    if (rawResult.text.length < config.ocrMinChars) {
      return {
        code:    'ZU_WENIG_TEXT',
        message: `Nur ${rawResult.text.length} Zeichen erkannt. Bitte ein helleres, schärferes Foto hochladen.`,
      };
    }
    return {
      ...rawResult,
      wordCount:    rawResult.text.split(/\s+/).filter(w => w.length > 1).length,
      processingMs: Date.now() - t0,
      method:       'raw',
    };

  } catch (e: any) {
    console.error('[OCR] Fehler:', e.message);
    return { code: 'OCR_FEHLGESCHLAGEN', message: 'Texterkennung fehlgeschlagen. Bitte schärferes Foto hochladen.' };
  } finally {
    if (sharpPath) safeDelete(sharpPath);
    if (cvPath)    safeDelete(cvPath);
  }
}

export function isOcrError(r: OcrResult | OcrError): r is OcrError {
  return 'code' in r;
}
