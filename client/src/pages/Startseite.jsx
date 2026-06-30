import React from 'react';
import { Link } from 'react-router-dom';
export default function Startseite() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6,#EC4899)', color:'white', padding:'5rem 0 4rem', textAlign:'center' }}>
        <div className="container">
          <div style={{ fontSize:'5rem', animation:'float 3s ease-in-out infinite' }}>🦸</div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, margin:'1rem 0 .75rem' }}>Lern schlauer. Nicht härter.</h1>
          <p style={{ fontSize:'1.1rem', opacity:.9, maxWidth:560, margin:'0 auto 2rem' }}>
            Hausaufgaben fotografieren → Text erkennen → Fach bestimmen → Aufgaben & Karteikarten erhalten.
          </p>
          <Link to="/lerntechniken" className="btn" style={{ background:'white', color:'#6C63FF', fontSize:'1.05rem' }}>
            📸 Jetzt starten
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign:'center', fontWeight:900, marginBottom:'2rem' }}>So funktioniert LernHeld</h2>
          <div className="grid-2">
            {[
              ['1️⃣','Foto hochladen','Mache ein Foto deines Arbeitsblatts.'],
              ['2️⃣','OCR lokal','Sharp + OpenCV bereiten das Bild vor, Tesseract liest den Text.'],
              ['3️⃣','Fach erkennen','Mistral AI bestimmt Fach und Thema.'],
              ['4️⃣','Aufgaben & Karten','Lernaufgaben und Karteikarten werden automatisch generiert.'],
            ].map(([n,t,d]) => (
              <div key={t} className="card" style={{ borderTop:'4px solid var(--primary)' }}>
                <div style={{ fontSize:'1.5rem' }}>{n}</div>
                <h3 style={{ fontWeight:800, margin:'.4rem 0 .2rem' }}>{t}</h3>
                <p style={{ color:'var(--text-light)', fontSize:'.9rem' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
