// In production use same-origin (/api/...). In dev use VITE_API_BASE_URL so backend on 3001 works
const API_BASE = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_BASE_URL || '');

export const getBasePath = () => API_BASE;

// API endpoint for sending emails
export const EMAIL_API_ENDPOINT = `${API_BASE}/api/send-email`;

// Admin login
export const ADMIN_LOGIN_URL = `${API_BASE}/api/admin/login`;

