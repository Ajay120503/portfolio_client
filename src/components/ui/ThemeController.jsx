import { useEffect } from "react";
import { useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const fontStacks = {
  inter: "Inter, ui-sans-serif, system-ui, sans-serif",
  system:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  poppins: "Poppins, Inter, ui-sans-serif, sans-serif",
  manrope: "Manrope, Inter, ui-sans-serif, sans-serif",
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  outfit: '"Outfit", Inter, ui-sans-serif, sans-serif',
  "dm-sans": '"DM Sans", Inter, ui-sans-serif, sans-serif',
  "plus-jakarta": '"Plus Jakarta Sans", Inter, ui-sans-serif, sans-serif',
  "space-grotesk": '"Space Grotesk", Inter, ui-sans-serif, sans-serif',
  sora: '"Sora", Inter, ui-sans-serif, sans-serif',
  nunito: '"Nunito", Inter, ui-sans-serif, sans-serif',
  raleway: '"Raleway", Inter, ui-sans-serif, sans-serif',
  josefin: '"Josefin Sans", Inter, ui-sans-serif, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
};

const PREVIEW_EVENT = "portfolio-preview-change";

const ThemeController = () => {
  const { data: settings } = useSettings();
  const { setTheme } = useTheme(settings?.defaultTheme || "black");

  // Apply saved settings from DB on load
  useEffect(() => {
    const root = document.documentElement;

    if (settings?.themeColor) {
      root.style.setProperty("--color-primary", settings.themeColor);
    }

    if (settings?.fontFamily) {
      root.style.setProperty(
        "--portfolio-font-family",
        fontStacks[settings.fontFamily] || fontStacks.inter
      );
    }
  }, [settings?.fontFamily, settings?.themeColor]);

  useEffect(() => {
    const handlePreview = (e) => {
      const { color, theme } = e.detail || {};
      if (theme) setTheme(theme);
      if (color) {
        document.documentElement.style.setProperty("--color-primary", color);
      }
    };

    window.addEventListener("portfolio-preview-change", handlePreview);
    return () =>
      window.removeEventListener("portfolio-preview-change", handlePreview);
  }, [setTheme]);

  return null;
};

export default ThemeController;
