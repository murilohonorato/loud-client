const { Menu } = require('electron');

/**
 * Cria o menu da aplicação.
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
            label: 'Client',
            submenu: [
                { label: 'Recarregar', role: 'reload' },
                { label: 'Tela Cheia', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
                ...(isDev ? [{ label: 'DevTools', role: 'toggleDevTools' }] : []),
                { label: 'Sair', role: 'quit' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = { createMenu };
