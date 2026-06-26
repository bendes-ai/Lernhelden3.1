import React, { useState, useRef, useCallback } from 'react';
import FlashcardBox from './FlashcardBox';

// ─── Typen ───────────────────────────────────────────────────────────────────
interface OcrData {
  text: string;
  confidence: number;
  language: string;
  wordCount: number;
  processingMs: number;
  method: 'sharp' | 'opencv' | 'raw';
}
interface Task {
  id: string;
  type: string;
  title: string;
  instruction: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}
interface ApiSuccess {
  success: true;
  ocr: OcrData;
  subject: string;
  topic: string;
  emoji: string;
  reason: string;
  tasks: Task[];
  flashcards: Flashcard[];
}
interface ApiError {
  success: false;
  error: string;
  message: string;
}
type ApiResponse = ApiSuccess | ApiError;

// ─── Konstanten ──────────────────────────────────────────────────────────────
const API_BASE   = 'https://lernheld3-1.onrender.com';
const MAX_MB     = 10;
const DIFF_COLORS: Record<string, string> = {
  easy: 'var(--accent)', medium: '#FFB347', hard: 'var(--secondary)',
};
const DIFF_LABELS: Record<string, string> = {
  easy: 'Einfach', medium: 'Mittel', hard: 'Schwer',
};
const TYPE_ICONS: Record<string, string> = {
  vokabeln: '🔤', fakten: '📌', rechnen: '🔢', lesen: '📖',
  prozess: '🪜', analyse: '🔍', kreativ: '🎨',
};
const METHOD_LABELS: Record<string, string> = {
  sharp: 'Sharp-Filter', opencv: 'OpenCV-Filter', raw: 'Rohbild',
};

// ─── Unterkomponente: Fehlerbox ───────────────────────────────────────────────
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="error-box" style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
      <span>❌</span><span>{msg}</span>
    </div>
  );
}

// ─── Unterkomponente: Lade-Indikator ─────────────────────────────────────────
function Loader({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: '2.5rem', display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>🔍</div>
      <p style={{ marginTop: '.75rem', fontWeight: 700 }}>{text}</p>
      <p style={{ fontSize: '.82rem', color: 'var(--text-light)', marginTop: '.3rem' }}>
        Tesseract.js + Sharp + OpenCV laufen lokal — kein Datenverlust.
      </p>
    </div>
  );
}

// ─── Hauptkomponente ─────────────────────────────────────────────────────────
export default function HomeworkUpload() {
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string>('');
  const [loading, setLoading]   = useState(false);
  const [stage, setStage]       = useState('');
  const [result, setResult]     = useState<ApiSuccess | null>(null);
  const [error, setError]       = useState('');
  const [showText, setShowText] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((f?: File | null) => {
    setError(''); setResult(null);
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Datei zu groß (${(f.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const upload = async () => {
    if (!file) { setError('Bitte zuerst ein Foto wählen.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      setStage('📤 Hochladen …');
      const fd = new FormData();
      fd.append('image', file);

      setStage('🔍 OCR läuft (Tesseract + Sharp + OpenCV) …');
      const r = await fetch(`${API_BASE}/api/homework/upload`, {
        method: 'POST',
        body: fd,
      });

      setStage('🤖 Mistral analysiert Fach und erstellt Aufgaben …');
      const data: ApiResponse = await r.json();

      if (!r.ok || !data.success) {
        throw new Error((data as ApiError).message || 'Fehler');
      }
      setResult(data as ApiSuccess);
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler');
    } finally {
      setLoading(false); setStage('');
    }
  };

  const reset = () => {
    setFile(null); setPreview(''); setResult(null);
    setError(''); setShowText(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Ergebnis-Ansicht ───────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="grid" style={{ gap: '1.5rem' }}>

        <div className="card" style={{ background: 'linear-gradient(135deg,#6C63FF,#8B5CF6)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '.82rem', opacity: .8 }}>Erkanntes Fach</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '.25rem 0' }}>
                {result.emoji} {result.subject}
              </h2>
              <p style={{ opacity: .9, fontSize: '.92rem' }}>📌 {result.topic}</p>
              <p style={{ opacity: .75, fontSize: '.82rem', marginTop: '.3rem', fontStyle: 'italic' }}>{result.reason}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '.82rem', opacity: .85 }}>
              <p>🌍 {result.ocr.language}</p>
              <p>📝 {result.ocr.wordCount} Wörter</p>
              <p>🎯 OCR-Konfidenz: {result.ocr.confidence}%</p>
              <p>⚙️ Methode: {METHOD_LABELS[result.ocr.method]}</p>
              <p>⏱️ {result.ocr.processingMs} ms</p>
            </div>
          </div>
        </div>

        <div className="card">
          <button className="btn" onClick={() => setShowText(v => !v)}
            style={{ width: '100%', justifyContent: 'space-between', background: 'transparent', padding: 0, fontWeight: 700 }}>
            <span>📄 Erkannter Text ({result.ocr.wordCount} Wörter)</span>
            <span style={{ color: 'var(--primary)' }}>{showText ? '▲' : '▼'}</span>
          </button>
          {showText && (
            <pre style={{
              marginTop: '1rem', background: '#F8F7FF', borderRadius: 10,
              padding: '1rem', fontSize: '.82rem', fontFamily: 'monospace',
              whiteSpace: 'pre-wrap', maxHeight: 240, overflowY: 'auto',
            }}>
              {result.ocr.text}
            </pre>
          )}
        </div>

        <div>
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>📚 Lernaufgaben für {result.subject}</h3>
          <div className="grid" style={{ gap: '.75rem' }}>
            {result.tasks.map((t, i) => (
              <div key={t.id} className="card" style={{ borderLeft: `4px solid ${DIFF_COLORS[t.difficulty] ?? '#ccc'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.4rem' }}>
                  <h4 style={{ fontWeight: 800 }}>{TYPE_ICONS[t.type] ?? '📄'} {i + 1}. {t.title}</h4>
                  <span className={`badge badge-${t.difficulty}`}>{DIFF_LABELS[t.difficulty]}</span>
                </div>
                <p style={{ fontSize: '.9rem', color: 'var(--text-light)' }}>{t.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {result.flashcards.length > 0 && (
          <div>
            <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>🃏 Karteikarten ({result.flashcards.length} Stück)</h3>
            <FlashcardBox cards={result.flashcards} />
          </div>
        )}

        <button className="btn btn-outline" onClick={reset} style={{ justifyContent: 'center' }}>
          📸 Neues Foto hochladen
        </button>
      </div>
    );
  }

  // ── Upload-Ansicht ─────────────────────────────────────────────────────────
  return (
    <div className="grid" style={{ gap: '1.25rem' }}>

      <div style={{
        background: 'rgba(255,213,0,.15)', border: '2px solid #FFD700',
        borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: '.75rem',
      }}>
        <span>🔒</span>
        <p style={{ fontSize: '.88rem' }}>
          <strong>Datenschutz:</strong> Bilder werden lokal per Tesseract.js + Sharp + OpenCV verarbeitet
          und nach der OCR sofort gelöscht. Lade keine Fotos mit persönlichen Daten hoch.
        </p>
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }}
        onClick={() => !loading && fileRef.current?.click()}
        style={{
          border: `2px dashed ${error ? 'var(--secondary)' : '#D1D5DB'}`,
          borderRadius: 'var(--radius)', padding: '2.5rem 1.5rem',
          textAlign: 'center', cursor: loading ? 'default' : 'pointer',
          background: preview ? 'rgba(108,99,255,.04)' : '#fafafa',
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="Vorschau"
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, marginBottom: '.75rem' }} />
            <p style={{ fontWeight: 700, color: 'var(--primary)' }}>
              ✅ {file!.name} ({(file!.size / 1024).toFixed(0)} KB)
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>📸</div>
            <p style={{ fontWeight: 700 }}>Foto hochladen oder hierher ziehen</p>
            <p style={{ color: 'var(--text-light)', fontSize: '.88rem' }}>JPG, PNG, WebP · max. {MAX_MB} MB</p>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={e => pickFile(e.target.files?.[0])} />

      {error && <ErrorBox msg={error} />}
      {loading && <Loader text={stage} />}

      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={upload} disabled={!file || loading}
          style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          {loading ? '⏳ Wird analysiert…' : '🔍 Hochladen & auswerten'}
        </button>
        {file && !loading && (
          <button className="btn btn-outline" onClick={reset}>✕ Reset</button>
        )}
      </div>
    </div>
  );
}
