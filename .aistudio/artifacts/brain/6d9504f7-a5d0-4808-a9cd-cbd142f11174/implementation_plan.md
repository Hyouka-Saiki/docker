# Dokke para Windows & Companion Touch Deck

Plano de implementação para o ecossistema Dokke, unindo o Host Desktop (Windows & Mac) com painel de gerenciamento, gerador de PIN e servidor de rede ao Companion Touch Deck (dock táctil para celular, tablet e navegador) com criação livre de botões, atalhos web e controle de aplicativos.

### User Review & Critical Decisions

> [!IMPORTANT]
> As seguintes decisões foram confirmadas nas perguntas de alinhamento e guiarão a experiência do aplicativo:

- **Confirmed Decision 1 (Modo Principal)**: Experiência híbrida completa. A aplicação oferecerá uma visualização dual fluida: o **Host Dokke** (painel desktop com abas Apps, Sobre/Rede, PIN e status) e o **Companion Deck** (dock táctil interativo com feedback háptico visual, personalizável para telas sensíveis ao toque).
- **Confirmed Decision 2 (Comportamento de Ações & Apps)**: Modo personalizável com criação livre de botões e atalhos web, permitindo adicionar, editar e reordenar botões de atalho, URLs diretas, comandos de sistema, controle de janelas e ações personalizadas com ícones e cores customizáveis.

---

### 1. Overview & Core Concept

- **What It Does**: O Dokke transforma qualquer computador em um servidor de automação e dock com pareamento seguro por PIN, permitindo que celulares, tablets ou telas secundárias funcionem como um Stream Deck táctil sem fio de baixa latência na rede local (LAN).
- **Target Audience / Persona**: Criadores de conteúdo, streamers, desenvolvedores, profissionais multitarefa e usuários que querem controlar seus aplicativos, janelas, mídias e atalhos web diretamente de seus dispositivos móveis.
- **Key Value**: Elimina a necessidade de hardware proprietário caro (como Stream Deck físico), fornecendo um dock moderno, personalizável, com suporte nativo a Windows e macOS e interface de pareamento instantânea por QR Code ou PIN numérico.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Host Desktop Flow*: O usuário abre o painel do Dokke, visualiza o status do servidor local na porta 3000, consulta o endereço de IP da LAN com QR Code para pareamento rápido, gera novos códigos PIN e gerencia o catálogo de aplicativos fixados e atalhos globais.
  2. *Companion Deck Flow*: O usuário (no smartphone ou simulador integrado) acessa a tela de pareamento, insere o PIN de segurança exibido no Host e desbloqueia imediatamente a grade de botões tácteis.
  3. *Customização & Disparo*: Ao tocar em qualquer botão do Deck, a ação correspondente é despachada com feedback visual instantâneo (animação de clique e confirmação de disparo). O usuário pode clicar em "+ Adicionar Atalho" para criar botões com títulos, ícones, cores, tipo de ação (URL web, foco de aplicativo, controle multimídia ou OBS).
  4. *Alternância de Visualização*: Um alternador discreto no topo permite transitar perfeitamente entre o modo **Host Dokke (Desktop)**, **Companion Deck (Mobile/Tablet)** e **Visão Dividida (Split Screen)** para demonstração e uso simultâneo.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Estética industrial contemporânea refinada para ferramentas de produtividade e áudio/vídeo profissional (dark slate profundo `#0F172A`, superfícies `#1E293B`, bordas finas `#334155`).
  - *Color Palette & Mood*: Fundo ardósia escuro com toques acentuados em azul elétrico (`#3B82F6`) e esmeralda para status conectado (`#10B981`). Botões do Deck com acabamento acetinado e brilho sutil ao toque.
  - *Typography & Hierarchy*: Fonte display `Plus Jakarta Sans` para títulos e identidade, combinada com `DM Sans` para leitura e `JetBrains Mono` / `tabular-nums` para endereços de rede, portas e PIN numérico.
  - *Component Styling & Layout*: Botões táteis com hitbox generosa ($\ge 48\text{px}$), ícones nítidos da biblioteca Lucide, cartões com bordas sutis e ausência de elementos puramente decorativos ou falsos tickers.

- **Interactive Feedback & Motion**:
  - Resposta a toques e cliques em $\le 150\text{ms}$ com micro-escalonamento tátil (`active:scale-95`).
  - Transições suaves entre abas (Apps, Sobre, Customizar) e feedback sonoro/visual opcional ao disparar ações.
  - Alerta claro e explicativo caso a porta 3000 esteja em conflito ou haja erro de conexão.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Arquitetura Dual Host + Deck na mesma aplicação web**
  - *Chosen Approach*: Implementar um seletor de modo intuitivo no topo (Host, Companion Mobile e Modo Lado a Lado / Apresentação), permitindo que tanto a experiência do painel de administração Windows quanto a experiência do cliente mobile sejam utilizadas de forma interativa diretamente no navegador.
  - *Why*: Permite que o usuário teste o ecossistema completo de ponta a ponta sem precisar de um segundo aparelho físico imediatamente, mas com layout 100% responsivo para abrir em um celular de verdade.
- **Decision 2: Armazenamento e Customização Reativa**
  - *Chosen Approach*: Persistência via estado local reativo sincronizado com a API Express (`/api/apps`, `/api/config/pinned`, `/api/pin`, `/health`), com suporte para exportação e importação de perfis de atalhos em JSON.
  - *Why*: Oferece personalização instantânea e confiável, atendendo com precisão à escolha do usuário por atalhos customizáveis e ações livres.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DOKKE APP ECOSYSTEM                             │
├───────────────────────────────────┬────────────────────────────────────┤
│         HOST VIEW (Desktop)       │       COMPANION VIEW (Deck)        │
│  ┌─────────────┐ ┌──────────────┐ │  ┌──────────────────────────────┐  │
│  │  Aba Apps   │ │  Aba Sobre   │ │  │      Tela de PIN / Auth      │  │
│  │ (Fixados e  │ │  (IP LAN, QR │ │  └──────────────┬───────────────┘  │
│  │ Instalados) │ │  PIN, Porta) │ │                 │                  │
│  └──────┬──────┘ └──────┬───────┘ │  ┌──────────────▼───────────────┐  │
│         │               │         │  │     Grade Táctil de Botões   │  │
│         │               │         │  │  (Apps, URLs, Mídia, OBS)   │  │
│         └───────┬───────┘         │  └──────────────┬───────────────┘  │
│                 │                 │                 │                  │
└─────────────────┼─────────────────┴─────────────────┼──────────────────┘
                  │                                   │
                  ▼                                   ▼
         ┌─────────────────────────────────────────────────────┐
         │              Dokke State & Dispatcher               │
         │   (Pin Auth, App Launcher, Custom Action Store)     │
         └────────────────────────┬────────────────────────────┘
                                  │
                                  ▼
         ┌─────────────────────────────────────────────────────┐
         │             Backend API Mock & Bridge               │
         │   GET /health · GET /api/apps · POST /api/pin       │
         │   POST /api/config/pinned · POST /api/actions/run   │
         └─────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `ServerState`: `{ status: "online" | "port-busy" | "adopted", port: 3000, ip: string, pin: string, clientCount: number }`
  - `DockButton`: `{ id: string, label: string, icon: string, color: string, actionType: "open_app" | "open_url" | "media" | "obs" | "custom", payload: string, running: boolean }`
  - `InstalledApp`: `{ name: string, category: string, icon: string, path: string, running: boolean }`
- **Interactive Component & State Mapping**:
  - *Host View*: Permite fixar/desafixar aplicativos, alternar inicialização automática com o sistema, gerar novo PIN e simular processos em execução.
  - *Deck View*: Teclado numérico para autenticação com PIN; grade responsiva de 3x4 ou 4x5 botões táteis; formulário modal para criar novos atalhos com escolha de ícones e cores; feedback de execução em tempo real.
  - *Modo Apresentação*: Permite acionar no Companion e ver o efeito refletido imediatamente no Host (ex: indicador de app em execução acendendo).
