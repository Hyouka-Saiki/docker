import React, { useState } from 'react';
import {
  Layers,
  Info,
  Sliders,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Power,
  Play,
  Focus,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Monitor,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { InstalledApp, DockButton, HostServerState } from '../types/dokke';
import { availableToPin, matchesQuery } from '../utils/defaultData';
import { QRCodeSVG } from '../utils/qr';
import { DynamicIcon } from './DynamicIcon';

interface HostDesktopProps {
  serverState: HostServerState;
  installedApps: InstalledApp[];
  pinnedAppNames: string[];
  dockButtons: DockButton[];
  onPinApp: (appName: string) => void;
  onUnpinApp: (appName: string) => void;
  onAddCustomApp: (app: InstalledApp) => void;
  onToggleAppRunning: (appName: string) => void;
  onFocusApp: (appName: string) => void;
  onGenerateNewPin: () => void;
  onToggleStartWithWindows: (val: boolean) => void;
  onResetButtons: () => void;
  onSimulatePortBusy: () => void;
  onRestoreServer: () => void;
  activeTab: 'apps' | 'about' | 'deck_settings';
  setActiveTab: (tab: 'apps' | 'about' | 'deck_settings') => void;
}

export const HostDesktop: React.FC<HostDesktopProps> = ({
  serverState,
  installedApps,
  pinnedAppNames,
  dockButtons,
  onPinApp,
  onUnpinApp,
  onAddCustomApp,
  onToggleAppRunning,
  onFocusApp,
  onGenerateNewPin,
  onToggleStartWithWindows,
  onResetButtons,
  onSimulatePortBusy,
  onRestoreServer,
  activeTab,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [customAppPath, setCustomAppPath] = useState('');
  const [customCategory, setCustomCategory] = useState<'Dev' | 'Web' | 'Audio/Video' | 'Games' | 'Utilities'>('Dev');
  const [showRunningProcesses, setShowRunningProcesses] = useState(true);

  const availableApps = availableToPin(installedApps, pinnedAppNames, searchQuery);
  const pinnedAppsList = pinnedAppNames
    .map((name) => installedApps.find((a) => a.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as InstalledApp[];

  const accessUrl = `http://${serverState.lanIp}:${serverState.port}`;

  const copyToClipboard = (text: string, type: 'link' | 'pin') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAppName.trim()) return;

    const newApp: InstalledApp = {
      id: `custom-${Date.now()}`,
      name: customAppName.trim(),
      path: customAppPath.trim() || `C:\\Program Files\\${customAppName.trim()}\\app.exe`,
      category: customCategory,
      colors: ['#3B82F6', '#1D4ED8'],
      initials: customAppName.substring(0, 2).toUpperCase(),
      running: false,
    };

    onAddCustomApp(newApp);
    setCustomAppName('');
    setCustomAppPath('');
    setShowAddCustomModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full text-slate-100 font-sans">
      {/* Barra de Título Windows 11 */}
      <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-bold text-white tracking-tighter">D</span>
          </div>
          <span className="text-xs font-semibold text-slate-300">Dokke para Windows (Host Server)</span>
          <span className="text-[11px] text-slate-500">v2.1.0</span>
          {serverState.status === 'online' ? (
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Online (Porta {serverState.port})
            </span>
          ) : (
            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1.5 ml-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Conflito de Porta
            </span>
          )}
        </div>

        {/* Controles de Janela do Windows */}
        <div className="flex items-center gap-3">
          <button
            title="Minimizar para a bandeja do sistema"
            className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
          >
            ―
          </button>
          <button
            title="Maximizar"
            className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
          >
            □
          </button>
          <button
            title="Ocultar na bandeja (Dokke continua ativo)"
            className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 pt-3 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'apps'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Apps Fixados ({pinnedAppsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'about'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Sobre & Rede</span>
          {serverState.status === 'port-busy' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('deck_settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'deck_settings'
              ? 'border-blue-500 text-blue-400 bg-slate-800/40 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Teclas do Companion Deck</span>
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {serverState.status === 'port-busy' && (
          <div className="bg-amber-950/60 border border-amber-600/40 rounded-xl p-4 text-xs text-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Conflito na porta 3000</p>
                <p className="mt-1 text-slate-300">
                  A porta 3000 está em uso por outro programa. Feche-o e reinicie o Dokke.
                </p>
              </div>
            </div>
            <button
              onClick={onRestoreServer}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shrink-0"
            >
              Restabelecer Dokke
            </button>
          </div>
        )}

        {/* ABA: APPS */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            {/* Header da Seção */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Aplicativos Fixados no Dock</h2>
                <p className="text-xs text-slate-400">
                  Estes aplicativos aparecem em destaque na dock e podem ser focados ou abertos pelo celular.
                </p>
              </div>

              <button
                onClick={() => setShowAddCustomModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar .exe Personalizado</span>
              </button>
            </div>

            {/* Grid de Apps Fixados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pinnedAppsList.map((app) => (
                <div
                  key={app.id}
                  className={`bg-slate-800/80 border rounded-xl p-3 flex items-center justify-between gap-3 transition-all ${
                    serverState.activeWindow === app.name
                      ? 'border-blue-500/80 bg-blue-950/20 shadow-md shadow-blue-900/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Monograma do App estilo Dokke */}
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${app.colors[0]}, ${app.colors[1]})`,
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner text-white font-bold text-xs tracking-wider shrink-0"
                    >
                      {app.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">{app.name}</span>
                        {app.running && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Processo ativo" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{app.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onFocusApp(app.name)}
                      title={app.running ? 'Focar janela' : 'Iniciar aplicativo'}
                      className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition-colors"
                    >
                      {app.running ? <Focus className="w-3.5 h-3.5 text-blue-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => onUnpinApp(app.name)}
                      title="Desafixar do Dokke"
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700/60 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Catálogo de Apps Instalados para Adicionar */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Instalados no Computador (Start Menu &amp; Apps)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Busque e clique em Fixar para disponibilizar na sua dock.
                  </p>
                </div>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar aplicativos..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {availableApps.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Nenhum aplicativo disponível encontrado com &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {availableApps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${app.colors[0]}, ${app.colors[1]})`,
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                        >
                          {app.initials}
                        </div>
                        <span className="text-xs text-slate-300 truncate">{app.name}</span>
                      </div>

                      <button
                        onClick={() => onPinApp(app.name)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-900/30 transition-colors shrink-0"
                      >
                        + Fixar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Processos Ativos com MainWindowHandle */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <button
                onClick={() => setShowRunningProcesses(!showRunningProcesses)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    Processos Ativos com Janela (Get-Process)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ({installedApps.filter((a) => a.running).length} abertos)
                  </span>
                </div>
                <span className="text-xs text-slate-400">{showRunningProcesses ? 'Ocultar' : 'Exibir'}</span>
              </button>

              {showRunningProcesses && (
                <div className="mt-3 divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                  {installedApps
                    .filter((a) => a.running)
                    .map((app) => (
                      <div key={app.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-medium text-slate-200">{app.name}</span>
                          <span className="text-[11px] font-mono text-slate-500">PID: {app.pid}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onFocusApp(app.name)}
                            className="text-[11px] text-blue-400 hover:underline"
                          >
                            Trazer para frente
                          </button>
                          <button
                            onClick={() => onToggleAppRunning(app.name)}
                            className="text-[11px] text-slate-400 hover:text-red-400"
                          >
                            Encerrar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: SOBRE & REDE */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white">Sobre o Dokke Host &amp; Conexão LAN</h2>
              <p className="text-xs text-slate-400">
                O Dokke executa localmente no seu computador e aceita conexões autenticadas do celular ou navegador na mesma rede Wi-Fi.
              </p>
            </div>

            {/* Cartões de Status e Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cartão de Conexão LAN */}
              <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <span>Acesso na Rede Local (LAN)</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Servidor Ativo</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <code className="text-xs font-mono text-slate-200 flex-1 truncate">{accessUrl}</code>
                  <button
                    onClick={() => copyToClipboard(accessUrl, 'link')}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                {/* PIN Code Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 rounded-xl p-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>PIN de Autenticação Dokke</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Necessário para liberar o Companion Deck e prevenir acessos não autorizados na LAN.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-2xl font-mono font-bold tracking-widest bg-slate-900 px-4 py-1.5 rounded-lg border border-blue-500/50 text-white shadow-inner">
                      {serverState.pin}
                    </div>

                    <button
                      onClick={onGenerateNewPin}
                      title="Gerar novo código PIN"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Opções de Inicialização */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Iniciar com o Windows</p>
                    <p className="text-[11px] text-slate-500">
                      Executar o Dokke minimizado na bandeja ao inicializar o PC.
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleStartWithWindows(!serverState.startWithWindows)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      serverState.startWithWindows ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        serverState.startWithWindows ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* QR Code de Conexão Rápida */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-xs font-semibold text-slate-300">Conectar Smartphone</span>
                <QRCodeSVG value={`${accessUrl}?pin=${serverState.pin}`} size={130} />
                <p className="text-[11px] text-slate-400 max-w-[180px]">
                  Aponte a câmera do seu celular para abrir o Companion Deck automaticamente.
                </p>
              </div>
            </div>

            {/* Informações do Instalador e Windows */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>Empacotamento &amp; Instalador do Dokke para Windows</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-white">Artefato de Instalação NSIS</span>
                  <p className="text-[11px] text-slate-400">
                    O arquivo <code className="text-blue-300">Dokke-Setup.exe</code> instala por usuário sem exigir privilégios de administrador e adiciona o Dokke no Menu Iniciar.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-white">Aviso do SmartScreen</span>
                  <p className="text-[11px] text-slate-400">
                    Por se tratar de instalador independente sem assinatura comercial, caso o Windows SmartScreen apareça, clique em <strong className="text-slate-200">Mais informações</strong> e depois <strong className="text-slate-200">Executar assim mesmo</strong>.
                  </p>
                </div>
              </div>

              {/* Simulação de Teste de Erro de Porta */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ambiente de teste:</span>
                {serverState.status === 'online' ? (
                  <button
                    onClick={onSimulatePortBusy}
                    className="text-xs text-amber-400 hover:text-amber-300 underline"
                  >
                    Simular erro de porta ocupada (EADDRINUSE)
                  </button>
                ) : (
                  <button
                    onClick={onRestoreServer}
                    className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Restaurar porta normal (3000)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA: TECLAS DO COMPANION DECK */}
        {activeTab === 'deck_settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Teclas Configuradas no Companion</h2>
                <p className="text-xs text-slate-400">
                  Estes botões aparecem diretamente na interface táctil do celular ou tablet.
                </p>
              </div>

              <button
                onClick={onResetButtons}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                Restaurar Teclas Padrão
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {dockButtons.map((btn) => (
                <div
                  key={btn.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center text-center space-y-2 relative group hover:border-slate-500 transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${btn.color} flex items-center justify-center text-white shadow-md`}
                  >
                    <DynamicIcon name={btn.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-100 truncate max-w-[120px]">{btn.label}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {btn.actionType === 'focus_app' ? 'Focar App' : btn.actionType === 'open_url' ? 'Link Web' : btn.actionType === 'obs' ? 'OBS' : 'Mídia'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar Aplicativo Customizado */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Adicionar Executável (.exe)</h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Aplicativo</label>
                <input
                  type="text"
                  required
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                  placeholder="Ex: Game Studio, Blender, Spotify..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Caminho do Executável (.exe)</label>
                <input
                  type="text"
                  value={customAppPath}
                  onChange={(e) => setCustomAppPath(e.target.value)}
                  placeholder="C:\Program Files\MeuApp\app.exe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Categoria</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Dev">Desenvolvimento &amp; Ferramentas</option>
                  <option value="Web">Navegação &amp; Web</option>
                  <option value="Audio/Video">Áudio, Vídeo &amp; Streaming</option>
                  <option value="Games">Jogos</option>
                  <option value="Utilities">Utilitários</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                >
                  Salvar Aplicativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
