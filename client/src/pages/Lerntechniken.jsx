import React, { useState } from 'react';
import './Lerntechniken.css';

const KATEGORIEN = [
  { key: 'alle', label: 'Alle Techniken', icon: '🔍' },
  { key: 'vokabeln', label: 'Vokabeln', icon: '🔤' },
  { key: 'fakten', label: 'Fakten', icon: '📌' },
  { key: 'prozesse', label: 'Prozesse', icon: '⚗️' },
  { key: 'texte', label: 'Texte', icon: '📖' },
  { key: 'referate', label: 'Referate', icon: '🎤' },
  { key: 'pruefungen', label: 'Prüfungen', icon: '📝' },
];

const TAG_STYLES = {
  visualisieren: { bg: '#fde3d3', color: '#b45309', icon: '🎨' },
  strukturieren: { bg: '#dbeafe', color: '#1d4ed8', icon: '🗂️' },
  reduzieren: { bg: '#dcfce7', color: '#15803d', icon: '🎯' },
  spannung: { bg: '#fef3c7', color: '#a16207', icon: '⚡' },
  verknuepfen: { bg: '#cffafe', color: '#0e7490', icon: '🔗' },
};

const TECHNIKEN = [
  {
    id: 'loci',
    titel: 'Loci-Technik',
    icon: '🏠',
    tags: ['visualisieren', 'verknuepfen'],
    kategorien: ['vokabeln', 'fakten'],
    kurzbeschreibung: 'Du gehst in Gedanken durch ein bekanntes Haus und platzierst Infos als verrückte Bilder.',
    zeit: 'ab 15 Min.',
    level: 'Mittel',
    borderColor: '#ef4444',
    beispiele: [
      {
        titel: 'Vokabeln lernen',
        text: 'Platziere 10 Vokabeln als Bilder in deinem Zuhause – hole sie in Gedanken ab.',
        detail: 'Geh gedanklich durch dein Zuhause und lege an jeder Station (Eingangstür, Flur, Küche, Wohnzimmer, dein Zimmer...) ein Bild für eine Vokabel ab. Willst du z. B. "the apple" lernen, stell dir einen riesigen roten Apfel vor, der auf deinem Bett liegt. Beim Abfragen gehst du gedanklich den gleichen Weg noch einmal ab und "siehst" die Bilder wieder.',
      },
      {
        titel: 'Planetenreihenfolge',
        text: 'Lege die 5 Planeten entlang deines Schulweges ab.',
        detail: 'Ordne jedem markanten Punkt auf deinem Schulweg einen Planeten zu, z. B. Merkur an der Haustür, Venus an der Bushaltestelle, Erde am Zebrastreifen. Je verrückter das Bild (ein riesiger, glühender Merkur klebt an deiner Tür), desto besser bleibt die Reihenfolge im Kopf.',
      },
      {
        titel: 'Versuchsablauf in Chemie/Physik',
        text: 'Merke dir Experiment-Schritte in verschiedenen Räumen.',
        detail: 'Jeder Schritt eines Experiments (z. B. Becherglas füllen, erhitzen, Farbwechsel beobachten) bekommt einen eigenen Raum in deiner Wohnung zugewiesen. So kannst du dir die komplette Versuchsreihenfolge merken, ohne sie stur auswendig zu lernen.',
      },
    ],
    tipp: 'Je verrückter und bunter deine Bilder, desto besser bleiben sie im Gedächtnis!',
  },
  {
    id: 'mindmaps',
    titel: 'Mind Maps',
    icon: '🕸️',
    tags: ['visualisieren', 'strukturieren', 'verknuepfen'],
    kategorien: ['texte', 'referate', 'prozesse'],
    kurzbeschreibung: 'Schreibe ein Hauptthema in die Mitte und zeichne Äste mit Unterthemen.',
    zeit: 'ab 10 Min.',
    level: 'Einfach',
    borderColor: '#facc15',
    beispiele: [
      {
        titel: 'Referat vorbereiten',
        text: 'Hauptthema in die Mitte, Unterpunkte als Äste.',
        detail: 'Schreib dein Referatsthema (z. B. "Der Wasserkreislauf") in die Mitte eines Blattes. Zeichne von dort Äste zu den Hauptaspekten (Verdunstung, Wolkenbildung, Niederschlag, Versickerung) und von jedem Ast wieder kleinere Zweige mit Details, Zahlen oder Beispielen. So siehst du auf einen Blick die komplette Struktur deines Vortrags.',
      },
      {
        titel: 'Textzusammenfassung',
        text: 'Kapitel eines Buches als Mind Map festhalten.',
        detail: 'Statt Fließtext zu schreiben, ordnest du Charaktere, Handlungsorte und Ereignisse eines Kapitels als verzweigte Äste an. Farben helfen dabei, verschiedene Handlungsstränge auseinanderzuhalten.',
      },
    ],
    tipp: 'Nutze für jeden Hauptast eine andere Farbe – das hilft deinem Gehirn, Kategorien schneller zu erkennen.',
  },
  {
    id: 'schluesselwort',
    titel: 'Schlüsselwortmethode',
    icon: '🔑',
    tags: ['verknuepfen', 'visualisieren'],
    kategorien: ['vokabeln'],
    kurzbeschreibung: 'Suche für ein fremdes Wort ein ähnlich klingendes deutsches Wort und baue daraus ein Bild.',
    zeit: 'ab 5 Min.',
    level: 'Einfach',
    borderColor: '#3b82f6',
    beispiele: [
      {
        titel: 'Englisch-Vokabel "carpet" (Teppich)',
        text: 'Klingt wie "Karpfen" – stell dir einen Karpfen vor, der auf einem Teppich liegt.',
        detail: 'Das deutsche Klangwort "Karpfen" dient als Brücke zum englischen Wort "carpet". Du malst dir bildlich aus, wie ein nasser Karpfen auf einem edlen Teppich zappelt. Diese witzige, ungewöhnliche Verbindung bleibt viel länger im Gedächtnis als reines Pauken.',
      },
      {
        titel: 'Lateinische Vokabel "canis" (Hund)',
        text: 'Klingt wie "Kanister" – stell dir einen Hund vor, der aus einem Kanister trinkt.',
        detail: 'Verbinde das Klangbild "Kanister" mit einem lustigen Bild: ein Hund, der seinen Kopf in einen Benzinkanister steckt, um daraus zu trinken. Diese absurde Szene macht das Merken leichter als stures Wiederholen.',
      },
    ],
    tipp: 'Funktioniert am besten bei Fremdsprachen-Vokabeln mit ungewöhnlichem Klang.',
  },
  {
    id: 'lesetechnik5',
    titel: '5-Schritt-Lesetechnik',
    icon: '📖',
    tags: ['strukturieren', 'reduzieren'],
    kategorien: ['texte', 'pruefungen'],
    kurzbeschreibung: 'Überfliegen → Fragen → Lesen → Zusammenfassen → Wiederholen.',
    zeit: 'ab 20 Min.',
    level: 'Mittel',
    borderColor: '#f97316',
    beispiele: [
      {
        titel: 'Sachtext in Bio/Erdkunde',
        text: 'Erst überfliegen, dann Fragen stellen, lesen, zusammenfassen, wiederholen.',
        detail: 'Schritt 1: Überfliege Überschriften, Bilder und fett gedruckte Wörter. Schritt 2: Formuliere aus den Überschriften eigene Fragen (z. B. "Warum sinkt der Meeresspiegel nicht trotz Gletscherschmelze?"). Schritt 3: Lies den Text gezielt, um deine Fragen zu beantworten. Schritt 4: Schreibe die Antworten in 2-3 eigenen Sätzen zusammen. Schritt 5: Wiederhole die Zusammenfassung nach einem Tag, ohne den Text erneut zu lesen.',
      },
      {
        titel: 'Kapitel im Deutschbuch',
        text: 'Struktur nutzen, um ein Kapitel effizient zu erfassen.',
        detail: 'Statt das komplette Kapitel Wort für Wort zu lesen, verschaffst du dir zuerst einen Überblick über Abschnittsüberschriften und Merksätze am Rand. Erst danach liest du im Detail und fasst jeden Abschnitt in einem Satz zusammen.',
      },
    ],
    tipp: 'Die Fragen aus Schritt 2 sind der wichtigste Teil – sie geben deinem Lesen ein klares Ziel.',
  },
  {
    id: 'konzentrationsanker',
    titel: 'Konzentrationsanker',
    icon: '⚓',
    tags: ['spannung'],
    kategorien: ['pruefungen', 'prozesse'],
    kurzbeschreibung: 'Ein persönliches Ritual, das dir hilft, sofort konzentriert zu werden.',
    zeit: 'ab 5 Min.',
    level: 'Einfach',
    borderColor: '#eab308',
    beispiele: [
      {
        titel: 'Vor Hausaufgaben',
        text: 'Immer die gleiche kurze Routine vor dem Lernen durchführen.',
        detail: 'Lege dir ein festes Mini-Ritual zurecht, z. B. Fenster öffnen, tief durchatmen, Handy in den Flugmodus stellen, dann genau denselben Stift zum Schreiben nutzen. Nach ein paar Wiederholungen verknüpft dein Gehirn dieses Ritual automatisch mit "jetzt wird konzentriert gearbeitet".',
      },
      {
        titel: 'Vor einer Klassenarbeit',
        text: 'Kurzer Anker direkt vor dem Testbeginn.',
        detail: 'Balle kurz beide Hände zu Fäusten und öffne sie wieder, während du dreimal tief durchatmest. Wiederhole das vor jeder Arbeit – dein Gehirn lernt, dieses Signal mit Ruhe und Fokus zu verknüpfen.',
      },
    ],
    tipp: 'Wichtig ist nicht das Ritual selbst, sondern dass du es wirklich jedes Mal exakt gleich durchführst.',
  },
  {
    id: 'kettenmethode',
    titel: 'Kettenmethode',
    icon: '⛓️',
    tags: ['verknuepfen', 'visualisieren'],
    kategorien: ['vokabeln', 'fakten'],
    kurzbeschreibung: 'Verbinde Begriffe wie Kettenglieder in einer verrückten Geschichte.',
    zeit: 'ab 10 Min.',
    level: 'Einfach',
    borderColor: '#0ea5e9',
    beispiele: [
      {
        titel: 'Einkaufsliste oder Aufzählung',
        text: 'Begriffe zu einer zusammenhängenden Geschichte verketten.',
        detail: 'Willst du dir "König Ludwig, Dampfmaschine, Eisenbahn, Fabrik" merken, erfinde eine kurze absurde Geschichte: "König Ludwig fährt mit einer Dampfmaschine, die er selbst erfunden hat, mit der Eisenbahn direkt in eine Fabrik." Jedes Wort baut auf dem vorherigen auf wie ein Kettenglied.',
      },
      {
        titel: 'Geschichtliche Ereigniskette',
        text: 'Historische Ereignisse in ihrer Reihenfolge verknüpfen.',
        detail: 'Verbinde einzelne Jahreszahlen und Ereignisse zu einer bildhaften Mini-Story, sodass sich das nächste Ereignis logisch aus dem vorherigen "ergibt" – auch wenn die Verbindung inhaltlich frei erfunden ist.',
      },
    ],
    tipp: 'Je absurder die Geschichte, desto leichter erinnerst du dich an die Reihenfolge.',
  },
  {
    id: 'highfive',
    titel: 'High-Five-Methode',
    icon: '🖐️',
    tags: ['reduzieren', 'strukturieren'],
    kategorien: ['referate', 'pruefungen'],
    kurzbeschreibung: 'Genau 5 Kernpunkte – einen pro Finger.',
    zeit: 'ab 10 Min.',
    level: 'Einfach',
    borderColor: '#22c55e',
    beispiele: [
      {
        titel: 'Referat auf 5 Punkte reduzieren',
        text: 'Jeder Finger deiner Hand steht für einen Hauptpunkt.',
        detail: 'Ordne deinem Daumen den Einstieg zu, dem Zeigefinger den ersten Hauptpunkt, dem Mittelfinger den zweiten, dem Ringfinger den dritten und dem kleinen Finger den Schluss. Wenn du beim Vortrag den Faden verlierst, schaust du einfach auf deine Hand.',
      },
      {
        titel: 'Zusammenfassung eines Kapitels',
        text: 'Nur die 5 wichtigsten Informationen behalten.',
        detail: 'Statt ganze Absätze zu lernen, zwingst du dich, jedes Kapitel auf exakt 5 Stichpunkte zu reduzieren – das trainiert gleichzeitig, das Wesentliche vom Nebensächlichen zu unterscheiden.',
      },
    ],
    tipp: 'Die Begrenzung auf genau 5 Punkte verhindert, dass du dich in Details verlierst.',
  },
  {
    id: 'karteikarten',
    titel: 'Karteikartensystem',
    icon: '🗄️',
    tags: ['strukturieren', 'reduzieren'],
    kategorien: ['vokabeln', 'fakten'],
    kurzbeschreibung: 'Vorne Frage, hinten Antwort – mit 5-Fächer-System lernst du nur, was du noch nicht kannst.',
    zeit: 'ab 15 Min.',
    level: 'Mittel',
    borderColor: '#f43f5e',
    beispiele: [
      {
        titel: 'Vokabeltraining',
        text: 'Karten wandern je nach Erfolg durch 5 Fächer.',
        detail: 'Jede Karte startet in Fach 1. Beantwortest du sie richtig, wandert sie ins nächste Fach; bei einem Fehler wandert sie zurück in Fach 1. Fach 1 wird täglich abgefragt, Fach 5 nur noch einmal im Monat. So konzentrierst du deine Lernzeit automatisch auf das, was du noch nicht sicher beherrschst.',
      },
      {
        titel: 'Formeln in Mathe/Physik',
        text: 'Formel auf der Vorderseite, Herleitung/Anwendung auf der Rückseite.',
        detail: 'Schreib auf die Vorderseite nur die Formel (z. B. "Kraft = Masse × Beschleunigung") und auf die Rückseite ein konkretes Rechenbeispiel dazu. So verknüpfst du die abstrakte Formel direkt mit einer praktischen Anwendung.',
      },
    ],
    tipp: 'Sei ehrlich bei der Selbsteinschätzung – nur so funktioniert das Fächersystem richtig.',
  },
  {
    id: 'mnemo',
    titel: 'Mnemo-Techniken',
    icon: '🧠',
    tags: ['verknuepfen', 'spannung'],
    kategorien: ['fakten', 'vokabeln'],
    kurzbeschreibung: 'Eselsbrücken, Akronyme und Reime für schwierige Dinge.',
    zeit: 'ab 5 Min.',
    level: 'Einfach',
    borderColor: '#facc15',
    beispiele: [
      {
        titel: 'Himmelsrichtungen merken',
        text: '"Nie Ohne Seife Waschen" für Nord-Ost-Süd-West.',
        detail: 'Der erste Buchstabe jedes Wortes im Merksatz entspricht der jeweiligen Himmelsrichtung in der richtigen Reihenfolge im Uhrzeigersinn: Nord, Ost, Süd, West. Solche Merksätze funktionieren besonders gut bei Reihenfolgen, die keine logische innere Struktur haben.',
      },
      {
        titel: 'Mathematische Konstante Pi',
        text: 'Ein Satz, bei dem die Wortlängen den Ziffern von Pi entsprechen.',
        detail: 'Bilde einen Merksatz, bei dem die Buchstabenanzahl jedes Wortes einer Ziffer von Pi entspricht (3,14159...), z. B. "Wie(3) sich(4) manch(5) beklemmt(9)...". Diese Technik nennt man ein "Piphilologie"-Gedicht.',
      },
    ],
    tipp: 'Erfinde deine eigenen, möglichst witzigen oder peinlichen Eselsbrücken – die bleiben am besten hängen.',
  },
  {
    id: 'wissenspaarty',
    titel: 'WissensPAARty',
    icon: '👫',
    tags: ['spannung', 'verknuepfen'],
    kategorien: ['pruefungen', 'vokabeln'],
    kurzbeschreibung: 'Lernen mit einem Partner – gegenseitig abfragen und erklären.',
    zeit: 'ab 15 Min.',
    level: 'Einfach',
    borderColor: '#fb923c',
    beispiele: [
      {
        titel: 'Vokabeln gegenseitig abfragen',
        text: 'Ihr wechselt euch beim Fragen und Antworten ab.',
        detail: 'Jeder bereitet vorher eine Liste mit Karteikarten vor. Ihr wechselt euch ab: Person A fragt, Person B antwortet und erklärt zusätzlich, warum die Antwort richtig ist. Das Erklären verstärkt das Verständnis zusätzlich zum reinen Abfragen.',
      },
      {
        titel: 'Gegenseitiges Erklären eines Themas',
        text: 'Jeder erklärt dem anderen die Hälfte des Stoffs.',
        detail: 'Teilt den Lernstoff in zwei Hälften auf. Jeder lernt seine Hälfte gründlich und erklärt sie danach dem Partner mit eigenen Worten – wer etwas erklären kann, hat es wirklich verstanden.',
      },
    ],
    tipp: 'Sucht euch einen Partner mit ähnlichem Lerntempo, damit keiner gebremst oder gehetzt wird.',
  },
  {
    id: 'koerperliste',
    titel: 'Körperliste',
    icon: '🧍',
    tags: ['visualisieren', 'verknuepfen'],
    kategorien: ['fakten', 'vokabeln'],
    kurzbeschreibung: 'Dein Körper wird zur Merkhilfe – Infos Körperstellen zuweisen.',
    zeit: 'ab 10 Min.',
    level: 'Einfach',
    borderColor: '#dc2626',
    beispiele: [
      {
        titel: 'Reihenfolge von Ereignissen',
        text: 'Jeder Körperteil steht für einen Schritt oder Fakt.',
        detail: 'Ordne z. B. den Füßen den ersten Punkt zu, den Knien den zweiten, dem Bauch den dritten, der Brust den vierten und dem Kopf den fünften. Beim Abfragen tastest du gedanklich (oder wirklich) deinen Körper von unten nach oben ab und erinnerst dich an jeder Stelle an den zugehörigen Punkt.',
      },
      {
        titel: 'Vokabeln mit Körperbezug',
        text: 'Wörter mit passenden Körperstellen verknüpfen.',
        detail: 'Bei der Vokabel "shoulder" (Schulter) legst du das Bild direkt auf deine eigene Schulter – du fasst kurz dorthin, während du das Wort wiederholst. Diese körperliche Verankerung macht das Erinnern greifbarer.',
      },
    ],
    tipp: 'Nutze immer die gleiche Körper-Reihenfolge, damit sich das System bei dir automatisiert.',
  },
  {
    id: 'spickzettel',
    titel: 'Spickzettel',
    icon: '📄',
    tags: ['reduzieren', 'strukturieren'],
    kategorien: ['pruefungen'],
    kurzbeschreibung: 'Erstelle einen Spickzettel, den du NIE nutzt – das Erstellen ist der Lerneffekt!',
    zeit: 'ab 15 Min.',
    level: 'Einfach',
    borderColor: '#16a34a',
    beispiele: [
      {
        titel: 'Formelsammlung selbst erstellen',
        text: 'Alle wichtigen Formeln auf eine Karteikarte reduzieren.',
        detail: 'Schreib dir jede Formel eines Themengebiets so kompakt wie möglich auf eine einzige Karteikarte. Der Trick: Du sollst diese Karte nie in der Prüfung benutzen – allein das Auswählen und Verdichten der wichtigsten Infos ist der eigentliche Lerneffekt.',
      },
      {
        titel: 'Zusammenfassung eines ganzen Themengebiets',
        text: 'Ein komplettes Kapitel auf eine DIN-A5-Karte verdichten.',
        detail: 'Zwinge dich, ein ganzes Kapitel auf eine einzige kleine Karte zu reduzieren. Dieser radikale Reduktionsprozess sorgt dafür, dass du dich wirklich intensiv mit dem Stoff auseinandersetzt und nur die Kernaussagen herausfilterst.',
      },
    ],
    tipp: 'Auch wenn der Zettel nie benutzt wird, solltest du ihn wie einen "echten" Spickzettel gestalten – das erhöht den Lerneffekt zusätzlich.',
  },
];

export default function Lerntechniken() {
  const [aktiveKategorie, setAktiveKategorie] = useState('alle');
  const [offeneKarten, setOffeneKarten] = useState({});

  const gefilterte = TECHNIKEN.filter(
    (t) => aktiveKategorie === 'alle' || t.kategorien.includes(aktiveKategorie)
  );

  const toggleKarte = (id) => {
    setOffeneKarten((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="lerntechniken-page">
      <div className="lerntechniken-header">
        <span className="lerntechniken-emoji">🧠</span>
        <h1>22 Lerntechniken entdecken</h1>
        <p>Für jedes Fach und jeden Lerntyp – mit echten Schulbeispielen.</p>
      </div>

      <div className="kategorie-filter">
        {KATEGORIEN.map((k) => (
          <button
            key={k.key}
            className={`kategorie-btn ${aktiveKategorie === k.key ? 'aktiv' : ''}`}
            onClick={() => setAktiveKategorie(k.key)}
          >
            <span>{k.icon}</span> {k.label}
          </button>
        ))}
      </div>

      <div className="technik-grid">
        {gefilterte.map((t) => {
          const offen = !!offeneKarten[t.id];
          return (
            <div key={t.id} className="technik-karte" style={{ borderTopColor: t.borderColor }}>
              <div className="technik-kopf">
                <span className="technik-icon">{t.icon}</span>
                <h3>{t.titel}</h3>
              </div>

              <div className="technik-tags">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    style={{ backgroundColor: TAG_STYLES[tag].bg, color: TAG_STYLES[tag].color }}
                  >
                    {TAG_STYLES[tag].icon} {tag}
                  </span>
                ))}
              </div>

              <p className="technik-kurzbeschreibung">{t.kurzbeschreibung}</p>

              <div className="technik-meta">
                <span>⏱ {t.zeit}</span>
                <span>{t.level === 'Einfach' ? '✅' : '⚡'} {t.level}</span>
                <button className="beispiele-toggle" onClick={() => toggleKarte(t.id)}>
                  {offen ? '▲ Weniger' : '▼ Beispiele'}
                </button>
              </div>

              {offen && (
                <div className="schulbeispiele">
                  <h4>📚 Schulbeispiele:</h4>
                  {t.beispiele.map((b, i) => (
                    <div key={i} className="beispiel-block">
                      <p className="beispiel-titel">→ {b.titel}</p>
                      <p className="beispiel-kurz">{b.text}</p>
                      <p className="beispiel-detail">{b.detail}</p>
                    </div>
                  ))}
                  {t.tipp && (
                    <div className="tipp-box">
                      💡 {t.tipp}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
