import React from 'react';
import { Layers, Monitor, Smartphone, LayoutGrid, Radio } from 'lucide-react';

export type ViewMode = 'dual' | 'host' | 'deck';

interface AppHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  serverStatus: 'online' | 'port-busy' | 'adopted' | 'failed';
  lanIp: string;
  onOpenQuickGuide: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  viewMode,
  setViewMode,
  serverStatus,
  lanIp,
  onOpenQuickGuide,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shrink-0 select-none">
      {/* Zona 1: Brand Wordmark (Elemento único sem tags anexadas) */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
          <span className="text-xs font-black text-white tracking-tighter">D</span>
        </div>
        <span className="text-base font-bold tracking-tight text-white font-sans">
          Dokke
        </span>
      </div>

      {/* Zona 2: Links / Seletor de visualização (Single-line controls) */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setViewMode('dual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
            viewMode === 'dual'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Visão Dupla</span>
        </button>

        <button
          onClick={() => setViewMode('host')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
            viewMode === 'host'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Host Windows</span>
        </button>

        <button
          onClick={() => setViewMode('deck')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
            viewMode === 'deck'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Companion Deck</span>
        </button>
      </nav>

      {/* Zona 3: 1 Ação Principal */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenQuickGuide}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          Guia do Dokke
        </button>
      </div>
    </header>
  );
};
