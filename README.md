# Loud Client - Krunker.io Performance Client

Loud Client é um client customizado para Krunker.io construído com Electron, focado em atingir o máximo de desempenho e a menor latência de input possível.

## Estrutura do Projeto (Modularizada)
```
loud-client/
├── build/
│   └── icon.png       # Ícone do aplicativo
├── src/
│   ├── main.js        # Processo principal e flags do Chromium
│   ├── menu.js        # Lógica de menus e atalhos
│   ├── settings.js    # Persistência de configurações
│   ├── preload.js     # Injeção de CSS e perfis de performance
│   └── styles/
│       └── custom.css # CSS base de otimização de UI
```

## Flags do Chromium Aplicadas
As flags foram selecionadas para máxima estabilidade, removendo switches experimentais que causavam stutters.
*   `--disable-frame-rate-limit`: FPS Ilimitado.
*   `--disable-gpu-vsync`: Redução drástica de Input Lag.

## Configurações e Atalhos
O client agora salva suas preferências automaticamente.
*   **Menu Oculto**: A barra de menu superior é oculta por padrão para um visual limpo. Pressione `Alt` para acessá-la.
*   **Perfis de Performance**: Escolha entre *Default*, *Low Latency* (Padrão) e *Extreme*.
*   **Limite de FPS**: Ajuste via menu ou mantenha em *Unlimited*.
*   `F11`: Alternar Tela Cheia.
*   `F5`: Recarregar o Jogo.

## GitHub Actions (CI/CD)
O repositório está configurado para gerar builds automáticos:
1. **CI Check**: Verifica se o código compila a cada push.
2. **Build and Release**: Ao criar uma tag (ex: `v1.0.9`), o GitHub gera automaticamente o instalador `.exe` e o publica em "Releases".

---
**Desenvolvido por Loud** - Otimizado para a comunidade competitiva.
