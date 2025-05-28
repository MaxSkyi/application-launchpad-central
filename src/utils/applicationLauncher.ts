
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

      // Handle local file paths (desktop applications)
      if (app.executable.startsWith('/') || app.executable.includes('\\')) {
        console.log(`Attempting to launch desktop application: ${app.executable}`);
        
        // In a real desktop environment, this would use electron or tauri APIs
        // For web demo, we'll simulate the launch
        console.log(`Desktop application launch simulated for: ${app.name}`);
        
        // Show a simulated launch notification
        const notification = new Notification(`Launching ${app.name}`, {
          body: `Starting ${app.name}...`,
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
