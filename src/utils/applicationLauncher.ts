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

export const launchApplication = (
  app: Application, 
  onOpenTerminal?: (appName: string) => void,
  onAddLog?: (message: string) => void
): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Launching application: ${app.name}`);
    console.log(`Executable path: ${app.executable}`);
    console.log(`Archive structure:`, app.archiveStructure);

    try {
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

      // Handle archive-based applications with terminal
      if (app.archiveStructure && app.fileName) {
        const isExecutable = app.executable.toLowerCase().endsWith('.exe');
        const isBatchFile = app.executable.toLowerCase().endsWith('.bat');
        
        if (isExecutable || isBatchFile) {
          console.log(`Launching application from archive: ${app.fileName}`);
          
          // Open terminal window
          if (onOpenTerminal) {
            onOpenTerminal(app.name);
          }
          
          // Simulate application launch process with logs
          const fileType = isBatchFile ? 'batch script' : 'executable';
          
          setTimeout(() => {
            if (onAddLog) {
              onAddLog(`Extracting archive: ${app.fileName}`);
            }
          }, 100);
          
          setTimeout(() => {
            if (onAddLog) {
              onAddLog(`Archive extracted successfully`);
              onAddLog(`Found ${fileType}: ${app.executable}`);
              onAddLog(`Setting working directory to extracted folder`);
            }
          }, 800);
          
          setTimeout(() => {
            if (onAddLog) {
              onAddLog(`Launching ${fileType}...`);
            }
          }, 1500);
          
          setTimeout(() => {
            if (onAddLog) {
              const processId = Math.floor(Math.random() * 10000) + 1000;
              onAddLog(`Process started with PID: ${processId}`);
              onAddLog(`${app.name} is now running`);
              onAddLog(`Application launched successfully`);
              onAddLog(`Monitoring application status...`);
            }
          }, 2500);
          
          // Show a notification as well
          const notification = new Notification(`Launching ${app.name}`, {
            body: `Starting ${fileType} from extracted archive...`,
            icon: app.icon
          });
          
          setTimeout(() => {
            notification.close();
          }, 3000);
          
          resolve(true);
          return;
        }
      }

      // Handle traditional local files (legacy support)
      const isExecutable = app.executable.toLowerCase().endsWith('.exe');
      const isBatchFile = app.executable.toLowerCase().endsWith('.bat');
      const isLocalPath = app.executable.startsWith('/') || app.executable.includes('\\') || isExecutable || isBatchFile;
      
      if (isLocalPath) {
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

// Request notification permission on module load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
