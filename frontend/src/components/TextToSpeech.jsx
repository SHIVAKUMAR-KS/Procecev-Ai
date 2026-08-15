import { useState, useEffect } from 'react';

const TTS_LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'en-IN', label: 'English (India)' },
];

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const filteredVoices = voices.filter((v) =>
    v.lang.startsWith(language.split('-')[0])
  );

  const speak = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;

    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="card tts-card">
      <div className="card-header">
        <h2>Text to Speech</h2>
        <span className="badge">Open-source (Browser API)</span>
      </div>

      <textarea
        className="tts-textarea"
        placeholder="Enter text to speak aloud — supports Hindi and English..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />

      <div className="tts-controls">
        <div className="control-group">
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {TTS_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            <option value="">Default</option>
            {filteredVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Speed: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="action-buttons">
        {!isSpeaking ? (
          <button className="btn btn-primary" onClick={speak} disabled={!text.trim()}>
            Speak
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stop}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
