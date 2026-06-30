import React from 'react';
import HomeworkUpload from '../components/HomeworkUpload';
import FlashcardBox from '../components/FlashcardBox';

export default function Lerntechniken() {
  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontWeight:900, marginBottom:'.5rem' }}>🧠 Lerntechniken</h1>
        <p style={{ color:'var(--text-light)', marginBottom:'2rem' }}>
          Lade ein Foto hoch – wir erkennen das Fach und erstellen passende Lernaufgaben und Karteikarten.
        </p>
        <div className="grid-2">
          <div className="card">
            <h2 style={{ fontWeight:800, marginBottom:'1.25rem' }}>📸 Hausaufgaben-Scanner</h2>
            <HomeworkUpload />
          </div>
          <div className="card">
            <h2 style={{ fontWeight:800, marginBottom:'1.25rem' }}>🃏 Demo-Karteikarten</h2>
            <p style={{ color:'var(--text-light)', fontSize:'.88rem', marginBottom:'1rem' }}>
              Nach dem Upload werden hier die generierten Karten angezeigt. Demo-Modus läuft mit Beispielkarten.
            </p>
            <FlashcardBox />
          </div>
        </div>
      </div>
    </div>
  );
}
