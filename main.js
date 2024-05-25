/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/


const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const obtainedItemsFilePath = path.join(app.getPath('userData'), 'obtainedItems.json');

let highscoreFile = path.join(app.getPath('userData'), 'highscore.json');
let highscore = 0;

let mainWindow;

// Load highscore from file
if (fs.existsSync(highscoreFile)) {
  const data = fs.readFileSync(highscoreFile);
  highscore = JSON.parse(data).highscore || 0;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'build/icons/countericon.png'),
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

  ipcMain.handle('saveObtainedItems', async (event, items) => {
    try {
        fs.writeFileSync(obtainedItemsFilePath, JSON.stringify(items, null, 2));
        return true;
    } catch (error) {
        console.error("Error saving obtained items:", error);
        return false;
    }
});

ipcMain.handle('loadObtainedItems', async () => {
    try {
        if (fs.existsSync(obtainedItemsFilePath)) {
            const data = fs.readFileSync(obtainedItemsFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error loading obtained items:", error);
        return [];
    }
});