
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

export const launchApplication = (app: Application): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Launching application: ${app.name}`);
    console.log(`Executable path: ${app.executable}`);

    try {
      // Handle web applications (URLs)
      if (app.executable.startsWith('http://') || app.executable.startsWith('https://')) {
        console.log(`Opening web application: ${app.executable}`);
        window.open(app.executable, '_blank', 'noopener,noreferrer');
        resolve(true);
        return;
      }

      // Handle local file paths (desktop applications and batch files)
      if (app.executable.startsWith('/') || app.executable.includes('\\')) {
        const isExecutable = app.executable.toLowerCase().endsWith('.exe');
        const isBatchFile = app.executable.toLowerCase().endsWith('.bat');
        
        if (isExecutable) {
          console.log(`Attempting to launch desktop application: ${app.executable}`);
        } else if (isBatchFile) {
          console.log(`Attempting to launch batch file: ${app.executable}`);
        } else {
          console.log(`Attempting to launch local file: ${app.executable}`);
        }
        
        // In a real desktop environment, this would use electron or tauri APIs
        // For web demo, we'll simulate the launch
        const fileType = isBatchFile ? 'batch script' : isExecutable ? 'desktop application' : 'local file';
        console.log(`${fileType} launch simulated for: ${app.name}`);
        
        // Show a simulated launch notification
        const notification = new Notification(`Launching ${app.name}`, {
          body: `Starting ${fileType}...`,
          icon: app.icon
        });
        
        setTimeout(() => {
          notification.close();
        }, 3000);
        
        resolve(true);
        return;
      }

      // Handle protocol handlers (e.g., vscode://file/path)
      if (app.executable.includes('://')) {
        console.log(`Opening protocol handler: ${app.executable}`);
        window.location.href = app.executable;
        resolve(true);
        return;
      }

      // Fallback for unknown executable types
      console.warn(`Unknown executable type for ${app.name}: ${app.executable}`);
      resolve(false);
    } catch (error) {
      console.error(`Failed to launch ${app.name}:`, error);
      resolve(false);
    }
  });
};

// Request notification permission on module load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
