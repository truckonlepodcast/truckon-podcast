import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import logo from './assets/truckon-logo.jpg';

function App() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/rss?url=https://anchor.fm/s/ac4f88bc/podcast/rss');
        if (!res.ok) throw new Error('Erreur serveur ' + res.status);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const items = Array.from(xml.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || 'Sans titre',
          audio: item.querySelector('enclosure')?.getAttribute('url') || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent || ''
        }));
        setEpisodes(items);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial'}}>
      <div style={{textAlign: 'center', marginBottom: '24px'}}>
        <img src={logo} alt="Truck On Logo" style={{width: '150px', borderRadius: '12px'}} />
        <h1>🚛 Truck On – Le Podcast</h1>
        <p>Bienvenue dans l'application officielle pour écouter nos épisodes.</p>
      </div>

      {loading && <p>Chargement des épisodes…</p>}
      {error && <p style={{color:'red'}}>Erreur : {error}</p>}

      {!loading && !error && (
        <div>
          {episodes.map((ep, idx) => (
            <div key={idx} style={{border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: '16px'}}>
              <h2 style={{marginTop: 0}}>{ep.title}</h2>
              <p><strong>Date :</strong> {ep.pubDate}</p>
              <div dangerouslySetInnerHTML={{__html: ep.description}}></div>
              {ep.audio && <audio controls src={ep.audio} style={{width: '100%', marginTop: '8px'}} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
