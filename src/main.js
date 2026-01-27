const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;
if (!isDev) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
}

// Desativar aceleração de hardware se necessário, mas o requisito pede para FORÇAR.
// Electron por padrão usa aceleração de hardware.
// app.disableHardwareAcceleration(); // NÃO queremos isso.

// Flags de performance agressivas
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('force-gpu-rasterization');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('disable-speech-api');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('no-proxy-server');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('disable-webgl-image-chromium');
app.commandLine.appendSwitch('enable-webgl2-compute-context');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('disable-low-end-device-mode');
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('enable-parallel-assembling');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Loud Client",
        backgroundColor: '#000000',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            v8CacheOptions: 'bypassHeatCheck',
        }
    });

    // Menu minimalista para troca de versão e perfis
    const template = [
        {
            label: 'Versão',
            submenu: [
                { label: 'Krunker Main', click: () => mainWindow.loadURL('https://krunker.io') },
                { label: 'Krunker Social', click: () => mainWindow.loadURL('https://krunker.io/social.html') },
                { label: 'Krunker Editor', click: () => mainWindow.loadURL('https://krunker.io/editor.html') },
                { label: 'Krunker Viewer', click: () => mainWindow.loadURL('https://krunker.io/viewer.html') },
                { type: 'separator' },
                { label: 'Custom URL', click: () => {
                    // Simples prompt via JS na janela
                    mainWindow.webContents.executeJavaScript(`
                        const url = prompt("Insira a URL do Krunker:");
                        if (url) window.location.href = url;
                    `);
                }}
            ]
        },
        {
            label: 'Perfis de Performance',
            submenu: [
                { label: 'Default', click: () => mainWindow.webContents.send('set-profile', 'default') },
                { label: 'Extreme (No UI)', click: () => mainWindow.webContents.send('set-profile', 'extreme') },
                { label: 'Low Latency', click: () => mainWindow.webContents.send('set-profile', 'low-latency') }
            ]
        },
        {
            label: 'FPS Cap',
            submenu: [
                { label: 'Unlimited', click: () => mainWindow.webContents.send('set-fps-cap', -1) },
                { label: '60 FPS', click: () => mainWindow.webContents.send('set-fps-cap', 60) },
                { label: '120 FPS', click: () => mainWindow.webContents.send('set-fps-cap', 120) },
                { label: '144 FPS', click: () => mainWindow.webContents.send('set-fps-cap', 144) },
                { label: '240 FPS', click: () => mainWindow.webContents.send('set-fps-cap', 240) }
            ]
        },
        {
            label: 'Client',
            submenu: [
                { label: 'Recarregar', role: 'reload' },
                ...(isDev ? [{ label: 'DevTools', role: 'toggleDevTools' }] : []),
                { label: 'Sair', role: 'quit' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.loadURL('https://krunker.io');

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

// Comunicação para trocar URL (Versões)
ipcMain.on('change-url', (event, url) => {
    if (mainWindow) {
        mainWindow.loadURL(url);
    }
});

// Handler para fornecer CSS ao preload
ipcMain.handle('get-css', () => {
    const cssPath = path.join(__dirname, 'styles', 'custom.css');
    if (fs.existsSync(cssPath)) {
        return fs.readFileSync(cssPath, 'utf8');
    }
    return '';
});
