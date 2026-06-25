import React from 'react';
export default function Footer() {
  return (
    <footer style={{ background:'#1A1A2E', color:'rgba(255,255,255,.6)', padding:'2rem 0', textAlign:'center', fontSize:'.85rem' }}>
      <p>🦸 LernHeld — Kostenlos, datenschutzkonform, lokal.</p>
      <p style={{ marginTop:'.4rem', fontSize:'.78rem', opacity:.6 }}>OCR läuft lokal · KI: Mistral · Kein Tracking</p>
    </footer>
  );
}
