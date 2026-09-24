export class ApiError extends Error {
  status: number;
  code: string;
  messageKey: string;

  constructor(status: number, code: string, messageKey: string, message?: string) {
    super(message || messageKey);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.messageKey = messageKey;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ApiContractError extends Error {
  constructor(message = 'API contract violation') {
    super(message);
    this.name = 'ApiContractError';
  }
}

export function mapApiError(error: any): Error {
  if (error instanceof ApiError || error instanceof NetworkError || error instanceof TimeoutError || error instanceof ApiContractError) {
    return error;
  }
  if (error.name === 'AbortError') {
    return new TimeoutError();
  }
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new NetworkError();
  }
  return new Error('Unknown error');
}
