const { Menu } = require('electron');
const { saveSettings } = require('./settings');

/**
 * Cria o menu da aplicação.
 */
function createMenu(mainWindow, isDev) {
    const template = [
        {
            label: 'Versão',
            submenu: [
                { label: 'Krunker Main', click: () => mainWindow.loadURL('https://krunker.io') },
                { label: 'Krunker Social', click: () => mainWindow.loadURL('https://krunker.io/social.html') },
                { label: 'Krunker Editor', click: () => mainWindow.loadURL('https://krunker.io/editor.html') },
                { label: 'Krunker Viewer', click: () => mainWindow.loadURL('https://krunker.io/viewer.html') },
                { type: 'separator' },
                {
                    label: 'Custom URL',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            const url = prompt("Insira a URL do Krunker:");
                            if (url) window.location.href = url;
                        `);
                    }
                }
            ]
        },
        {
            label: 'Configurações',
            submenu: [
                {
                    label: 'Perfil de Performance',
                    submenu: [
                        { label: 'Default', click: () => { mainWindow.webContents.send('set-profile', 'default'); saveSettings({ profile: 'default' }); } },
                        { label: 'Extreme (No UI)', click: () => { mainWindow.webContents.send('set-profile', 'extreme'); saveSettings({ profile: 'extreme' }); } },
                        { label: 'Low Latency', click: () => { mainWindow.webContents.send('set-profile', 'low-latency'); saveSettings({ profile: 'low-latency' }); } }
                    ]
                },
                {
                    label: 'Limite de FPS',
                    submenu: [
                        { label: 'Unlimited', click: () => { mainWindow.webContents.send('set-fps-cap', -1); saveSettings({ fpsCap: -1 }); } },
                        { label: '60 FPS', click: () => { mainWindow.webContents.send('set-fps-cap', 60); saveSettings({ fpsCap: 60 }); } },
                        { label: '144 FPS', click: () => { mainWindow.webContents.send('set-fps-cap', 144); saveSettings({ fpsCap: 144 }); } }
                    ]
                }
            ]
        },
        {
            label: 'Client',
            submenu: [
                { label: 'Recarregar (F5)', role: 'reload' },
                { label: 'Tela Cheia (F11)', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
                ...(isDev ? [{ label: 'DevTools (F12)', role: 'toggleDevTools' }] : []),
                { type: 'separator' },
                { label: 'Sair', role: 'quit' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = { createMenu };
