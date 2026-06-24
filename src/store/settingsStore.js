import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SETTINGS_KEY = "user_settings";

const defaultSettings = {
    theme: "light", // 'light' or 'dark'
    language: "id", // 'id' or 'en'
    fontSize: "medium", // 'small', 'medium', 'large'
};

// Save all settings
export const saveSettings = async (settings) => {
    const settingsJson = JSON.stringify(settings);
    if (Platform.OS === "web") {
        localStorage.setItem(SETTINGS_KEY, settingsJson);
    } else {
        await SecureStore.setItemAsync(SETTINGS_KEY, settingsJson);
    }
};

// Get all settings
export const getSettings = async () => {
    try {
        let settingsJson;
        if (Platform.OS === "web") {
            settingsJson = localStorage.getItem(SETTINGS_KEY);
        } else {
            settingsJson = await SecureStore.getItemAsync(SETTINGS_KEY);
        }

        if (settingsJson) {
            return JSON.parse(settingsJson);
        }
        return defaultSettings;
    } catch (error) {
        console.error("Error loading settings:", error);
        return defaultSettings;
    }
};

// Update specific setting
export const updateSetting = async (key, value) => {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, [key]: value };
    await saveSettings(newSettings);
    return newSettings;
};

// Reset to default settings
export const resetSettings = async () => {
    await saveSettings(defaultSettings);
    return defaultSettings;
};
