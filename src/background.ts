'use strict';

import { app, protocol, BrowserWindow, globalShortcut, screen, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';

import { settings } from './settings';
import ElectronStore, { setupConfigEvents } from '@/electron/electron-store';
import { WindowContainer } from './electron/definitions/definitions';
import settingsWindow from './electron/browser-windows/settings-window';
const isDevelopment = process.env.NODE_ENV !== 'production';

app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage', '100');

const windows: WindowContainer = {
  main: null as BrowserWindow | null
};

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  windows.main = new BrowserWindow({
    width: screen.getPrimaryDisplay().size.width * settings.widthScaleRatio,
    height: screen.getPrimaryDisplay().size.height * settings.heightScaleRatio,
    frame: false,
    transparent: false,
    webPreferences: {
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    windows.main.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) windows.main.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    windows.main.loadURL('app://./index.html');
  }

  windows.main.on('closed', () => {
    windows.main = null;
  });

  windows.main.on('close', (e) => {
    windows.main?.destroy();
    windows.main = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.main === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  autoUpdater.checkForUpdatesAndNotify().then((result) => {
    console.log(result);
  });

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  setupConfigEvents();
  createWindow();
  windows.main?.setAlwaysOnTop(true, 'pop-up-menu');
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.whenReady().then(() => {
  globalShortcut.register(settings.swapGameWindowHotkey, () => {
    windows.main?.webContents.send('swap-game-window');
  });
  globalShortcut.register(settings.toggleFrameHotkey, () => {
    windows.main?.webContents.send('toggle-frame');
  });
  globalShortcut.register(settings.hideWindowHotkey, () => {
    if (windows.main?.isMinimized()) {
      windows.main?.show();
    } else {
      windows.main?.minimize();
    }
  });

  ipcMain.on('toggle-settings', (event, state: boolean) => {
    console.log(state);
    if (state === undefined || state === true) {
      settingsWindow.createWindow(windows);
    } else {
      // hide
    }
  });
});
