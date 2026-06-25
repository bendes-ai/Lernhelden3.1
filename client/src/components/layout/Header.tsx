import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to:'/',               label:'🏠 Start' },
  { to:'/lerntechniken',  label:'🧠 Lerntechniken' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const linkStyle = (to: string): React.CSSProperties => ({
    color:'white', textDecoration:'none', padding:'.45rem .9rem',
    borderRadius:'999px', fontWeight:700, fontSize:'.9rem',
    background: pathname === to ? 'rgba(255,255,255,.25)' : 'transparent',
  });
  return (
    <header style={{ background:'linear-gradient(135deg,#6C63FF,#8B5CF6)', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 20px rgba(108,99,255,.3)' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'.5rem' }}>
          <span style={{ fontSize:'1.8rem' }}>🦸</span>
          <span style={{ color:'white', fontWeight:900, fontSize:'1.2rem' }}>LernHeld</span>
        </Link>
        <nav style={{ display:'flex', gap:'.25rem' }}>
          {NAV.map(n => <Link key={n.to} to={n.to} style={linkStyle(n.to)}>{n.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
