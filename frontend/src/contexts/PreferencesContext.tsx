import React, { createContext, useContext, useEffect } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/user';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('bis_preferences', DEFAULT_PREFERENCES);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply theme
    const isDark = preferences.theme === 'dark' || (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Apply font scale
    document.documentElement.style.setProperty('--font-scale', (preferences.fontScale / 100).toString());
    
    // Apply a11y preferences
    document.documentElement.setAttribute('data-high-contrast', preferences.highContrast.toString());
    
    // Apply language and direction
    i18n.changeLanguage(preferences.interfaceLanguage);
    document.documentElement.setAttribute('dir', preferences.interfaceLanguage === 'ur' ? 'rtl' : 'ltr');
  }, [preferences, i18n]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
