import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;


function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 1024, webPreferences: { nodeIntegration: true } });

  const isServe = process.env.ELECTRON_SERVE === 'true';
  if (isServe) {
    const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
    mainWindow.loadURL(process.env.ELECTRON_URL);
    mainWindow.webContents.openDevTools();
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
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
