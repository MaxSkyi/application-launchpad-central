
import { useState, useEffect } from 'react';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  autoLaunch: boolean;
  showFileExtensions: boolean;
  confirmDeletes: boolean;
  maxRecentApps: number;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  defaultView: 'grid',
  autoLaunch: false,
  showFileExtensions: true,
  confirmDeletes: true,
  maxRecentApps: 10,
};

const SETTINGS_KEY = 'application-hub-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'application-hub-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  };
};
