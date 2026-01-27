const { contextBridge, ipcRenderer } = require('electron');

// Expor funcionalidades seguras para o renderer (Opcional, mas mantido para compatibilidade)
contextBridge.exposeInMainWorld('loudClient', {
    changeVersion: (url) => ipcRenderer.send('change-url', url),
});

/**
 * Injeção de CSS Otimizado
 * Carrega o CSS customizado via IPC e injeta no head do documento.
 */
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const cssContent = await ipcRenderer.invoke('get-css');
        if (cssContent) {
            const style = document.createElement('style');
            style.id = 'loud-client-base-css';
            style.textContent = cssContent;
            document.head.appendChild(style);
            console.log("Loud Client: Otimizações de CSS aplicadas com sucesso.");
        }
    } catch (error) {
        console.error("Loud Client Error [CSS Injection]:", error);
    }
});

/**
 * Lógica de Perfis de Performance
 * Altera o CSS injetado dinamicamente com base no perfil selecionado.
 */
ipcRenderer.on('set-profile', (event, profile) => {
    try {
        console.log(`Loud Client: Aplicando perfil de performance: ${profile}`);

        // Remover perfis anteriores para evitar conflitos
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
    } catch (error) {
        console.error("Loud Client Error [set-profile]:", error);
    }
});

/**
 * Implementação de FPS Cap (Limitação de Taxa de Quadros)
 * Intercepta o requestAnimationFrame para controlar quando o callback do jogo é executado.
 */
let targetFPS = -1; // -1 significa ilimitado
let lastFrameTime = performance.now();

const originalRAF = window.requestAnimationFrame;

window.requestAnimationFrame = (callback) => {
    return originalRAF((time) => {
        // Se ilimitado, apenas executa o callback normalmente
        if (targetFPS === -1) {
            lastFrameTime = time;
            callback(time);
            return;
        }

        const frameInterval = 1000 / targetFPS;
        const elapsed = time - lastFrameTime;

        // Se o tempo decorrido for maior ou igual ao intervalo desejado, executa o frame
        if (elapsed >= frameInterval) {
            // Sincroniza o lastFrameTime subtraindo o excesso (jitter) para manter a média estável
            lastFrameTime = time - (elapsed % frameInterval);
            callback(time);
        } else {
            // Se ainda não deu o tempo, solicita o próximo frame do navegador para tentar novamente
            window.requestAnimationFrame(callback);
        }
    });
};

// Listener para atualizar o limite de FPS em tempo real
ipcRenderer.on('set-fps-cap', (event, cap) => {
    console.log(`Loud Client: FPS Cap alterado para: ${cap}`);
    targetFPS = parseInt(cap);
});
