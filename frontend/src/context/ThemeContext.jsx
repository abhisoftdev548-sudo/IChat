import {useEffect, useLayoutEffect, useState} from "react";
import {DEFAULT_THEME_PRESET_ID} from "../data/heroui-theme-presets";
import {applyThemePresetToDocument, isValidThemePreset, ThemeContext} from "./theme";

function getSystemTheme(){
    if(typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(){
    const theme = localStorage.getItem("theme");
    if(theme === "light" || theme === "dark") return theme;
    return null;
}

function applyDomTheme(theme){
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

function readStoredThemePreset(){
    const themePreset = localStorage.getItem("themePreset");
    if(themePreset && isValidThemePreset(themePreset)) return themePreset;
    return DEFAULT_THEME_PRESET_ID;
}

export function ThemeProvider({children}){
    const [theme , setTheme] = useState(() => readStoredTheme() ?? getSystemTheme());
    const [themePreset, setThemePreset] = useState(readStoredThemePreset);

    useLayoutEffect(()=>{
        applyDomTheme(theme);
    }, [theme]);

    useLayoutEffect(()=>{
        applyThemePresetToDocument(themePreset);
    }, [themePreset]);

    useEffect(()=>{
        localStorage.setItem("theme", theme);
        localStorage.setItem("theme-preset", themePreset);
    }, [theme, themePreset]);

    const setThemeState = (next) => setTheme(next);

    const toggleTheme = () => {
        setThemeState(theme === "light" ? "dark" : "light");
    };
    const setThemePresetState = (next) => {
        setThemePreset((prev) => {
            const resolved = typeof next === "function" ? next(prev) : next;
            return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
        })
    }

     const value = { theme, setTheme, toggleTheme, themePreset, setThemePreset };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;

}