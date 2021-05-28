import { app, BrowserWindow, Menu, protocol, systemPreferences } from 'electron';
import * as path from 'path';
import * as url from 'url';
const slash = require('slash');
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36';

let mainWindow: Electron.BrowserWindow | null;
let forceQuit = false;


if (process.platform === 'darwin') {
  // template.unshift({
  //   label: app.getName(),
  //   submenu: [
  //     {
  //       label: `关于 ${app.getName()}`,
  //       role: 'about',
  //       accelerator: '',
  //       // click() {
  //       //   dialog.showMessageBox(mainWindow, { message: 'hello world' });
  //       // },
  //     },
  //   ],
  // });
}

const isMac = 'darwin' === process.platform;

function createWindow() {
  const titleBarStyle = isMac ? 'hiddenInset' : 'default';
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width: 1040,
    height: 715,
    backgroundColor: 'white',
    titleBarStyle,
    title: 'YouComic Studio',
    frame: false,
    // icon: path.join(__dirname, '../../build/icon.png'),
    show: true,
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true
    },

    darkTheme: true,
  });

  mainWindow.webContents.setUserAgent(USER_AGENT);

  if (process.env.NODE_ENV === 'development') {
    if (process.env.DEV_TOOLS) {
      mainWindow.webContents.openDevTools();
    }
    mainWindow.loadURL('http://localhost:8999/');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.webContents.openDevTools();
  if (isMac) {
    setTimeout(() => systemPreferences.isTrustedAccessibilityClient(true), 1000);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', e => {
    if (forceQuit || !isMac) {
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  protocol.interceptFileProtocol('file', (req, callback) => {
    const url = req.url.substr(8);
    callback(slash(decodeURI(url)));
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol');
    }
  });
}

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
});

app.on('before-quit', e => {
  forceQuit = true;
  mainWindow = null;
});
