const { Menu } = require('electron');
const { saveSettings } = require('./settings');

/**
 * Cria o menu da aplicação com persistência de configurações.
 * @param {BrowserWindow} mainWindow A janela principal.
 * @param {boolean} isDev Se está em modo de desenvolvimento.
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
            label: 'Perfis de Performance',
            submenu: [
                {
                    label: 'Default',
                    click: () => {
                        mainWindow.webContents.send('set-profile', 'default');
                        saveSettings({ profile: 'default' });
                    }
                },
                {
                    label: 'Extreme (No UI)',
                    click: () => {
                        mainWindow.webContents.send('set-profile', 'extreme');
                        saveSettings({ profile: 'extreme' });
                    }
                },
                {
                    label: 'Low Latency',
                    click: () => {
                        mainWindow.webContents.send('set-profile', 'low-latency');
                        saveSettings({ profile: 'low-latency' });
                    }
                }
            ]
        },
        {
            label: 'FPS Cap',
            submenu: [
                {
                    label: 'Unlimited',
                    click: () => {
                        mainWindow.webContents.send('set-fps-cap', -1);
                        saveSettings({ fpsCap: -1 });
                    }
                },
                {
                    label: '60 FPS',
                    click: () => {
                        mainWindow.webContents.send('set-fps-cap', 60);
                        saveSettings({ fpsCap: 60 });
                    }
                },
                {
                    label: '120 FPS',
                    click: () => {
                        mainWindow.webContents.send('set-fps-cap', 120);
                        saveSettings({ fpsCap: 120 });
                    }
                },
                {
                    label: '144 FPS',
                    click: () => {
                        mainWindow.webContents.send('set-fps-cap', 144);
                        saveSettings({ fpsCap: 144 });
                    }
                },
                {
                    label: '240 FPS',
                    click: () => {
                        mainWindow.webContents.send('set-fps-cap', 240);
                        saveSettings({ fpsCap: 240 });
                    }
                }
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
}

module.exports = { createMenu };
