import { useState, useEffect, useCallback } from 'react';
import SpeechRecorder from './components/SpeechRecorder';
import TranscriptionDashboard from './components/TranscriptionDashboard';
import TextToSpeech from './components/TextToSpeech';
import {
  fetchTranscriptions,
  createTranscription,
  checkHealth,
} from './api/transcriptionApi';
import './index.css';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [toast, setToast] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [activeTab, setActiveTab] = useState('record');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTranscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTranscriptions();
      setTranscriptions(data);
    } catch {
      showToast('Failed to load transcriptions', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth()
      .then(() => {
        setBackendStatus('online');
        loadTranscriptions();
      })
      .catch(() => setBackendStatus('offline'));
  }, [loadTranscriptions]);

  const handleSave = async (data) => {
    try {
      await createTranscription(data);
      showToast('Transcription saved successfully!');
      loadTranscriptions();
      setActiveTab('history');
    } catch (err) {
      showToast(err?.message || 'Failed to save transcription', 'error');
      throw err;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Speech to Text</h1>
          <p className="subtitle">Real-time Multilingual Transcription Service</p>
        </div>
        <div className={`status-badge ${backendStatus}`}>
          <span className="status-dot"></span>
          Backend: {backendStatus}
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          Record
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History ({transcriptions.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'tts' ? 'active' : ''}`}
          onClick={() => setActiveTab('tts')}
        >
          Text to Speech
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'record' && (
          <SpeechRecorder
            onSave={handleSave}
            interimText={interimText}
            setInterimText={setInterimText}
          />
        )}
        {activeTab === 'history' && (
          <TranscriptionDashboard
            transcriptions={transcriptions}
            onRefresh={loadTranscriptions}
            loading={loading}
          />
        )}
        {activeTab === 'tts' && <TextToSpeech />}
      </main>

      <footer className="app-footer">
        <p>
          Powered by Web Speech API (open-source browser engine) &bull; Spring Boot + MySQL/H2
        </p>
      </footer>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
