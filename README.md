# Loud Client - Krunker.io Performance Client

Loud Client é um client customizado para Krunker.io construído com Electron, focado em atingir o máximo de desempenho e a menor latência de input possível.

## Estrutura do Projeto
```
loud-client/
├── package.json
├── src/
│   ├── main.js        # Processo principal, configurações do Chromium e janelas
│   ├── preload.js     # Script de ponte, injeção de CSS e perfis
│   └── styles/
│       └── custom.css # Otimizações de interface (CSS)
```

## Flags do Chromium Aplicadas

Abaixo estão as flags utilizadas no `main.js` e a explicação técnica de cada uma:

*   `--disable-frame-rate-limit`: Remove o limite de 60 FPS imposto pelo navegador, permitindo que o jogo rode na taxa máxima que o hardware suporta.
*   `--disable-gpu-vsync`: Desativa a sincronização vertical, essencial para reduzir o input lag, permitindo que novos frames sejam exibidos assim que renderizados.
*   `--force-gpu-rasterization` & `--enable-gpu-rasterization`: Força a GPU a processar a rasterização de elementos, aliviando a CPU.
*   `--disable-background-timer-throttling`: Impede que o Chromium reduza a prioridade de timers quando a janela não está em foco ou está em segundo plano, mantendo a consistência dos frames.
*   `--disable-renderer-backgrounding`: Evita que o sistema operacional coloque o processo de renderização em modo de baixo consumo.
*   `--enable-zero-copy`: Permite que a GPU escreva diretamente nos buffers de rasterização, economizando ciclos de memória.
*   `--ignore-gpu-blocklist`: Garante que a aceleração de hardware seja usada mesmo em GPUs que o Chromium considera "não suportadas".
*   `--disable-site-isolation-trials`: Reduz o overhead de criação de processos isolados para cada site, economizando memória e CPU (uso otimizado para jogo único).
*   `--enable-webgl2-compute-context`: Habilita suporte a WebGL2 Compute para processamentos paralelos avançados.

## Otimizações Técnicas

### 1. Estabilidade de Frametime
Ao desativar o *throttling* de background e forçar a aceleração de hardware em todos os níveis, o Loud Client garante que o sistema dedique recursos constantes ao jogo, minimizando micro-stutters causados por variações de energia ou trocas de contexto do SO.

### 2. Latência de Input
A combinação de `--disable-gpu-vsync` e o uso de `contextIsolation: true` com um `preload.js` leve garante que o caminho entre o clique do mouse e a resposta na tela seja o mais direto possível, sem buffers adicionais de composição do navegador.

### 3. FPS Alto e Consistente
O CSS customizado remove elementos pesados da UI original do Krunker, como anúncios, animações de menu e sombras complexas, reduzindo o custo de *layout* e *paint* a cada frame.

## Sistema de Perfis
O client oferece perfis acessíveis via menu:
*   **Default**: Otimizações base de performance.
*   **Extreme (No UI)**: Remove quase toda a interface de HUD para máximo FPS durante o gameplay competitivo.
*   **Low Latency**: Foca em remover elementos de chat e overlays que podem causar picos de processamento.

## Controle de FPS
O client permite definir um teto de FPS através do menu "FPS Cap". Isso é feito via interceptação de `requestAnimationFrame` no `preload.js`, garantindo que o jogo não consuma mais recursos do que o necessário, mantendo frametimes consistentes.

## Como Gerar e Publicar na Aba Releases do GitHub

O projeto já está configurado com **GitHub Actions**. Isso significa que você pode automatizar a criação do executável e a postagem na aba "Releases" seguindo estes passos:

### 1. Preparar o Repositório
Se você ainda não enviou o código para o GitHub:
1. Crie um repositório no GitHub.
2. No seu terminal, execute:
   ```bash
   git init
   git add .
   git commit -m "Iniciando Loud Client com instalador"
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

### 2. Criar uma Release Automática
Para gerar o instalador e colocá-lo automaticamente no GitHub:

**Opção A: Via Tags (Recomendado)**
1. Crie uma "Tag" de versão:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. O GitHub Actions detectará a tag e iniciará o build automaticamente.
3. Após alguns minutos, o arquivo `.exe` aparecerá na aba **Releases** do seu repositório.

**Opção B: Manualmente (Actions)**
1. Vá na aba **Actions** do seu repositório no GitHub.
2. Selecione o workflow **Build and Release** à esquerda.
3. Clique no botão **Run workflow** à direita e confirme.
4. Isso gerará um build da branch principal e criará uma release.

### 3. Publicação Manual
Se preferir fazer manualmente:
1. Rode `npm run build` no seu PC.
2. Vá na pasta `dist/` e pegue o arquivo `Loud Client Setup 1.0.0.exe`.
3. No GitHub, vá em **Releases** -> **Draft a new release**.
4. Arraste o `.exe` para a área de upload e publique.

---

## Como Usar (Desenvolvimento)
1. Instale as dependências: `npm install`
2. Inicie o client: `npm start`
3. Alterne versões ou URLs através do menu "Versão".

