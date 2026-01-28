const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('loudClient', {
    changeVersion: (url) => ipcRenderer.send('change-url', url),
});

// Injeção de CSS Base
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const cssContent = await ipcRenderer.invoke('get-css');
        if (cssContent) {
            const style = document.createElement('style');
            style.id = 'loud-client-base-css';
            style.textContent = cssContent;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.error("Loud Client Error [CSS Injection]:", error);
    }
});

// Listener de Perfis de Performance
ipcRenderer.on('set-profile', (event, profile) => {
    try {
        // Limpar perfis anteriores
        ['performance-profile'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        const style = document.createElement('style');
        style.id = 'performance-profile';

        if (profile === 'extreme') {
            style.textContent = `
                #uiBase { display: none !important; }
                #chatHolder { display: none !important; }
                #adCon, .ad-unit, #preroll, #instructionHolder { display: none !important; }
            `;
            document.head.appendChild(style);
        } else if (profile === 'low-latency') {
            style.textContent = `
                #adCon, .ad-unit, #preroll, #newsHolder, #merchHolder { display: none !important; }
                #chatHolder { opacity: 0.5; transition: opacity 0.2s; }
                #chatHolder:hover { opacity: 1; }
            `;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.error("Loud Client Error [set-profile]:", error);
    }
});

// FPS Cap Otimizado
let targetFPS = -1;
let lastFrameTime = performance.now();
const originalRAF = window.requestAnimationFrame;

window.requestAnimationFrame = (callback) => {
    if (targetFPS === -1) {
        return originalRAF(callback);
    }

    return originalRAF((time) => {
        const frameInterval = 1000 / targetFPS;
        const elapsed = time - lastFrameTime;

        if (elapsed >= frameInterval) {
            lastFrameTime = time - (elapsed % frameInterval);
            callback(time);
        } else {
            window.requestAnimationFrame(callback);
        }
    });
};

ipcRenderer.on('set-fps-cap', (event, cap) => {
    targetFPS = parseInt(cap);
    lastFrameTime = performance.now();
});
