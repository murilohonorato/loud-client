const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMenu } = require('./menu');
const { loadSettings } = require('./settings');

const isDev = !app.isPackaged;

/**
 * Configuração de Performance do Chromium
 * Flags otimizadas para Krunker.io
 */

if (!isDev) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
}

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('force-gpu-rasterization');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl2-compute-context');
app.commandLine.appendSwitch('disable-webgl-image-chromium');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-parallel-assembling');
app.commandLine.appendSwitch('no-proxy-server');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('disable-low-end-device-mode');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('disable-speech-api');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('high-dpi-support', '1');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Loud Client",
        backgroundColor: '#000000',
        autoHideMenuBar: true,
        icon: path.join(__dirname, '..', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            v8CacheOptions: 'bypassHeatCheck',
        }
    });

    createMenu(mainWindow, isDev);

    mainWindow.loadURL('https://krunker.io');

    // Suporte a Atalhos de Teclado (F11, F5, F12)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.type === 'keyDown') {
            if (input.key === 'F11') {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                event.preventDefault();
            } else if (input.key === 'F5') {
                mainWindow.reload();
                event.preventDefault();
            } else if (input.key === 'F12' && isDev) {
                mainWindow.webContents.toggleDevTools();
                event.preventDefault();
            }
        }
    });

    mainWindow.webContents.on('did-finish-load', () => {
        const settings = loadSettings();
        mainWindow.webContents.send('set-profile', settings.profile);
        mainWindow.webContents.send('set-fps-cap', settings.fpsCap);
    });

    if (!isDev) {
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('change-url', (event, url) => {
    if (mainWindow) {
        mainWindow.loadURL(url);
    }
});

ipcMain.handle('get-css', () => {
    try {
        const cssPath = path.join(__dirname, 'styles', 'custom.css');
        if (fs.existsSync(cssPath)) {
            return fs.readFileSync(cssPath, 'utf8');
        }
    } catch (error) {
        console.error("Loud Client Error [get-css]:", error);
    }
    return '';
});
