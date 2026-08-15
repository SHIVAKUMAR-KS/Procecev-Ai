import { useState, useEffect, useRef, useCallback } from 'react';
import { formatMixedHindiEnglish } from '../utils/hinglishProcessor';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const LANGUAGE_OPTIONS = [
  { code: 'hi-IN,en-IN', label: 'Hindi + English (Mixed)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'en-IN', label: 'English (India)' },
];

export default function SpeechRecorder({ onSave, interimText, setInterimText }) {
  const [isListening, setIsListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [language, setLanguage] = useState('hi-IN,en-IN');
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let finalTranscript = '';
      const isMixedOrHindi = languageRef.current.includes('hi') || languageRef.current.includes(',');

      for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript;

        // When Hindi+English or Hindi is active, format mixed speech in real time
        if (isMixedOrHindi) {
          transcript = formatMixedHindiEnglish(transcript);
        }

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript) {
        setFinalText((prev) => {
          const combined = prev + finalTranscript;
          return isMixedOrHindi ? formatMixedHindiEnglish(combined) : combined;
        });
      }

      setInterimText(isMixedOrHindi ? formatMixedHindiEnglish(interim) : interim);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [setInterimText]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language.includes(',')
        ? 'hi-IN'
        : language;
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setInterimText('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          setError(`Could not start recognition: ${e.message}`);
          setIsListening(false);
        }
      }, 200);
    }
  }, [setInterimText]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearText = () => {
    setFinalText('');
    setInterimText('');
    setError(null);
  };

  const displayText = (finalText + (interimText ? ' ' + interimText : '')).trim();

  const handleSave = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    const text = displayText;
    if (!text) {
      setError('Nothing to save. Please speak first.');
      return;
    }
    try {
      await onSave({
        text,
        language: language.includes(',') ? 'Hindi + English' : language,
        confidenceScore: 0.95,
      });
      clearText();
    } catch (err) {
      setError(err?.message || 'Failed to save transcription');
    }
  };

  if (!supported) {
    return (
      <div className="card error-card">
        <p>Your browser does not support the Web Speech API. Please use Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="card speech-card">
      <div className="card-header">
        <h2>Real-time Speech to Text</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening}
          className="language-select"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`mic-indicator ${isListening ? 'active' : ''}`}>
        <div className="mic-circle">
          <span className="mic-icon">{isListening ? '🎙️' : '🎤'}</span>
        </div>
        <p className="status-text">
          {isListening ? 'Listening... Speak now' : 'Click Start to begin speaking'}
        </p>
        {isListening && (
          <div className="pulse-rings">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="transcript-box">
        <label>Live Transcript</label>
        <div className="transcript-content">
          {displayText || (
            <span className="placeholder">
              Your speech will appear here in real-time...
              <br />
              Try mixing Hindi and English — e.g. &quot;हेलो क्या मेरी आवाज आ रही है are you able to listen me&quot;
            </span>
          )}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="action-buttons">
        {!isListening ? (
          <button className="btn btn-primary" onClick={startListening}>
            Start Listening
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopListening}>
            Stop
          </button>
        )}
        <button className="btn btn-secondary" onClick={clearText} disabled={isListening}>
          Clear
        </button>
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={!displayText}
        >
          Save Transcription
        </button>
      </div>
    </div>
  );
}
