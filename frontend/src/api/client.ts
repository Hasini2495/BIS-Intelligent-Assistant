import { ApiError,  mapApiError } from './errors';

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

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { code: 'UNKNOWN_ERROR', messageKey: 'errors.unknownError' };
      }
      throw new ApiError(response.status, errorBody.code, errorBody.messageKey, errorBody.detail);
    }
    
    if (response.status === 204) {
      return null as any;
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
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
