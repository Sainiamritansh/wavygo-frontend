// ============================================================
// WavyGo — Environment Configuration
// ============================================================
// Backend dev sets VITE_API_BASE_URL in .env and flips
// VITE_USE_MOCK_DATA=false to switch from mock to real API.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false' // true by default
