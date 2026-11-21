
import { X, Check, Palette } from "lucide-react";
import { useTheme } from "../context/theme";
import {
  DEFAULT_THEME_PRESET_ID,
  HERO_UI_THEME_PRESETS,
} from "../data/heroui-theme-presets";

const ThemePresetModal = ({ isOpen, onClose }) => {
  const { theme, themePreset, setThemePreset } = useTheme();

  const isDark = theme === "dark";
  const activePreset = themePreset || DEFAULT_THEME_PRESET_ID;

  if (!isOpen) return null;

  const handlePresetSelect = (presetId) => {
    setThemePreset(presetId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preset-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border shadow-2xl ${
          isDark
            ? "bg-[#151515] border-white/10 text-white"
            : "bg-white border-black/10 text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-current/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? "bg-white/10" : "bg-black/5"
            }`}>
              <Palette size={19} />
            </div>

            <div>
              <h2 id="preset-modal-title" className="font-semibold text-lg">
                Theme Presets
              </h2>
              <p className="text-xs opacity-50 mt-0.5">
                Choose your favorite accent color
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close theme presets"
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            <X size={19} />
          </button>
        </div>

        {/* Presets */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {HERO_UI_THEME_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`relative flex flex-col items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                      : isDark
                        ? "border-white/10 hover:border-white/30"
                        : "border-black/10 hover:border-black/30"
                  }`}
                  aria-pressed={isSelected}
                >
                  {/* Color preview */}
                  <div
                    className="w-full h-16 rounded-lg shadow-inner"
                    style={{ background: preset.swatch }}
                  />

                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">
                      {preset.label}
                    </span>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full theme-accent-control flex items-center justify-center">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-4 border-t border-current/10 text-xs opacity-50`}>
          {HERO_UI_THEME_PRESETS.length} themes available
        </div>
      </div>
    </div>
  );
};

export default ThemePresetModal;
