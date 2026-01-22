/**
 * Simple Internationalization (i18n) System
 * Supports Indonesian (id) and English (en)
 */

export const translations = {
    id: {
        // Settings Screen
        settings: "Pengaturan",
        display: "Tampilan",
        theme: "Tema",
        light: "Terang",
        dark: "Gelap",
        fontSize: "Ukuran Font",
        small: "Kecil",
        medium: "Sedang",
        large: "Besar",
        language: "Bahasa",
        indonesian: "Indonesia",
        english: "English",

        // Common
        save: "Simpan",
        cancel: "Batal",
        done: "Selesai",
        ok: "OK",

        // Profile
        profile: "Profil",
        editProfile: "Edit Profil",
        logout: "Keluar",
    },

    en: {
        // Settings Screen
        settings: "Settings",
        display: "Display",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        fontSize: "Font Size",
        small: "Small",
        medium: "Medium",
        large: "Large",
        language: "Language",
        indonesian: "Indonesian",
        english: "English",

        // Common
        save: "Save",
        cancel: "Cancel",
        done: "Done",
        ok: "OK",

        // Profile
        profile: "Profile",
        editProfile: "Edit Profile",
        logout: "Logout",
    },
};

// Get translated string
export const t = (key, lang = "id") => {
    return translations[lang]?.[key] || translations.id[key] || key;
};

export default { translations, t };
