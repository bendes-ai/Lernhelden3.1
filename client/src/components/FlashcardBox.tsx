import React, { useState } from 'react';

export interface Flashcard { front: string; back: string; hint?: string; }

interface Props { cards?: Flashcard[]; }

const DEMO: Flashcard[] = [
  { front: 'Was ist eine Gleichung?',      back: 'Eine mathematische Aussage mit einer unbekannten Zahl.',         hint: 'Denk an "x = ?"' },
  { front: 'Was bedeutet "Fotosynthese"?', back: 'Pflanzen wandeln Sonnenlicht und CO₂ in Zucker und Sauerstoff um.', hint: 'Foto = Licht' },
  { front: 'What is a noun?',              back: 'A naming word for a person, place, or thing.',                    hint: 'z.B. school, dog' },
];

export default function FlashcardBox({ cards = DEMO }: Props) {
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [solved,  setSolved]  = useState<Set<number>>(new Set());

  const total   = cards.length;
  const current = cards[index % total];
  const progress = Math.round((solved.size / total) * 100);

  const go = (dir: 1 | -1) => {
    setIndex(i => (i + dir + total) % total);
    setFlipped(false);
  };

  const markSolved = () => {
    setSolved(s => new Set([...s, index % total]));
    go(1);
  };

  return (
    <div className="grid" style={{ gap:'1.25rem' }}>
      {/* Fortschrittsbalken */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem', color:'var(--text-light)', marginBottom:'.3rem' }}>
          <span>Karte {(index % total) + 1} von {total}</span>
          <span>✅ {solved.size} gelernt</span>
        </div>
        <div style={{ height:8, background:'#E5E7EB', borderRadius:999, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'var(--accent)', transition:'width .4s', borderRadius:999 }}/>
        </div>
      </div>

      {/* Karte */}
      <div
        onClick={() => setFlipped(v => !v)}
        style={{
          cursor:'pointer', minHeight:200,
          background: flipped
            ? 'linear-gradient(135deg,#43E97B,#21D4FD)'
            : 'linear-gradient(135deg,#6C63FF,#8B5CF6)',
          borderRadius:'var(--radius)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'2rem',
          textAlign:'center',
          color:'white',
          boxShadow:'0 8px 32px rgba(108,99,255,.25)',
          transition:'background .35s',
          userSelect:'none',
        }}
      >
        <div>
          <p style={{ fontSize:'.8rem', opacity:.75, marginBottom:'.5rem', textTransform:'uppercase', letterSpacing:'.05em' }}>
            {flipped ? '✅ Antwort' : '❓ Frage'}
          </p>
          <p style={{ fontSize:'1.2rem', fontWeight:700 }}>
            {flipped ? current.back : current.front}
          </p>
          {!flipped && current.hint && (
            <p style={{ marginTop:'.75rem', fontSize:'.85rem', opacity:.8 }}>
              💡 Tipp: {current.hint}
            </p>
          )}
          {!flipped && (
            <p style={{ marginTop:'1rem', fontSize:'.78rem', opacity:.6 }}>Tippen zum Umdrehen</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
        <button className="btn" onClick={() => go(-1)} style={{ flex:'1', justifyContent:'center' }}>← Zurück</button>
        {flipped && (
          <button className="btn btn-accent" onClick={markSolved} style={{ flex:'1', justifyContent:'center' }}>
            ✅ Gewusst
          </button>
        )}
        <button className="btn btn-primary" onClick={() => go(1)} style={{ flex:'1', justifyContent:'center' }}>Weiter →</button>
      </div>

      {solved.size === total && total > 0 && (
        <div className="info-box" style={{ textAlign:'center' }}>
          <span style={{ fontSize:'2rem' }}>🎉</span>
          <p style={{ fontWeight:700, marginTop:'.5rem' }}>Alle Karten gelernt! Super!</p>
          <button className="btn btn-outline" style={{ marginTop:'1rem' }}
            onClick={() => { setSolved(new Set()); setIndex(0); setFlipped(false); }}>
            🔄 Nochmal
          </button>
        </div>
      )}
    </div>
  );
}
