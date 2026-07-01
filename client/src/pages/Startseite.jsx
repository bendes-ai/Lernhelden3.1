import React from 'react';
import { Link } from 'react-router-dom';

export default function Startseite() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6,#EC4899)', color:'white', padding:'5rem 0 4rem', textAlign:'center' }}>
        <div className="container">
          <div style={{ fontSize:'5rem', animation:'float 3s ease-in-out infinite' }}>🦸</div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, margin:'1rem 0 .75rem' }}>Lern schlauer. Nicht härter.</h1>
          <p style={{ fontSize:'1.1rem', opacity:.9, maxWidth:640, margin:'0 auto 2rem' }}>
            LernHeld zeigt dir bewährte Lerntechniken, mit denen du dir Vokabeln, Fakten und Prozesse leichter merkst – und erklärt dir, wie du KI beim Lernen sicher und sinnvoll einsetzt.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/lerntechniken" className="btn" style={{ background:'white', color:'#6C63FF', fontSize:'1.05rem' }}>
              🧠 Lerntechniken entdecken
            </Link>
            <Link to="/lern-app" className="btn" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid white', fontSize:'1.05rem' }}>
              📸 Zur Lern-App
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign:'center', fontWeight:900, marginBottom:'1rem' }}>Worum geht es hier?</h2>
          <p style={{ textAlign:'center', maxWidth:700, margin:'0 auto 2rem', color:'var(--text-light)' }}>
            Diese Seite hilft dir, effizienter zu lernen. Du findest hier 22 erprobte Lerntechniken für Vokabeln, Fakten, Texte und Prüfungen – und lernst außerdem, wie du KI-Werkzeuge wie ChatGPT beim Lernen sicher, verantwortungsvoll und ohne Abhängigkeit einsetzt.
          </p>
          <div className="grid-2">
            {[
              ['🧠','Lerntechniken', 'Über 20 Methoden wie Mind Maps, Karteikarten oder die Loci-Technik – mit echten Schulbeispielen zu jedem Fach.'],
              ['🤖','KI sicher nutzen', 'Verstehe, wie KI beim Lernen helfen kann, wo ihre Grenzen liegen und wie du sie verantwortungsvoll einsetzt.'],
              ['📸','Lern-App', 'Fotografiere Hausaufgaben, lass sie automatisch analysieren und erhalte passende Übungsaufgaben und Karteikarten.'],
              ['👨‍👩‍👧','Für Eltern', 'Tipps, wie Eltern den Lernprozess unterstützen können, ohne den Kindern die eigene Verantwortung abzunehmen.'],
            ].map(([icon,t,d]) => (
              <div key={t} className="card" style={{ borderTop:'4px solid var(--primary)' }}>
                <div style={{ fontSize:'1.5rem' }}>{icon}</div>
                <h3 style={{ fontWeight:800, margin:'.4rem 0 .2rem' }}>{t}</h3>
                <p style={{ color:'var(--text-light)', fontSize:'.9rem' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background:'#f8f7ff' }}>
        <div className="container">
          <h2 style={{ textAlign:'center', fontWeight:900, marginBottom:'1.5rem' }}>KI beim Lernen: Chancen und Risiken</h2>
          <div className="grid-2">
            <div className="card" style={{ borderTop:'4px solid #22c55e' }}>
              <h3 style={{ fontWeight:800, marginBottom:'.5rem' }}>✅ Vorteile</h3>
              <ul style={{ color:'var(--text-light)', fontSize:'.9rem', lineHeight:1.6 }}>
                <li>Schnelle Erklärungen zu schwierigen Themen, jederzeit verfügbar.</li>
                <li>Individuelles Üben in deinem eigenen Tempo.</li>
                <li>Hilfe beim Strukturieren von Referaten oder Zusammenfassungen.</li>
              </ul>
            </div>
            <div className="card" style={{ borderTop:'4px solid #ef4444' }}>
              <h3 style={{ fontWeight:800, marginBottom:'.5rem' }}>⚠️ Risiken</h3>
              <ul style={{ color:'var(--text-light)', fontSize:'.9rem', lineHeight:1.6 }}>
                <li>KI kann falsche oder ungenaue Antworten liefern – immer gegenprüfen.</li>
                <li>Zu starke Abhängigkeit verhindert eigenes Denken und echtes Lernen.</li>
                <li>Persönliche Daten sollten nie in KI-Tools eingegeben werden.</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign:'center', marginTop:'2rem' }}>
            <Link to="/ki-sicher" className="btn" style={{ background:'var(--primary)', color:'white' }}>
              🤖 Mehr zu KI-Sicherheit erfahren
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign:'center', fontWeight:900, marginBottom:'2rem' }}>So funktioniert die Lern-App</h2>
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
