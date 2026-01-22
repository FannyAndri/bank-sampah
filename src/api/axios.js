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

api.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON (e.g., Laravel redirects to login page)
    const contentType = response.headers["content-type"] || "";
    if (contentType.includes("text/html")) {
      console.warn("⚠️ Received HTML instead of JSON. This might be a redirect to login page.");
      // Convert HTML response to error
      const error = new Error("Received HTML response instead of JSON");
      error.response = {
        status: 401,
        statusText: "Unauthorized",
        headers: response.headers,
        data: { message: "Session expired or unauthorized" },
      };
      error.config = response.config;
      return Promise.reject(error);
    }
    
    console.log("✅ API Response:", response.config.method.toUpperCase(), response.config.url);
    console.log("   Status:", response.status);
    
    // Only log data if it's JSON (not too large)
    try {
      const dataStr = JSON.stringify(response.data, null, 2);
      if (dataStr.length < 1000) {
        console.log("   Data:", dataStr);
      } else {
        console.log("   Data: [Large response, truncated]");
      }
    } catch (e) {
      console.log("   Data: [Unable to stringify]");
    }
    
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.method?.toUpperCase(), error.config?.url);
    console.error("   Status:", error.response?.status);
    
    // Check if error response is HTML
    const contentType = error.response?.headers?.["content-type"] || "";
    if (contentType.includes("text/html")) {
      console.warn("⚠️ Error response is HTML (likely redirect to login). Treating as 401.");
      error.response = {
        ...error.response,
        status: 401,
        data: { message: "Session expired or unauthorized" },
      };
    } else if (error.response?.data) {
      try {
        const dataStr = JSON.stringify(error.response.data, null, 2);
        if (dataStr.length < 1000) {
          console.error("   Data:", dataStr);
        } else {
          console.error("   Data: [Large error response, truncated]");
        }
      } catch (e) {
        console.error("   Data: [Unable to stringify]");
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
