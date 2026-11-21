import { useEffect, useLayoutEffect, useState } from "react";
import { DEFAULT_THEME_PRESET_ID } from "../data/heroui-theme-presets";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme";

const THEME_KEY = "theme";
const THEME_PRESET_KEY = "themePreset";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === "light" || theme === "dark" || theme === "system"
    ? theme
    : null;
}

function readStoredThemePreset() {
  const themePreset =
    localStorage.getItem(THEME_PRESET_KEY) ||
    localStorage.getItem("theme-preset");
  return themePreset && isValidThemePreset(themePreset)
    ? themePreset
    : DEFAULT_THEME_PRESET_ID;
}

function applyDomTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(
    () => readStoredTheme() ?? "system",
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [themePreset, setThemePreset] = useState(readStoredThemePreset);
  const theme = themeMode === "system" ? systemTheme : themeMode;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event) =>
      setSystemTheme(event.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeMode);
    localStorage.setItem(THEME_PRESET_KEY, themePreset);
  }, [themeMode, themePreset]);

  const setTheme = (nextTheme) => {
    if (nextTheme === "light" || nextTheme === "dark" || nextTheme === "system") {
      setThemeMode(nextTheme);
    }
  };

  const toggleTheme = () => {
    setThemeMode(theme === "light" ? "dark" : "light");
  };

  const setThemePresetState = (nextPreset) => {
    setThemePreset((currentPreset) => {
      const resolvedPreset =
        typeof nextPreset === "function"
          ? nextPreset(currentPreset)
          : nextPreset;
      return isValidThemePreset(resolvedPreset)
        ? resolvedPreset
        : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    themePreset,
    setThemePreset: setThemePresetState,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}