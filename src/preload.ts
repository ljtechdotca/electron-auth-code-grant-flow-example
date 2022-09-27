import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

declare global {
  interface Window {
    Main: typeof api;
    isRenderer: typeof ipcRenderer;
  }
}

const api = {
  onStore: (callback: (event: IpcRendererEvent, data: StoreProps) => void) =>
    ipcRenderer.on("on-store", callback),
  invokeLogout: () => ipcRenderer.invoke("invoke-logout"),
  sendLogin: (data: App) => ipcRenderer.send("send-login", data),
};

contextBridge.exposeInMainWorld("Main", api);
