import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'christmas' | 'valentine' | 'ramadan';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: { value: Theme; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const availableThemes = [
    {
      value: 'default' as Theme,
      label: 'Default',
      description: 'Warm and appetizing orange theme'
    },
    {
      value: 'christmas' as Theme,
      label: 'Christmas',
      description: 'Festive red and green theme'
    },
    {
      value: 'valentine' as Theme,
      label: "Valentine's Day",
      description: 'Romantic pink and red theme'
    },
    {
      value: 'ramadan' as Theme,
      label: 'Ramadan',
      description: 'Peaceful purple and gold theme'
    }
  ];

  useEffect(() => {
    // Remove previous theme classes
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Auto-detect seasonal themes based on date
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Auto-apply seasonal themes if no manual theme is set
    const storedTheme = localStorage.getItem('food-app-theme');
    if (!storedTheme) {
      // Christmas season (December 1 - January 6)
      if (month === 12 || (month === 1 && day <= 6)) {
        setTheme('christmas');
      }
      // Valentine's season (February 1 - 14)
      else if (month === 2 && day <= 14) {
        setTheme('valentine');
      }
      // Note: Ramadan dates vary by year, so we don't auto-detect
    } else {
      setTheme(storedTheme as Theme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('food-app-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};