import { ApiError, mapApiError } from './errors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutMs = options.signal ? undefined : (endpoint.includes('/chat') ? 60000 : 30000);
  let timeoutId;

  if (timeoutMs) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    options.signal = controller.signal;
  }

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('X-Correlation-ID')) {
    headers.set('X-Correlation-ID', crypto.randomUUID());
  }

  // Auto-attach auth token if available in storage
  const authToken = localStorage.getItem('token') || localStorage.getItem('bis_token');
  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { code: 'UNKNOWN_ERROR', messageKey: 'errors.unknownError' };
      }
      throw new ApiError(response.status, errorBody.code, errorBody.messageKey, errorBody.detail);
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    throw mapApiError(error);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  postForm: <T>(endpoint: string, formData: FormData, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: formData }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Performs real streaming file download and triggers browser save dialog.
   */
  async downloadFile(endpoint: string, fallbackFilename: string = 'document.pdf'): Promise<void> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers();
    const authToken = localStorage.getItem('token') || localStorage.getItem('bis_token');
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      let errorDetail = 'Download failed';
      try {
        const err = await response.json();
        errorDetail = err.detail || err.message || errorDetail;
      } catch {
        // use default
      }
      throw new Error(errorDetail);
    }

    // Extract filename from Content-Disposition header if available
    let filename = fallbackFilename;
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      }
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
};

