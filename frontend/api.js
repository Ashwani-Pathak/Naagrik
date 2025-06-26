const API_BASE = 'http://localhost:5000/api'; // Change if backend runs elsewhere

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, url, data) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const opts = {
    method,
    headers,
  };
  if (data) opts.body = JSON.stringify(data);
  const res = await fetch(API_BASE + url, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

async function upload(url, file, field = 'image') {
  const token = getToken();
  const formData = new FormData();
  formData.append(field, file);
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + url, {
    method: 'POST',
    headers,
    body: formData
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

async function putForm(url, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + url, {
    method: 'PUT',
    headers,
    body: formData
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

async function postForm(url, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + url, {
    method: 'POST',
    headers,
    body: formData
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  del: (url) => request('DELETE', url),
  upload,
  putForm,
  postForm
}; 