import multer, { FileFilterCallback } from 'multer';
import fs   from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

// Upload-Ordner sicherstellen
if (!fs.existsSync(config.uploadDir))
  fs.mkdirSync(config.uploadDir, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT  = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename:    (_req,  file,  cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXT.has(ext))
    return cb(null, true);
  cb(new Error(`Ungültiges Format: ${file.mimetype}. Erlaubt: JPG, PNG, WebP.`));
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
}).single('image');

// Strukturierter Fehler-Wrapper
export function handleUpload(req: Request, res: Response, next: NextFunction) {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(413).json({ success: false, error: 'DATEI_ZU_GROSS',
          message: `Maximal ${config.maxUploadMb} MB erlaubt.` });
      return res.status(400).json({ success: false, error: 'UPLOAD_FEHLER', message: err.message });
    }
    if (err instanceof Error)
      return res.status(415).json({ success: false, error: 'FALSCHES_FORMAT', message: err.message });
    if (!req.file)
      return res.status(400).json({ success: false, error: 'KEINE_DATEI',
        message: 'Kein Bild hochgeladen. Bitte JPG, PNG oder WebP wählen.' });
    next();
  });
}

export function safeDelete(filePath: string): void {
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }
  catch (e) { console.warn('[Upload] Datei konnte nicht gelöscht werden:', filePath, e); }
}
