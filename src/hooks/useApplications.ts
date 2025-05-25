
import { useState, useEffect } from 'react';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: string;
  dateAdded: string;
  category: string;
  tags: string[];
  executable: string;
  fileName?: string;
}

const STORAGE_KEY = 'application-hub-apps';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  // Load applications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedApps = JSON.parse(stored);
        setApplications(parsedApps);
      } catch (error) {
        console.error('Failed to parse stored applications:', error);
      }
    }
  }, []);

  // Save to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const addApplication = (newApp: Omit<Application, 'id'>) => {
    const appWithId = {
      ...newApp,
      id: Date.now().toString(),
    };
    setApplications(prev => [...prev, appWithId]);
    return appWithId;
  };

  const removeApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updates } : app)
    );
  };

  return {
    applications,
    addApplication,
    removeApplication,
    updateApplication,
  };
};
