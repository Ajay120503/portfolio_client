import { useState, useEffect } from 'react';

const THEME_EVENT = 'portfolio-theme-change';

export const useTheme = (defaultTheme = 'dark') => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || defaultTheme;
  });

  useEffect(() => {
    const syncTheme = () => {
      setTheme(localStorage.getItem('portfolio_theme') || defaultTheme);
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('portfolio_theme', next);
      window.dispatchEvent(new Event(THEME_EVENT));
      return next;
    });
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
};
