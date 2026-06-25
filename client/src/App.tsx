import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Startseite from './pages/Startseite';
import Lerntechniken from './pages/Lerntechniken';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/lerntechniken" element={<Lerntechniken />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
