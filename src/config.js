/**
 * ===============================
 * GLOBAL APPLICATION CONFIG
 * Bank Sampah Digital Mobile App
 * ===============================
 */

/**
 * MODE APLIKASI
 * true  = pakai MOCK / DATABASE PALSU
 * false = pakai BACKEND API ASLI
 */
export const USE_MOCK_API = false;

/**
 * BASE URL BACKEND
 * Digunakan hanya jika USE_MOCK_API = false
 */
export const API_BASE_URL = "http://192.168.1.10:8000/api";

/**
 * TIMEOUT REQUEST (ms)
 */
export const API_TIMEOUT = 10000;

/**
 * DEFAULT PAGINATION
 */
export const DEFAULT_PER_PAGE = 15;

/**
 * APP INFO
 */
export const APP_NAME = "Bank Sampah Digital";
export const APP_VERSION = "1.0.0";

/**
 * UI CONFIG
 */
export const ENABLE_DARK_MODE = false;
export const PRIMARY_COLOR = "#2ECC71";
export const SECONDARY_COLOR = "#27AE60";

/**
 * DEBUG LOG
 * Aktifkan saat development
 */
export const ENABLE_DEBUG_LOG = true;
