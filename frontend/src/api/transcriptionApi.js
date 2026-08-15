const API_BASE = '/api/transcriptions';
const DIRECT_BACKEND = 'http://localhost:8080/api/transcriptions';

async function requestWithFallback(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (res.ok) {
      return await res.json();
    }
    // If not OK, try backend directly
    const directRes = await fetch(`${DIRECT_BACKEND}${path}`, options);
    if (!directRes.ok) {
      const err = await directRes.json().catch(() => ({}));
      throw new Error(err.message || err.error || `HTTP error ${directRes.status}`);
    }
    return await directRes.json();
  } catch (initialErr) {
    // Network or proxy error, fallback to direct backend URL
    const directRes = await fetch(`${DIRECT_BACKEND}${path}`, options);
    if (!directRes.ok) {
      const err = await directRes.json().catch(() => ({}));
      throw new Error(err.message || err.error || `HTTP error ${directRes.status}`);
    }
    return await directRes.json();
  }
}

export async function fetchTranscriptions() {
  return requestWithFallback('');
}

export async function createTranscription(data) {
  return requestWithFallback('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateTranscription(id, data) {
  return requestWithFallback(`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteTranscription(id) {
  return requestWithFallback(`/${id}`, {
    method: 'DELETE',
  });
}

export async function checkHealth() {
  return requestWithFallback('/health');
}
