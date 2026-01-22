import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { API_BASE_URL, API_TIMEOUT, USE_MOCK_API } from "../config";

// --- MOCK API IMPLEMENTATION (Simple Version) ---
// Jika USE_MOCK_API = true, kita bisa me-redirect call ke fungsi lokal atau
// menggunakan library seperti axios-mock-adapter.
// Untuk saat ini, kita akan biarkan axios tetap berjalan tapi log warning jika Mock aktif tapi belum diimplementasikan full.

const baseURL = USE_MOCK_API ? "http://localhost:3333/api" : API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (USE_MOCK_API) {
    console.log("⚠️ Menggunakan MOCK API (Not fully implemented yet)");
  }

  let token;
  if (Platform.OS === "web") {
    token = localStorage.getItem("token");
    console.log("[DEBUG] Token from localStorage:", token ? "FOUND" : "MISSING", token);
  } else {
    token = await SecureStore.getItemAsync("token");
    console.log("[DEBUG] Token from SecureStore:", token ? "FOUND" : "MISSING");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("[DEBUG] No token found in storage! Request will be unauthenticated.");
  }

  // Force Accept header to ensure JSON response for Laravel
  config.headers.Accept = "application/json";

  console.log("➡️ API Request:", config.method.toUpperCase(), config.url);
  console.log("   Headers:", JSON.stringify(config.headers));

  return config;
});

export default api;
