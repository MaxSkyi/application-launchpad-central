
import { useState, useEffect } from 'react';

interface Settings {
  defaultView: 'grid' | 'list';
  confirmDeletes: boolean;
  customCategories: string[];
  storageDirectory: string;
  tempDirectory: string;
  autoCleanTemp: boolean;
  enableNotifications: boolean;
  maxFileSize: number;
  allowedExtensions: string[];
}

const defaultSettings: Settings = {
  defaultView: 'grid',
  confirmDeletes: true,
  customCategories: [],
  storageDirectory: "/Users/Documents/ApplicationHub/storage",
  tempDirectory: "/Users/Documents/ApplicationHub/temp",
  autoCleanTemp: true,
  enableNotifications: true,
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedExtensions: ['.zip', '.rar', '.tar', '.7z', '.gz'],
};

const SETTINGS_KEY = 'application-hub-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateCustomCategories = (categories: string[]) => {
    updateSettings({ customCategories: categories });
  };

  return {
    settings,
    updateSettings,
    updateCustomCategories,
  };
};
