"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 1024, height: 1024, webPreferences: { nodeIntegration: true } });
    const isServe = !!process.env.ELECTRON_URL;
    console.log('ELECTRON MSG START:', process.env.ELECTRON_URL);
    if (isServe) {
        // const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
        mainWindow.loadURL(process.env.ELECTRON_URL + '/');
        mainWindow.webContents.openDevTools();
        // installExtension(REDUX_DEVTOOLS)
        //   .then((name) => console.log(`Added Extension:  ${name}`))
        //   .catch((err) => console.log('An error occurred: ', err));
    }
    else {
        mainWindow.loadFile('index.html');
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
