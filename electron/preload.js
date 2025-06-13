
const { contextBridge, ipcRenderer } = require('electron');

// Предоставляем безопасный API для renderer процесса
contextBridge.exposeInMainWorld('electronAPI', {
  // Запуск приложения
  launchApplication: (appData) => ipcRenderer.invoke('launch-application', appData),
  
  // Остановка приложения
  stopApplication: (processId) => ipcRenderer.invoke('stop-application', processId),
  
  // Выбор файла
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // Получение запущенных процессов
  getRunningProcesses: () => ipcRenderer.invoke('get-running-processes'),
  
  // Подписка на логи приложений
  onApplicationLog: (callback) => {
    ipcRenderer.on('application-log', (event, data) => callback(data));
  },
  
  // Отписка от логов
  removeApplicationLogListener: () => {
    ipcRenderer.removeAllListeners('application-log');
  }
});
