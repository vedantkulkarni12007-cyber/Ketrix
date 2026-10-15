import axios from 'axios';

/**
 * Normalizes the API base URL.
 * Handles cases where VITE_API_BASE_URL is provided with or without `/api/v1`,
 * with or without trailing slashes, or missing entirely.
 */
export const normalizeApiBaseUrl = (rawUrl) => {
  const defaultBase = 'http://localhost:8000/api/v1';
  if (!rawUrl || typeof rawUrl !== 'string') {
    return defaultBase;
  }
  let trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return defaultBase;
  }
  if (trimmed.endsWith('/api/v1')) {
    return trimmed;
  }
  if (trimmed.endsWith('/api')) {
    return `${trimmed}/v1`;
  }
  return `${trimmed}/api/v1`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

/**
 * Derives the server root URL (e.g., for /health).
 */
export const getApiRootUrl = (baseUrl = API_BASE_URL) => {
  return baseUrl.replace(/\/api\/v1\/?$/, '');
};

/**
 * Formats API / Network / Validation errors into human-readable messages.
 */
export const formatErrorMessage = (error) => {
  if (!error) {
    return 'An unexpected error occurred during quantum simulation.';
  }

  if (typeof error === 'string') {
    return error;
  }

  // Axios HTTP error with server response
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (data?.detail) {
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail)) {
        // FastAPI validation errors (422)
        return data.detail
          .map((item) => {
            const loc = Array.isArray(item.loc) ? item.loc.filter(k => k !== 'body').join('.') : '';
            return loc ? `${loc}: ${item.msg}` : item.msg;
          })
          .join('; ');
      }
      if (typeof data.detail === 'object') {
        return JSON.stringify(data.detail);
      }
    }

    if (data?.message) {
      return data.message;
    }

    if (status === 404) {
      return 'Simulation endpoint not found (404). Please verify the backend service URL and version.';
    }
    if (status >= 500) {
      return `Backend simulation service error (${status}). The quantum engine encountered a fault.`;
    }
    return `Simulation request rejected with status code ${status}.`;
  }

  // Network or timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Simulation request timed out. The backend server may be waking up from cold start; please retry in a few seconds.';
  }

  if (error.message === 'Network Error' || !error.response) {
    return 'Network Error: Unable to reach the simulation backend. Please ensure the backend is active and CORS is configured.';
  }

  return error.message || 'Simulation execution failed.';
};

export const simulateCircuit = async (circuitDefinition) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quantum/simulate`, circuitDefinition, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    const formattedMsg = formatErrorMessage(error);
    const err = new Error(formattedMsg);
    err.original = error;
    err.status = error.response?.status;
    throw err;
  }
};

export const checkHealth = async () => {
  try {
    const rootUrl = getApiRootUrl();
    const response = await axios.get(`${rootUrl}/health`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

