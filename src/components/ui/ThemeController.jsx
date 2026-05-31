// import { useEffect } from "react";

// import { useSettings } from "../../hooks/usePortfolioData";
// import { useTheme } from "../../hooks/useTheme";

// const fontStacks = {
//   inter: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
//   system: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
//   poppins: 'Poppins, Inter, ui-sans-serif, system-ui, sans-serif',
//   manrope: 'Manrope, Inter, ui-sans-serif, system-ui, sans-serif',
//   serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
// };

// const ThemeController = () => {
//   const { data: settings } = useSettings();
//   useTheme(settings?.defaultTheme || "black");

//   useEffect(() => {
//     const root = document.documentElement;

//     if (settings?.themeColor) {
//       root.style.setProperty("--color-primary", settings.themeColor);
//     }

//     if (settings?.fontFamily) {
//       root.style.setProperty(
//         "--portfolio-font-family",
//         fontStacks[settings.fontFamily] || fontStacks.inter
//       );
//     }
//   }, [settings?.fontFamily, settings?.themeColor]);

//   return null;
// };

// export default ThemeController;

import { useEffect } from "react";
import { useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const fontStacks = {
  inter:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  system:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  poppins: "Poppins, Inter, ui-sans-serif, system-ui, sans-serif",
  manrope: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif",
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
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
