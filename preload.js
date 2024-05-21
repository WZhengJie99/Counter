const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHighscore: () => ipcRenderer.invoke('get-highscore'),
  setHighscore: (highscore) => ipcRenderer.invoke('set-highscore', highscore)
});