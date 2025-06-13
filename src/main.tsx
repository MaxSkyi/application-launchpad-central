
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Добавляем типы для Electron API
declare global {
  interface Window {
    electronAPI?: {
      launchApplication: (appData: any) => Promise<any>;
      stopApplication: (processId: string) => Promise<any>;
      selectFile: () => Promise<any>;
      getRunningProcesses: () => Promise<any>;
      onApplicationLog: (callback: (data: any) => void) => void;
      removeApplicationLogListener: () => void;
    };
  }
}

createRoot(document.getElementById("root")!).render(<App />);
