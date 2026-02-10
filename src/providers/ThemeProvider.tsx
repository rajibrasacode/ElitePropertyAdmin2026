"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ColorTheme {
    name: string;
    primary: string;        // Button/Active Links
    secondary: string;      // Accents
    sidebarBg: string;      // Sidebar Background
    sidebarText: string;    // Sidebar Text Color
    background: string;     // Main Page Background
    cardBg: string;         // Card Background
    headingColor: string;   // Headings
    textColor: string;      // Body Text
    borderColor: string;    // Borders
}

const PRESET_THEMES: ColorTheme[] = [
    {
        name: "Corporate Blue",
        primary: "#2563EB", // Blue-600
        secondary: "#1E40AF", // Blue-800
        sidebarBg: "#0F172A", // Slate-900
        sidebarText: "#F8FAFC", // Slate-50
        background: "#F1F5F9", // Slate-100
        cardBg: "#FFFFFF",
        headingColor: "#0F172A", // 🔹 MATCHED TO SIDEBAR (Was Slate-800)
        textColor: "#64748B", // Slate-500
        borderColor: "#E2E8F0" // Slate-200
    },
    {
        name: "Emerald Garden",
        primary: "#059669", // Emerald-600
        secondary: "#065F46",
        sidebarBg: "#064E3B", // Emerald-900
        sidebarText: "#ECFDF5",
        background: "#F0FDF4", // Emerald-50
        cardBg: "#FFFFFF",
        headingColor: "#064E3B", // 🔹 MATCHED TO SIDEBAR
        textColor: "#047857",
        borderColor: "#A7F3D0"
    },
    {
        name: "Royal Purple",
        primary: "#7C3AED", // Violet-600
        secondary: "#5B21B6",
        sidebarBg: "#2E1065", // Violet-950
        sidebarText: "#F5F3FF",
        background: "#F5F3FF", // Violet-50
        cardBg: "#FFFFFF",
        headingColor: "#2E1065", // 🔹 MATCHED TO SIDEBAR
        textColor: "#6D28D9",
        borderColor: "#DDD6FE"
    },
    {
        name: "Midnight Pro",
        primary: "#6366F1", // Indigo-500
        secondary: "#4338CA",
        sidebarBg: "#020617", // Slate-950
        sidebarText: "#E2E8F0",
        background: "#0F172A", // Slate-900 
        cardBg: "#1E293B", // Slate-800 (Darker for better contrast with Slate-400 text)
        headingColor: "#F8FAFC", // KEEP LIGHT (Contrast Exception)
        textColor: "#94A3B8", // Slate-400
        borderColor: "#475569" // Slate-600
    },
    {
        name: "Sunset Orange",
        primary: "#EA580C", // Orange-600
        secondary: "#C2410C",
        sidebarBg: "#7C2D12", // Orange-900
        sidebarText: "#FFEDD5",
        background: "#FFF7ED", // Orange-50
        cardBg: "#FFFFFF",
        headingColor: "#7C2D12", // 🔹 MATCHED TO SIDEBAR
        textColor: "#C2410C",
        borderColor: "#FED7AA"
    }
];

interface ThemeContextType {
    currentTheme: ColorTheme;
    savedTheme: ColorTheme;
    setPreviewTheme: (theme: ColorTheme) => void;
    saveTheme: () => void;
    cancelPreview: () => void;
    setCustomColor: (key: keyof ColorTheme, value: string) => void;
    presets: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: PRESET_THEMES[0],
    savedTheme: PRESET_THEMES[0],
    setPreviewTheme: () => { },
    saveTheme: () => { },
    cancelPreview: () => { },
    setCustomColor: () => { },
    presets: PRESET_THEMES
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [savedTheme, setSavedTheme] = useState<ColorTheme>(PRESET_THEMES[0]);
    const [previewTheme, setPreviewTheme] = useState<ColorTheme>(PRESET_THEMES[0]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("app_theme");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.primary && parsed.background) {
                    setSavedTheme(parsed);
                    setPreviewTheme(parsed);
                }
            } catch (e) {
                console.error("Theme parse error", e);
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const t = previewTheme;

        root.style.setProperty("--color-primary", t.primary);
        root.style.setProperty("--color-secondary", t.secondary);
        root.style.setProperty("--color-sidebar-bg", t.sidebarBg);
        root.style.setProperty("--color-sidebar-text", t.sidebarText);
        root.style.setProperty("--color-background", t.background);
        root.style.setProperty("--color-card-bg", t.cardBg);
        root.style.setProperty("--color-heading", t.headingColor);
        root.style.setProperty("--color-text", t.textColor);
        root.style.setProperty("--color-border", t.borderColor);
    }, [previewTheme, mounted]);

    const saveTheme = () => {
        setSavedTheme(previewTheme);
        localStorage.setItem("app_theme", JSON.stringify(previewTheme));
    };

    const cancelPreview = () => {
        setPreviewTheme(savedTheme);
    };

    const setCustomColor = (key: keyof ColorTheme, value: string) => {
        setPreviewTheme(prev => {
            const newTheme = { ...prev, [key]: value, name: "Custom" };

            // 🔹 AUTO-LINK LOGIC: If Sidebar BG changes, update Heading Color to match
            // This ensures "Heading = Sidebar Background Color" logic requested by user
            if (key === 'sidebarBg') {
                newTheme.headingColor = value;
            }

            return newTheme;
        });
    };

    if (!mounted) {
        return <div style={{ opacity: 0 }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{
            currentTheme: previewTheme,
            savedTheme,
            setPreviewTheme,
            saveTheme,
            cancelPreview,
            setCustomColor,
            presets: PRESET_THEMES
        }}>
            <div style={{ opacity: 1, transition: 'opacity 0.2s ease-in' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
