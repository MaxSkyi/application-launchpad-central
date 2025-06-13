
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
  archiveStructure?: any;
}

// Проверяем, запущены ли мы в Electron
const isElectron = () => {
  return !!(window as any).electronAPI;
};

export const launchApplication = (
  app: Application, 
  onOpenTerminal?: (appName: string) => void,
  onAddLog?: (message: string) => void
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    console.log(`Launching application: ${app.name}`);
    console.log(`Executable path: ${app.executable}`);

    try {
      // Если запущены в Electron, используем реальный запуск
      if (isElectron()) {
        const electronAPI = (window as any).electronAPI;
        
        console.log('Using Electron API for real application launch');
        
        // Открываем терминальное окно
        if (onOpenTerminal) {
          onOpenTerminal(app.name);
        }
        
        // Добавляем начальные логи
        if (onAddLog) {
          onAddLog(`Preparing to launch ${app.name}...`);
          onAddLog(`Executable: ${app.executable}`);
        }
        
        // Запускаем приложение через Electron
        const result = await electronAPI.launchApplication({
          id: app.id,
          name: app.name,
          executable: app.executable
        });
        
        if (result.success) {
          if (onAddLog) {
            onAddLog(`Process started with PID: ${result.pid}`);
            onAddLog(`Process ID: ${result.processId}`);
            onAddLog(result.message);
          }
          
          // Подписываемся на логи процесса
          electronAPI.onApplicationLog((logData: any) => {
            if (onAddLog) {
              const prefix = logData.type === 'stderr' ? '[ERROR]' : 
                           logData.type === 'system' ? '[SYSTEM]' : '[OUTPUT]';
              onAddLog(`${prefix} ${logData.message.trim()}`);
            }
          });
          
          resolve(true);
        } else {
          if (onAddLog) {
            onAddLog(`Failed to launch: ${result.error}`);
          }
          resolve(false);
        }
        
        return;
      }

      // Fallback для веб-версии (симуляция)
      console.log('Running in browser mode - simulating launch');
      
      // Handle web applications (URLs)
      if (app.executable.startsWith('http://') || app.executable.startsWith('https://')) {
        console.log(`Opening web application: ${app.executable}`);
        window.open(app.executable, '_blank', 'noopener,noreferrer');
        resolve(true);
        return;
      }

      // Handle protocol handlers (e.g., vscode://file/path)
      if (app.executable.includes('://') && !app.executable.startsWith('http')) {
        console.log(`Opening protocol handler: ${app.executable}`);
        window.location.href = app.executable;
        resolve(true);
        return;
      }

      // Симуляция для локальных файлов в браузере
      const isExecutable = app.executable.toLowerCase().endsWith('.exe');
      const isBatchFile = app.executable.toLowerCase().endsWith('.bat');
      const isPythonFile = app.executable.toLowerCase().endsWith('.py');
      
      if (isExecutable || isBatchFile || isPythonFile || app.executable.includes('\\') || app.executable.includes('/')) {
        console.log(`Simulating launch of local application: ${app.executable}`);
        
        // Open terminal window for simulation
        if (onOpenTerminal) {
          onOpenTerminal(app.name);
        }
        
        // Simulate application launch process with logs
        const fileType = isBatchFile ? 'batch script' : 
                        isPythonFile ? 'Python script' :
                        isExecutable ? 'executable' : 'local file';
        
        setTimeout(() => {
          if (onAddLog) {
            onAddLog(`[SIMULATION] This is a browser simulation`);
            onAddLog(`[SIMULATION] To launch real applications, use the Electron version`);
            onAddLog(`Found ${fileType}: ${app.executable}`);
          }
        }, 100);
        
        setTimeout(() => {
          if (onAddLog) {
            onAddLog(`[SIMULATION] Would launch ${fileType}...`);
          }
        }, 800);
        
        setTimeout(() => {
          if (onAddLog) {
            const processId = Math.floor(Math.random() * 10000) + 1000;
            onAddLog(`[SIMULATION] Process would start with PID: ${processId}`);
            onAddLog(`[SIMULATION] ${app.name} simulation complete`);
          }
        }, 1500);
        
        resolve(true);
        return;
      }

      // Fallback for unknown executable types
      console.warn(`Unknown executable type for ${app.name}: ${app.executable}`);
      resolve(false);
    } catch (error) {
      console.error(`Failed to launch ${app.name}:`, error);
      if (onAddLog) {
        onAddLog(`Error: Failed to launch application - ${error}`);
      }
      resolve(false);
    }
  });
};

// Функция для остановки приложения (только в Electron)
export const stopApplication = async (processId: string): Promise<boolean> => {
  if (!isElectron()) {
    console.log('Stop function only available in Electron mode');
    return false;
  }

  try {
    const electronAPI = (window as any).electronAPI;
    const result = await electronAPI.stopApplication(processId);
    return result.success;
  } catch (error) {
    console.error('Failed to stop application:', error);
    return false;
  }
};

// Функция для выбора файла (только в Electron)
export const selectExecutableFile = async (): Promise<string | null> => {
  if (!isElectron()) {
    console.log('File selection only available in Electron mode');
    return null;
  }

  try {
    const electronAPI = (window as any).electronAPI;
    const result = await electronAPI.selectFile();
    return result.success ? result.filePath : null;
  } catch (error) {
    console.error('Failed to select file:', error);
    return null;
  }
};
