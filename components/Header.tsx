import React from 'react';
import { SunIcon, MoonIcon, LogoIcon } from './IconComponents';

interface HeaderProps {
  generationsLeft: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ generationsLeft, theme, toggleTheme }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <LogoIcon />
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
          ContentCrafter AI
        </h1>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <div className="px-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-full text-sm font-medium text-slate-600 dark:text-dark-text-secondary transition-colors duration-300">
          Generations Left: <span className="font-bold text-slate-900 dark:text-white">{generationsLeft}</span>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-border transition-colors duration-300"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};