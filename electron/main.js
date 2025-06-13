
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

// Сохраняем ссылки на запущенные процессы
const runningProcesses = new Map();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    title: 'Application Hub',
  });

  // В разработке загружаем dev сервер, в продакшене - собранное приложение
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return mainWindow;
}

// Обработчик запуска приложений
ipcMain.handle('launch-application', async (event, appData) => {
  const { executable, name, id } = appData;
  
  console.log(`Launching application: ${name}`);
  console.log(`Executable path: ${executable}`);

  try {
    // Проверяем существует ли файл
    if (!fs.existsSync(executable)) {
      throw new Error(`File not found: ${executable}`);
    }

    let process;
    const processId = Date.now().toString();

    // Определяем тип файла и запускаем соответствующим образом
    if (executable.toLowerCase().endsWith('.exe')) {
      // Запуск exe файла
      process = spawn(executable, [], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } else if (executable.toLowerCase().endsWith('.bat')) {
      // Запуск bat файла
      process = spawn('cmd.exe', ['/c', executable], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } else if (executable.toLowerCase().endsWith('.py')) {
      // Запуск Python скрипта
      process = spawn('python', [executable], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } else {
      // Попробуем запустить как есть
      process = spawn(executable, [], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    }

    // Сохраняем процесс
    runningProcesses.set(processId, {
      process,
      name,
      startTime: new Date()
    });

    // Отправляем логи в renderer
    if (process.stdout) {
      process.stdout.on('data', (data) => {
        event.sender.send('application-log', {
          processId,
          message: data.toString(),
          type: 'stdout'
        });
      });
    }

    if (process.stderr) {
      process.stderr.on('data', (data) => {
        event.sender.send('application-log', {
          processId,
          message: data.toString(),
          type: 'stderr'
        });
      });
    }

    process.on('close', (code) => {
      event.sender.send('application-log', {
        processId,
        message: `Process exited with code ${code}`,
        type: 'system'
      });
      runningProcesses.delete(processId);
    });

    process.on('error', (error) => {
      event.sender.send('application-log', {
        processId,
        message: `Error: ${error.message}`,
        type: 'error'
      });
      runningProcesses.delete(processId);
    });

    return {
      success: true,
      processId,
      pid: process.pid,
      message: `Application ${name} started successfully`
    };

  } catch (error) {
    console.error('Launch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Обработчик остановки приложений
ipcMain.handle('stop-application', async (event, processId) => {
  const processInfo = runningProcesses.get(processId);
  
  if (!processInfo) {
    return { success: false, error: 'Process not found' };
  }

  try {
    processInfo.process.kill('SIGTERM');
    runningProcesses.delete(processId);
    
    return {
      success: true,
      message: `Application ${processInfo.name} stopped successfully`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Обработчик выбора файла
ipcMain.handle('select-file', async () => {
  const { dialog } = require('electron');
  
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Executable Files', extensions: ['exe', 'bat', 'cmd', 'py', 'sh'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return {
      success: true,
      filePath: result.filePaths[0]
    };
  }

  return {
    success: false,
    error: 'No file selected'
  };
});

// Обработчик получения информации о процессах
ipcMain.handle('get-running-processes', async () => {
  const processes = Array.from(runningProcesses.entries()).map(([id, info]) => ({
    processId: id,
    name: info.name,
    pid: info.process.pid,
    startTime: info.startTime
  }));
  
  return processes;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Останавливаем все запущенные процессы при закрытии
  runningProcesses.forEach((processInfo, processId) => {
    try {
      processInfo.process.kill('SIGTERM');
    } catch (error) {
      console.error(`Error stopping process ${processId}:`, error);
    }
  });
  
  if (process.platform !== 'darwin') app.quit();
});
