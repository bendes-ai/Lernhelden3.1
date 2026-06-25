/**
 * MistralService.ts
 *
 * Robustes JSON-Parsing:
 *   1. Vollständigen String parsen
 *   2. JSON-Block per Regex extrahieren (```json ... ``` oder { ... })
 *   3. Fallback auf vordefinierte Struktur
 */
import { Mistral } from '@mistralai/mistralai';
import { config } from '../config.js';

const client = new Mistral({ apiKey: config.mistralApiKey });

// ─── JSON-Parser mit mehrfachem Fallback ─────────────────────────────────────

function extractJson<T>(raw: string, fallback: T): T {
  const trimmed = raw.trim();

  // Versuch 1: Direktes Parsen
  try { return JSON.parse(trimmed) as T; } catch { /* weiter */ }

  // Versuch 2: Code-Block ```json … ```
  const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (block?.[1]) {
    try { return JSON.parse(block[1].trim()) as T; } catch { /* weiter */ }
  }

  // Versuch 3: Erstes { … } oder [ … ] extrahieren
  const objMatch = trimmed.match(/({[\s\S]*})/);
  if (objMatch?.[1]) {
    try { return JSON.parse(objMatch[1]) as T; } catch { /* weiter */ }
  }
  const arrMatch = trimmed.match(/(\[[\s\S]*\])/);
  if (arrMatch?.[1]) {
    try { return JSON.parse(arrMatch[1]) as T; } catch { /* weiter */ }
  }

  // Versuch 4: Kaputte Escape-Sequenzen reparieren
  try {
    const repaired = trimmed
      .replace(/[\u0000-\u001F]+/g, ' ')   // Steuerzeichen
      .replace(/,\s*(}|\])/g, '$1');          // trailing commas
    return JSON.parse(repaired) as T;
  } catch { /* weiter */ }

  console.warn('[Mistral] JSON-Parsing fehlgeschlagen. Fallback aktiv. Raw:', trimmed.slice(0, 200));
  return fallback;
}

// ─── Chat-Hilfsfunktion ──────────────────────────────────────────────────────

async function chat(prompt: string, maxTokens = 1200): Promise<string> {
  const res = await client.chat.complete({
    model: config.mistralModel,
    messages: [
      {
        role: 'system',
        content: 'Du bist ein pädagogischer Assistent für Kinder von 8–14 Jahren. Antworte immer als valides JSON ohne Markdown-Blöcke.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    maxTokens,
  });
  return String(res.choices?.[0]?.message?.content ?? '');
}

// ─── Fach-Erkennung ──────────────────────────────────────────────────────────

export interface SubjectInfo {
  subject:  string;   // z. B. "Mathematik"
  topic:    string;   // z. B. "Bruchrechnung"
  emoji:    string;   // z. B. "🔢"
  reason:   string;   // kurze Begründung
}

const SUBJECT_FALLBACK: SubjectInfo = {
  subject: 'Allgemein', topic: 'Unbekannt', emoji: '📚', reason: 'Kein Fach erkannt.',
};

export async function detectSubject(text: string): Promise<SubjectInfo> {
  const prompt = `Erkenne das Schulfach aus dem folgenden Text. Gib nur JSON zurück:
{
  "subject": "Fachname auf Deutsch (z.B. Mathematik, Deutsch, Englisch, Biologie, Geschichte, Geografie, Physik, Chemie, Informatik)",
  "topic": "konkretes Unterthema",
  "emoji": "passendes Emoji",
  "reason": "kurze Begründung (max 1 Satz)"
}

Text:
${text.slice(0, 2000)}`;

  const raw = await chat(prompt, 400);
  return extractJson<SubjectInfo>(raw, SUBJECT_FALLBACK);
}

// ─── Beispielaufgaben ────────────────────────────────────────────────────────

export interface ExampleTask {
  id:          string;
  type:        'vokabeln' | 'fakten' | 'rechnen' | 'lesen' | 'prozess' | 'analyse' | 'kreativ';
  title:       string;
  instruction: string;
  difficulty:  'easy' | 'medium' | 'hard';
}

const TASKS_FALLBACK: ExampleTask[] = [
  { id: 't1', type: 'lesen',   title: 'Text zusammenfassen',  instruction: 'Fasse den Text in 3 Sätzen zusammen.', difficulty: 'easy' },
  { id: 't2', type: 'analyse', title: 'Schlüsselwörter suchen',instruction: 'Markiere die 5 wichtigsten Wörter.',  difficulty: 'easy' },
  { id: 't3', type: 'kreativ', title: 'Eigene Frage stellen',  instruction: 'Schreibe 3 Fragen zum Thema.',         difficulty: 'medium' },
];

export async function generateTasks(subject: string, topic: string, text: string): Promise<ExampleTask[]> {
  const prompt = `Erstelle 4 kindgerechte Lernaufgaben auf Deutsch für Schüler (8–14 Jahre).
Fach: ${subject}, Thema: ${topic}

Gib nur ein JSON-Array zurück:
[
  {
    "id": "t1",
    "type": "vokabeln|fakten|rechnen|lesen|prozess|analyse|kreativ",
    "title": "Kurztitel",
    "instruction": "Genaue Aufgabenstellung (1–2 Sätze)",
    "difficulty": "easy|medium|hard"
  }
]

Inhalt des Arbeitsblatts:
${text.slice(0, 2000)}`;

  const raw = await chat(prompt, 1000);
  const result = extractJson<ExampleTask[]>(raw, TASKS_FALLBACK);
  return Array.isArray(result) ? result : TASKS_FALLBACK;
}

// ─── Karteikarten ────────────────────────────────────────────────────────────

export interface Flashcard {
  front: string;
  back:  string;
  hint?: string;
}

const CARDS_FALLBACK: Flashcard[] = [
  { front: 'Was ist das Thema des Arbeitsblatts?', back: 'Bitte Text erneut hochladen.', hint: '' },
];

export async function generateFlashcards(subject: string, text: string): Promise<Flashcard[]> {
  const prompt = `Erstelle 6 Lernkarteikarten auf Deutsch für das Fach ${subject}.
Jede Karte enthält eine klare Frage (front), eine kurze Antwort (back) und optional einen Tipp (hint).

Gib nur ein JSON-Array zurück:
[
  { "front": "Frage?", "back": "Antwort.", "hint": "optionaler Tipp" }
]

Text des Arbeitsblatts:
${text.slice(0, 2000)}`;

  const raw = await chat(prompt, 900);
  const result = extractJson<Flashcard[]>(raw, CARDS_FALLBACK);
  return Array.isArray(result) ? result : CARDS_FALLBACK;
}
