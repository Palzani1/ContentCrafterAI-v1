import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook to manage the application's theme.
 * It persists the theme in localStorage and applies it to the document.
 * @returns A tuple containing the current theme and a function to toggle it.
 */
export const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        // Default to dark mode as per requirements
        return storedTheme || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Clean up old classes and add the current theme class
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Persist the theme choice in localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return [theme, toggleTheme];
};
