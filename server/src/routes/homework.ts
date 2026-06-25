import { Router, Request, Response } from 'express';
import { handleUpload, safeDelete } from '../middleware/uploadMiddleware.js';
import { runOcr, isOcrError }       from '../services/OcrService.js';
import { detectSubject, generateTasks, generateFlashcards } from '../services/MistralService.js';

const router = Router();

/**
 * POST /api/homework/upload
 * multipart/form-data  –  Feld: image (JPG|PNG|WebP)
 */
router.post('/upload', handleUpload, async (req: Request, res: Response) => {
  const filePath = req.file!.path;

  try {
    // 1. OCR (mit Sharp → OpenCV Fallback → Rohbild)
    const ocrResult = await runOcr(filePath);
    safeDelete(filePath); // Upload sofort löschen

    if (isOcrError(ocrResult)) {
      return res.status(422).json({ success: false, error: ocrResult.code, message: ocrResult.message });
    }

    // 2. Mistral: Fach + Aufgaben + Karteikarten parallel
    const [subjectInfo, tasks, flashcards] = await Promise.all([
      detectSubject(ocrResult.text),
      generateTasks('unbekannt', 'unbekannt', ocrResult.text), // Vorläufig
      generateFlashcards('unbekannt', ocrResult.text),
    ]);

    // Aufgaben nochmal mit echtem Fach generieren (für bessere Qualität)
    const betterTasks = await generateTasks(subjectInfo.subject, subjectInfo.topic, ocrResult.text);

    return res.json({
      success: true,
      ocr: {
        text:         ocrResult.text,
        confidence:   ocrResult.confidence,
        language:     ocrResult.lang,
        wordCount:    ocrResult.wordCount,
        processingMs: ocrResult.processingMs,
        method:       ocrResult.method,
      },
      subject:    subjectInfo.subject,
      topic:      subjectInfo.topic,
      emoji:      subjectInfo.emoji,
      reason:     subjectInfo.reason,
      tasks:      betterTasks,
      flashcards,
    });

  } catch (e: any) {
    safeDelete(filePath);
    console.error('[/api/homework/upload]', e.message);
    return res.status(500).json({
      success: false,
      error:   'INTERNER_FEHLER',
      message: 'Verarbeitung fehlgeschlagen. Bitte erneut versuchen.',
    });
  }
});

router.get('/health', (_req, res) =>
  res.json({ ok: true, module: 'homework', ocr: 'tesseract+sharp+opencv', ai: 'mistral' }),
);

export default router;
