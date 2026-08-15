import { useState } from 'react';
import { deleteTranscription, updateTranscription } from '../api/transcriptionApi';

export default function TranscriptionDashboard({ transcriptions, onRefresh, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editLanguage, setEditLanguage] = useState('');
  const [actionError, setActionError] = useState(null);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditLanguage(item.language || '');
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditLanguage('');
  };

  const handleUpdate = async (id) => {
    try {
      await updateTranscription(id, {
        text: editText,
        language: editLanguage,
      });
      cancelEdit();
      onRefresh();
    } catch {
      setActionError('Failed to update transcription');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transcription?')) return;
    try {
      await deleteTranscription(id);
      onRefresh();
    } catch {
      setActionError('Failed to delete transcription');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="card dashboard-card">
      <div className="card-header">
        <h2>Transcription History</h2>
        <button className="btn btn-secondary btn-sm" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {actionError && <div className="error-msg">{actionError}</div>}

      {transcriptions.length === 0 ? (
        <div className="empty-state">
          <p>No transcriptions yet. Start speaking and save your first one!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="transcription-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Text</th>
                <th>Language</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transcriptions.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="text-cell">
                    {editingId === item.id ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="edit-textarea"
                      />
                    ) : (
                      item.text
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        className="edit-input"
                        placeholder="Language"
                      />
                    ) : (
                      item.language || '-'
                    )}
                  </td>
                  <td className="date-cell">{formatDate(item.createdAt)}</td>
                  <td className="actions-cell">
                    {editingId === item.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate(item.id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => startEdit(item)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
