import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, updateSetting } from "../store/settingsStore";
import { getColors } from "../theme/colors";
import { getTypography } from "../theme/typography";

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: "light",
        language: "id",
        fontSize: "medium",
    });
    const [loading, setLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await getSettings();
            setSettings(savedSettings);
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update theme
    const setTheme = async (theme) => {
        const newSettings = await updateSetting("theme", theme);
        setSettings(newSettings);
    };

    // Update language
    const setLanguage = async (language) => {
        const newSettings = await updateSetting("language", language);
        setSettings(newSettings);
    };

    // Update font size
    const setFontSize = async (fontSize) => {
        const newSettings = await updateSetting("fontSize", fontSize);
        setSettings(newSettings);
    };

    // Get current colors based on theme
    const colors = getColors(settings.theme === "dark");

    // Get current typography based on font size
    const typography = getTypography(settings.fontSize);

    const value = {
        // Settings
        theme: settings.theme,
        language: settings.language,
        fontSize: settings.fontSize,

        // Derived values
        isDark: settings.theme === "dark",
        colors,
        typography,
        loading,

        // Update functions
        setTheme,
        setLanguage,
        setFontSize,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
