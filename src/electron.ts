const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require("electron-is-dev");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html so we can ... insert html.
  console.log(__dirname);
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file',
  //   slashes: true
  // }));
  win.loadFile('index.html');
};

app.whenReady()
  .then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
