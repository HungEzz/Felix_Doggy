import axios, { type AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { store } from '../store';
import { logout, adminLogout } from '../store/userSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Supports Docker API Gateway or Local
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- RETRY CONFIG ---
// HTTP status codes considered temporary errors — safe to retry
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];
const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 500;

/**
 * Determine which token to use based on current URL path.
 * Admin pages (/admin/*) use admin_token, everything else uses token.
 */
function getActiveToken(): string | null {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  return localStorage.getItem(isAdminPage ? 'admin_token' : 'token');
}

// Attach token to headers
api.interceptors.request.use(
  (config) => {
    const token = getActiveToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response handling: auto-retry + user-friendly error toast display
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };

    // Expired or invalid token (HTTP 401) — automatically log out corresponding session
    if (error.response?.status === 401) {
      const isAdminPage = window.location.pathname.startsWith('/admin');

      if (isAdminPage) {
        const isAdminLoggedIn = store.getState().user.isAdminLoggedIn;
        if (isAdminLoggedIn) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          store.dispatch(adminLogout());
          toast.error('Admin session expired. Please log in again.', {
            id: 'admin-session-expired-toast',
            duration: 4000,
          });
        }
      } else {
        const isLoggedIn = store.getState().user.isLoggedIn;
        if (isLoggedIn) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          store.dispatch(logout());
          toast.error('Session expired. Please log in again.', {
            id: 'session-expired-toast',
            duration: 4000,
          });
        }
      }
      return Promise.reject(error);
    }

    // Rate Limiting handling from Server (HTTP 429) — do not retry, just prompt user to wait
    if (error.response?.status === 429) {
      toast.error(error.response.data.message || 'You are acting too fast. Please wait a moment!', {
        id: 'rate-limit-toast',
        duration: 4000,
      });
      return Promise.reject(error);
    }

    // Retry on temporary server errors (5xx) or network errors
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
    const isRetryableStatus = error.response && RETRYABLE_STATUS_CODES.includes(error.response.status);

    if ((isNetworkError || isRetryableStatus) && config) {
      config._retryCount = config._retryCount ?? 0;

      if (config._retryCount < MAX_RETRY_ATTEMPTS) {
        config._retryCount += 1;
        const delayMs = Math.min(BASE_RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1), 8000);

        console.warn(
          `🔄 [Retry] Request failed (${error.response?.status ?? 'network error'}). ` +
          `Attempt ${config._retryCount}/${MAX_RETRY_ATTEMPTS} — retrying in ${delayMs}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return api(config);
      }

      // Retry attempts exhausted → display connection failure message
      toast.error('Failed to connect to server. Please check your network and try again.', {
        id: 'server-error-toast',
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default api;