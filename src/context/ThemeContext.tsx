import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAutoMode: boolean;
  setAutoMode: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const checkAutoTheme = () => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6; // Dark mode from 7 PM to 6 AM
  };

  const toggleTheme = () => {
    if (isAutoMode) {
      setIsAutoMode(false);
      setIsDarkMode(!checkAutoTheme());
    } else {
      setIsDarkMode(!isDarkMode);
    }
  };

  const setAutoMode = (auto: boolean) => {
    setIsAutoMode(auto);
    if (auto) {
      setIsDarkMode(checkAutoTheme());
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAutoMode = localStorage.getItem('autoMode');
    
    if (savedAutoMode !== null) {
      const autoMode = savedAutoMode === 'true';
      setIsAutoMode(autoMode);
      
      if (autoMode) {
        setIsDarkMode(checkAutoTheme());
      } else if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } else {
      setIsDarkMode(checkAutoTheme());
    }

    // Update theme every minute to check for auto-mode changes
    const interval = setInterval(() => {
      if (isAutoMode) {
        setIsDarkMode(checkAutoTheme());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAutoMode]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('autoMode', isAutoMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isAutoMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isAutoMode, setAutoMode }}>
      {children}
    </ThemeContext.Provider>
  );
};