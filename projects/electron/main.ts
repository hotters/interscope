import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  const isServe = process.env.ELECTRON_SERVE === 'true';
  if (isServe) {
    mainWindow.loadURL(process.env.ELECTRON_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('index.html');
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
