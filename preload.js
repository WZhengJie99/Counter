/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHighscore: () => ipcRenderer.invoke('get-highscore'),
  setHighscore: (highscore) => ipcRenderer.invoke('set-highscore', highscore),
  saveObtainedItems: (items) => ipcRenderer.invoke('saveObtainedItems', items),
  loadObtainedItems: () => ipcRenderer.invoke('loadObtainedItems')
});