const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMenu } = require('./menu');
const { loadSettings } = require('./settings');

const isDev = !app.isPackaged;

/**
 * Chromium Performance Flags
 * Otimizadas para Krunker.io - Foco em Estabilidade e FPS
 */

if (!isDev) {
    // Desativar logs em produção para economizar recursos
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
}

// Flags de Performance Estáveis
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');

// Otimização de Background (Evita quedas de FPS)
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

// Redução de Latência e Overhead
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

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Loud Client",
        backgroundColor: '#000000',
        autoHideMenuBar: true, // Menu oculto por padrão (pressione Alt)
        icon: path.join(__dirname, '..', 'build', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            v8CacheOptions: 'bypassHeatCheck',
        }
    });

    // Iniciar menu simplificado
    createMenu(mainWindow, isDev);

    mainWindow.loadURL('https://krunker.io');

    // Atalhos de Teclado (F11: Tela Cheia, F5: Recarregar, F12: DevTools)
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

    // Aplicar configurações de performance ao carregar
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

// Comunicação IPC
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
