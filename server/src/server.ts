import 'dotenv/config';
import express from 'express';
import cors    from 'cors';
import { config }       from './config.js';
import homeworkRouter   from './routes/homework.js';

const app = express();

app.use(cors({
  origin: (origin, cb) =>
    !origin || config.allowedOrigins.includes(origin)
      ? cb(null, true)
      : cb(new Error(`CORS blockiert: ${origin}`)),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Minimal-Logging (kein Body = Datenschutz)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/homework', homeworkRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true, version: '3.1.0' }));

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: 'NICHT_GEFUNDEN' }));

// Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server]', err.message);
  res.status(500).json({ success: false, error: 'INTERNER_FEHLER',
    message: config.isDev ? err.message : 'Interner Fehler' });
});

app.listen(config.port, () => {
  console.log(`\n🚀 LernHeld API  → http://localhost:${config.port}`);
  console.log(`🔍 OCR          → Tesseract.js + Sharp + OpenCV`);
  console.log(`🤖 KI           → Mistral (${config.mistralModel})`);
  console.log(`🌍 Origins      → ${config.allowedOrigins.join(', ')}\n`);
});
