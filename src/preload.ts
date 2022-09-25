import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    Main: typeof api;
    isRenderer: typeof ipcRenderer;
  }
}

const api = {};

contextBridge.exposeInMainWorld("Main", api);
