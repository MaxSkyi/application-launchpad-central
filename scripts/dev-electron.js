
const { spawn } = require('child_process');
const path = require('path');

// Запускаем Vite dev сервер
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('Starting Vite dev server...');

// Ждем немного для запуска сервера, затем запускаем Electron
setTimeout(() => {
  console.log('Starting Electron...');
  const electronProcess = spawn('npx', ['electron', path.join(__dirname, '../electron/main.js')], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electronProcess.on('close', () => {
    console.log('Electron closed, stopping Vite...');
    viteProcess.kill();
    process.exit();
  });

  electronProcess.on('error', (error) => {
    console.error('Electron error:', error);
    viteProcess.kill();
    process.exit(1);
  });
}, 3000);

process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping processes...');
  viteProcess.kill();
  process.exit();
});
