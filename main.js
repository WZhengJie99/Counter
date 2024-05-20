const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let highscoreFile = path.join(app.getPath('userData'), 'highscore.json');
let highscore = 0;

// Load highscore from file
if (fs.existsSync(highscoreFile)) {
  const data = fs.readFileSync(highscoreFile);
  highscore = JSON.parse(data).highscore || 0;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

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

// IPC Handlers - get-highscore and set-highscore are set up to manage highscore data.
ipcMain.handle('get-highscore', () => {
    return highscore;
  });
  
  ipcMain.handle('set-highscore', (event, newHighscore) => {
    if (newHighscore > highscore) {
      highscore = newHighscore;
      fs.writeFileSync(highscoreFile, JSON.stringify({ highscore }));
    }
  });