import { useState, useEffect } from 'react';

const THEME_EVENT = 'portfolio-theme-change';

const blackFirstColor = '#C6FF34';
const lightFirstColor = '#21AECC';

export const useTheme = (defaultTheme = 'black') => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('portfolio_theme') || defaultTheme;
  });

  useEffect(() => {
    const syncTheme = () => {
      setThemeState(localStorage.getItem('portfolio_theme') || defaultTheme);
    };

    window.addEventListener('storage', syncTheme);
    window.addEventListener(THEME_EVENT, syncTheme);

    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener(THEME_EVENT, syncTheme);
    };
  }, [defaultTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'black') {
      document.documentElement.classList.add('black');
    } else {
      document.documentElement.classList.remove('black');
    }
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  const setTheme = (newTheme, updateColor = false) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    window.dispatchEvent(new Event(THEME_EVENT));

    // Only update color when called from toggle button (not from ManageSettings)
    if (updateColor) {
      const firstColor = newTheme === 'black' ? blackFirstColor : lightFirstColor;
      document.documentElement.style.setProperty('--color-primary', firstColor);
      localStorage.setItem('portfolio_theme_color', firstColor);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'black' ? 'light' : 'black';
    setTheme(next, true); // true = also update color
  };

  return { theme, toggleTheme, setTheme, isDark: theme === 'black' };
};