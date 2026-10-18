import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Plus,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Trash2,
  X,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { DockButton, ActionType } from '../types/dokke';
import { DynamicIcon, AVAILABLE_ICONS } from './DynamicIcon';
import { playTactileClick } from '../utils/audio';

interface CompanionDeckProps {
  buttons: DockButton[];
  lanIp: string;
  expectedPin: string;
  activeWindow: string | null;
  onExecuteAction: (btn: DockButton) => void;
  onAddButton: (btn: DockButton) => void;
  onDeleteButton: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const COLOR_PRESETS = [
  { name: 'Azul Elétrico', value: 'from-blue-600 to-indigo-700' },
  { name: 'Ciano Neon', value: 'from-cyan-500 to-blue-600' },
  { name: 'Esmeralda', value: 'from-emerald-600 to-teal-700' },
  { name: 'Âmbar / Laranja', value: 'from-amber-600 to-orange-700' },
  { name: 'Carmesim', value: 'from-red-600 to-rose-700' },
  { name: 'Púrpura', value: 'from-purple-600 to-pink-700' },
  { name: 'Ardósia Escura', value: 'from-slate-700 to-zinc-900' },
];

export const CompanionDeck: React.FC<CompanionDeckProps> = ({
  buttons,
  lanIp,
  expectedPin,
  activeWindow,
  onExecuteAction,
  onAddButton,
  onDeleteButton,
  soundEnabled,
  onToggleSound,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [recentActionText, setRecentActionText] = useState<string | null>(null);
  const [pressedBtnId, setPressedBtnId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulário do novo botão
  const [newLabel, setNewLabel] = useState('');
  const [newSublabel, setNewSublabel] = useState('');
  const [newActionType, setNewActionType] = useState<ActionType>('open_url');
  const [newPayload, setNewPayload] = useState('https://');
  const [newIcon, setNewIcon] = useState('Globe');
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0].value);

  // Relógio do dispositivo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (num: string) => {
    playTactileClick(soundEnabled, 'click');
    setPinError(false);
    if (enteredPin.length < 4) {
      const updated = enteredPin + num;
      setEnteredPin(updated);
      if (updated.length === 4) {
        if (updated === expectedPin) {
          playTactileClick(soundEnabled, 'success');
          setIsAuthenticated(true);
        } else {
          playTactileClick(soundEnabled, 'beep');
          setPinError(true);
          setTimeout(() => setEnteredPin(''), 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    playTactileClick(soundEnabled, 'click');
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  const handleAutoPair = () => {
    playTactileClick(soundEnabled, 'success');
    setEnteredPin(expectedPin);
    setIsAuthenticated(true);
  };

  const handleButtonClick = (btn: DockButton) => {
    playTactileClick(soundEnabled, 'click');
    setPressedBtnId(btn.id);
    setTimeout(() => setPressedBtnId(null), 250);

    setRecentActionText(`Executado: ${btn.label} (${btn.sublabel || btn.actionType})`);
    setTimeout(() => setRecentActionText(null), 3000);

    onExecuteAction(btn);
  };

  const handleCreateButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newBtn: DockButton = {
      id: `btn-${Date.now()}`,
      label: newLabel.trim(),
      sublabel: newSublabel.trim() || undefined,
      actionType: newActionType,
      payload: newPayload.trim(),
      icon: newIcon,
      color: newColor,
    };

    onAddButton(newBtn);
    playTactileClick(soundEnabled, 'success');
    setShowAddModal(false);
    setNewLabel('');
    setNewSublabel('');
    setNewPayload('https://');
  };

  return (
    <div className="relative mx-auto max-w-[390px] w-full bg-neutral-950 border-[6px] border-neutral-800 rounded-[44px] shadow-2xl p-4 flex flex-col min-h-[640px] text-white select-none ring-1 ring-white/10">
      {/* Dynamic Island / Speaker Notch */}
      <div className="w-28 h-4 bg-neutral-900 rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-neutral-950 border border-neutral-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
      </div>

      {/* Barra de Status do Sistema */}
      <div className="flex items-center justify-between px-3 text-[11px] font-mono text-neutral-400 mb-2">
        <span className="font-semibold text-neutral-200">{currentTime || '12:00'}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LAN</span>
          </div>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Desativar som tátil' : 'Ativar som tátil'}
            className="text-neutral-400 hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <Battery className="w-3.5 h-3.5 text-neutral-300" />
        </div>
      </div>

      {/* TELA DE AUTENTICAÇÃO POR PIN */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col justify-between py-4 px-2">
          <div className="text-center space-y-2 mt-4">
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/40 rounded-2xl mx-auto flex items-center justify-center text-blue-400 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">Dokke Companion</h2>
            <p className="text-xs text-neutral-400 max-w-[240px] mx-auto">
              Digite o código PIN exibido no seu computador ({lanIp})
            </p>

            {/* Display do PIN */}
            <div className="flex items-center justify-center gap-3 pt-4">
              {[0, 1, 2, 3].map((idx) => {
                const char = enteredPin[idx];
                return (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold transition-all ${
                      pinError
                        ? 'border-2 border-red-500 bg-red-950/40 text-red-300 animate-shake'
                        : char
                        ? 'border-2 border-blue-500 bg-blue-950/30 text-white'
                        : 'border border-neutral-800 bg-neutral-900/80 text-neutral-600'
                    }`}
                  >
                    {char ? '•' : ''}
                  </div>
                );
              })}
            </div>
            {pinError && (
              <p className="text-[11px] text-red-400 font-medium">PIN incorreto. Tente novamente.</p>
            )}
          </div>

          {/* Teclado Numérico */}
          <div className="space-y-2 max-w-[280px] mx-auto w-full">
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="h-12 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 active:scale-95 text-base font-semibold text-white transition-all shadow-sm border border-neutral-800/60"
                >
                  {digit}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 active:scale-95 text-base font-semibold text-white transition-all shadow-sm border border-neutral-800/60"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 active:scale-95 text-xs text-neutral-400 hover:text-white transition-all flex items-center justify-center border border-neutral-800/40"
              >
                ⌫
              </button>
            </div>

            <button
              onClick={handleAutoPair}
              className="w-full mt-2 py-2 text-xs text-blue-400 hover:text-blue-300 font-medium text-center transition-colors hover:underline"
            >
              Autoparear com este PC (Usar PIN: {expectedPin})
            </button>
          </div>
        </div>
      ) : (
        /* GRADE TÁCTIL PRINCIPAL DO DECK */
        <div className="flex-1 flex flex-col justify-between">
          {/* Header Compacto com Ações do Deck */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-2.5 flex items-center justify-between mb-3 shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-neutral-200 truncate">Dokke Conectado</p>
                <p className="text-[9px] font-mono text-neutral-500 truncate">{lanIp}:3000</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowAddModal(true)}
                title="Criar novo botão personalizado"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Atalho</span>
              </button>

              <button
                onClick={() => {
                  playTactileClick(soundEnabled, 'toggle');
                  setIsAuthenticated(false);
                  setEnteredPin('');
                }}
                title="Bloquear / Desconectar"
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feedback de Ação Disparada */}
          {recentActionText && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-[11px] text-blue-200 font-medium text-center truncate animate-fade-in shadow-md">
              {recentActionText}
            </div>
          )}

          {/* Grade Táctil 3x4 / Estilo Stream Deck */}
          <div className="grid grid-cols-3 gap-2.5 overflow-y-auto max-h-[460px] p-1">
            {buttons.map((btn) => {
              const isPressed = pressedBtnId === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  style={{ touchAction: 'manipulation' }}
                  className={`relative aspect-square rounded-2xl bg-gradient-to-br ${btn.color} p-2 flex flex-col items-center justify-between text-center transition-all duration-100 shadow-md ${
                    isPressed
                      ? 'scale-90 shadow-inner brightness-125'
                      : 'hover:scale-[1.02] hover:brightness-110 active:scale-90'
                  } border border-white/15`}
                >
                  {/* Status Indicator (se estiver rodando ou ativo) */}
                  <div className="w-full flex items-center justify-between text-[9px]">
                    {btn.running || activeWindow === btn.payload ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950 shadow-sm" title="Em execução" />
                    ) : btn.active ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-950 shadow-sm" title="Ativo" />
                    ) : (
                      <span />
                    )}

                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75">
                      {btn.actionType === 'focus_app'
                        ? 'APP'
                        : btn.actionType === 'obs'
                        ? 'OBS'
                        : btn.actionType === 'media'
                        ? 'MÍDIA'
                        : 'WEB'}
                    </span>
                  </div>

                  {/* Ícone da Tecla */}
                  <div className="w-8 h-8 rounded-xl bg-black/25 flex items-center justify-center text-white shadow-inner">
                    <DynamicIcon name={btn.icon} className="w-4 h-4" />
                  </div>

                  {/* Rótulo da Tecla */}
                  <div className="w-full">
                    <p className="text-[11px] font-bold text-white tracking-tight truncate leading-tight">
                      {btn.label}
                    </p>
                    {btn.sublabel && (
                      <p className="text-[9px] text-white/70 truncate leading-none">
                        {btn.sublabel}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Barra inferior decorativa de navegação móvel */}
          <div className="w-32 h-1 bg-neutral-700 rounded-full mx-auto mt-3" />
        </div>
      )}

      {/* MODAL: CRIAR NOVO BOTÃO TÁCTIL PERSONALIZADO */}
      {showAddModal && (
        <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md rounded-[38px] p-5 z-40 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white">Novo Atalho Táctil</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateButton} className="space-y-3 mt-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Rótulo da Tecla</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Twitch, Notion, Mudo..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Subtítulo (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Stream, Docs, Áudio..."
                  value={newSublabel}
                  onChange={(e) => setNewSublabel(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Tipo de Ação</label>
                <select
                  value={newActionType}
                  onChange={(e) => {
                    const val = e.target.value as ActionType;
                    setNewActionType(val);
                    if (val === 'open_url') setNewPayload('https://');
                    else if (val === 'focus_app') setNewPayload('Google Chrome');
                    else if (val === 'media') setNewPayload('play_pause');
                    else if (val === 'obs') setNewPayload('toggle_record');
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="open_url">Abrir Link Web (URL)</option>
                  <option value="focus_app">Focar / Abrir Aplicativo no PC</option>
                  <option value="media">Controle de Mídia / Áudio</option>
                  <option value="obs">Controle de OBS Studio</option>
                  <option value="custom">Ação Personalizada</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  {newActionType === 'open_url'
                    ? 'Endereço Web (URL)'
                    : newActionType === 'focus_app'
                    ? 'Nome do Aplicativo'
                    : 'Comando / Parâmetro'}
                </label>
                <input
                  type="text"
                  required
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Seletor de Cores */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Cor do Botão</label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.name}
                      onClick={() => setNewColor(p.value)}
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.value} shrink-0 border-2 transition-all ${
                        newColor === p.value ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Seletor de Ícones */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Ícone</label>
                <div className="grid grid-cols-6 gap-1.5 max-h-24 overflow-y-auto p-1 bg-neutral-900 rounded-xl border border-neutral-800">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => setNewIcon(iconName)}
                      className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                        newIcon === iconName ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Adicionar ao Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
