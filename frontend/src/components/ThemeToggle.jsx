
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/theme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      className="theme-accent-outline w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {isDark ? (
        <Sun size={17} strokeWidth={1.8} />
      ) : (
        <Moon size={17} strokeWidth={1.8} />
      )}
    </button>
  );
};

export default ThemeToggle;
