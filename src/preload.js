const { contextBridge, ipcRenderer } = require('electron');

// Expor funcionalidades seguras para o renderer
contextBridge.exposeInMainWorld('loudClient', {
    changeVersion: (url) => ipcRenderer.send('change-url', url),
});

// Injeção de CSS Otimizado sem usar 'fs' diretamente
window.addEventListener('DOMContentLoaded', async () => {
    const cssContent = await ipcRenderer.invoke('get-css');
    if (cssContent) {
        const style = document.createElement('style');
        style.id = 'loud-client-base-css';
        style.textContent = cssContent;
        document.head.appendChild(style);
    }
    console.log("Loud Client: Otimizações de CSS aplicadas.");
});

// Lógica de Perfis de Performance
ipcRenderer.on('set-profile', (event, profile) => {
    console.log(`Mudando para o perfil: ${profile}`);
    
    // Remover perfis anteriores
    ['extreme-profile', 'low-latency-profile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    if (profile === 'extreme') {
        const style = document.createElement('style');
        style.id = 'extreme-profile';
        style.textContent = `
            #uiBase { display: none !important; }
            #chatHolder { display: none !important; }
        `;
        document.head.appendChild(style);
    } else if (profile === 'low-latency') {
        const style = document.createElement('style');
        style.id = 'low-latency-profile';
        style.textContent = `
            #chatList { display: none !important; }
            #voiceDisplay { display: none !important; }
            .healthBar { box-shadow: none !important; }
        `;
        document.head.appendChild(style);
    }
});

// Implementação de FPS Cap (Controlado pelo Client)
let targetFPS = -1; // -1 = Unlimited
let lastTime = performance.now();

const originalRAF = window.requestAnimationFrame;
window.requestAnimationFrame = (callback) => {
    return originalRAF((time) => {
        if (targetFPS === -1) {
            callback(time);
            return;
        }

        const frameInterval = 1000 / targetFPS;
        const elapsed = time - lastTime;

        if (elapsed >= frameInterval) {
            lastTime = time - (elapsed % frameInterval);
            callback(time);
        } else {
            window.requestAnimationFrame(callback);
        }
    });
};

ipcRenderer.on('set-fps-cap', (event, cap) => {
    console.log(`FPS Cap alterado para: ${cap}`);
    targetFPS = parseInt(cap);
});
