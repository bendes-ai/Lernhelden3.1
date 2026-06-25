import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port:           parseInt(process.env.PORT ?? '3001', 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
                    .split(',').map(s => s.trim()),
  uploadDir:      path.resolve(__dirname, '..', process.env.UPLOAD_DIR ?? 'uploads'),
  maxUploadMb:    parseInt(process.env.MAX_UPLOAD_MB ?? '10', 10),
  ocrLangs:       process.env.OCR_LANGUAGES ?? 'deu+eng',
  ocrMinChars:    parseInt(process.env.OCR_MIN_CHARS ?? '30', 10),
  mistralApiKey:  process.env.MISTRAL_API_KEY ?? '',
  mistralModel:   process.env.MISTRAL_MODEL  ?? 'mistral-small-latest',
  isDev:          (process.env.NODE_ENV ?? 'development') === 'development',
} as const;
