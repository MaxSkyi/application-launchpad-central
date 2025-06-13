
const { spawn } = require('child_process');
const path = require('path');

// Запускаем Vite dev сервер
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Ждем немного для запуска сервера, затем запускаем Electron
setTimeout(() => {
  const electronProcess = spawn('electron', [path.join(__dirname, '../electron/main.js')], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electronProcess.on('close', () => {
    viteProcess.kill();
    process.exit();
  });
}, 3000);

process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit();
});
