import { app, BrowserWindow, ipcMain } from "electron";
import { oAuthClient } from "./lib/OAuthClient";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 320,
    width: 320,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.menuBarVisible = false;
  // mainWindow.webContents.openDevTools();
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("invoke-logout", () => {
  console.log("Todo, logout function?");
});

ipcMain.on("send-login", (event, app: App) => {
  oAuthClient.init(app, onSuccess, onError);
});

function onSuccess(token: Token) {
  console.log("Token retrieved!", { token });
  updateStore({ token, isLoggedIn: true, isSubmitting: false });
}

function onError(error: string) {
  updateStore({ error, isSubmitting: false });
}

function updateStore(data: Partial<StoreProps>) {
  mainWindow.webContents.send("on-store", data);
}
