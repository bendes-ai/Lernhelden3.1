# LernHeld v3.1 🦸

**Kinder-Lernplattform** · Hausaufgaben-Scanner mit lokaler OCR + Mistral AI

## Stack

| Bereich | Technologie |
|---|---|
| Frontend | React 18 + Vite 5 + TypeScript |
| Backend | Node.js + Express + TypeScript |
| OCR | Tesseract.js 5 (lokal) |
| Bildvorverarbeitung | Sharp (Primär) + OpenCV.js (Fallback) |
| KI-Klassifikation | Mistral AI API |
| Upload | multer |

---

## Schnellstart

```bash
# 1. Repository klonen
git clone https://github.com/dein-user/lernheld.git
cd lernheld

# 2. Abhängigkeiten installieren
cd client && npm install && cd ..
cd server && npm install && cd ..

# 3. .env anlegen
cp .env.example server/.env
# → MISTRAL_API_KEY in server/.env eintragen

# 4. Beide Prozesse starten
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

Browser öffnen: http://localhost:5173

---

## API

### POST /api/homework/upload

```
Content-Type: multipart/form-data
Feld: image (JPG | PNG | WebP, max. 10 MB)
```

**Erfolg:**
```json
{
  "success": true,
  "ocr": { "text": "…", "confidence": 89, "language": "deu", "wordCount": 47, "processingMs": 5200, "method": "sharp" },
  "subject": "Mathematik",
  "topic": "Bruchrechnung",
  "emoji": "🔢",
  "reason": "Viele Bruchzeichen und das Wort Nenner erkannt.",
  "tasks": [{ "id": "t1", "type": "rechnen", "title": "…", "instruction": "…", "difficulty": "medium" }],
  "flashcards": [{ "front": "Was ist ein Nenner?", "back": "Die untere Zahl eines Bruchs.", "hint": "unten = Nenner" }]
}
```

**Fehlercodes:** `KEINE_DATEI` · `FALSCHES_FORMAT` · `DATEI_ZU_GROSS` · `ZU_WENIG_TEXT` · `OCR_FEHLGESCHLAGEN` · `MISTRAL_FEHLER` · `INTERNER_FEHLER`

---

## Bildvorverarbeitung

```
Originalbild
  │
  ├─ Sharp: Graustufen + Kontrast + Schärfen + Binarisierung
  │   └─ OCR ≥ min_chars? → ✅ Fertig (method: "sharp")
  │
  ├─ OpenCV: Adaptive Gaussian Threshold + Morphologisches Cleaning
  │   └─ OCR ≥ min_chars? → ✅ Fertig (method: "opencv")
  │
  └─ Rohbild als letzter Versuch (method: "raw")
```

---

## IONOS Deploy Now

Das Frontend deployt statisch über `.ionos.yaml` (bereits konfiguriert).  
Das Node-Backend benötigt einen **VPS oder separaten Node-Host**.

```bash
git add .
git commit -m "feat: OCR + Mistral + OpenCV"
git push origin main
# → IONOS baut client/ automatisch
```

---

## Datenschutz

- Bilder werden nach OCR sofort gelöscht
- Keine externe OCR-API (Tesseract läuft lokal)
- Kein Nutzer-Tracking
- DSGVO-konform
