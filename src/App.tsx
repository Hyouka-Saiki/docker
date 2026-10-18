/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppHeader, ViewMode } from './components/AppHeader';
import { HostDesktop } from './components/HostDesktop';
import { CompanionDeck } from './components/CompanionDeck';
import { QuickGuideModal } from './components/QuickGuideModal';
import { InstalledApp, DockButton, HostServerState } from './types/dokke';
import {
  INITIAL_INSTALLED_APPS,
  INITIAL_PINNED_APP_NAMES,
  INITIAL_DOCK_BUTTONS,
} from './utils/defaultData';
import { playTactileClick } from './utils/audio';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
  const [activeHostTab, setActiveHostTab] = useState<'apps' | 'about' | 'deck_settings'>('apps');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quickGuideOpen, setQuickGuideOpen] = useState(false);

  // Estado do Servidor Dokke
  const [serverState, setServerState] = useState<HostServerState>({
    status: 'online',
    port: 3000,
    lanIp: '192.168.1.104',
    pin: '7429',
    startWithWindows: true,
    clientCount: 1,
    activeWindow: 'Visual Studio Code',
    serverUptimeSeconds: 1420,
  });

  // Catálogo de Apps Instalados
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(() => {
    const saved = localStorage.getItem('dokke_installed_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_INSTALLED_APPS;
  });

  // Nomes dos Apps Fixados no Dokke
  const [pinnedAppNames, setPinnedAppNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('dokke_pinned_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PINNED_APP_NAMES;
  });

  // Botões do Companion Deck (Customizáveis)
  const [dockButtons, setDockButtons] = useState<DockButton[]>(() => {
    const saved = localStorage.getItem('dokke_dock_buttons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_DOCK_BUTTONS;
  });

  // Notificação de Ação
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem('dokke_installed_apps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('dokke_pinned_apps', JSON.stringify(pinnedAppNames));
  }, [pinnedAppNames]);

  useEffect(() => {
    localStorage.setItem('dokke_dock_buttons', JSON.stringify(dockButtons));
  }, [dockButtons]);

  // Ações do Host
  const handlePinApp = (appName: string) => {
    if (!pinnedAppNames.includes(appName)) {
      setPinnedAppNames([...pinnedAppNames, appName]);
      showToast(`Aplicativo "${appName}" fixado na dock!`);
    }
  };

  const handleUnpinApp = (appName: string) => {
    setPinnedAppNames(pinnedAppNames.filter((name) => name !== appName));
    showToast(`Aplicativo "${appName}" removido da dock.`);
  };

  const handleAddCustomApp = (app: InstalledApp) => {
    setInstalledApps((prev) => [app, ...prev]);
    if (!pinnedAppNames.includes(app.name)) {
      setPinnedAppNames((prev) => [app.name, ...prev]);
    }
    showToast(`Executável "${app.name}" registrado.`);
  };

  const handleFocusApp = (appName: string) => {
    setServerState((prev) => ({
      ...prev,
      activeWindow: appName,
    }));

    // Marca como em execução se não estava
    setInstalledApps((prev) =>
      prev.map((app) =>
        app.name.toLowerCase() === appName.toLowerCase()
          ? { ...app, running: true, pid: app.pid || Math.floor(10000 + Math.random() * 20000) }
          : app
      )
    );

    // Atualiza botões correspondentes no dock
    setDockButtons((prev) =>
      prev.map((btn) =>
        btn.payload.toLowerCase() === appName.toLowerCase()
          ? { ...btn, running: true }
          : btn
      )
    );

    showToast(`Janela trazida para frente: ${appName}`);
  };

  const handleToggleAppRunning = (appName: string) => {
    setInstalledApps((prev) =>
      prev.map((app) => {
        if (app.name.toLowerCase() === appName.toLowerCase()) {
          const nextState = !app.running;
          return {
            ...app,
            running: nextState,
            pid: nextState ? Math.floor(10000 + Math.random() * 20000) : undefined,
          };
        }
        return app;
      })
    );
  };

  const handleGenerateNewPin = () => {
    const newPin = String(Math.floor(1000 + Math.random() * 9000));
    setServerState((prev) => ({ ...prev, pin: newPin }));
    playTactileClick(soundEnabled, 'toggle');
    showToast(`Novo PIN de autenticação gerado: ${newPin}`);
  };

  const handleToggleStartWithWindows = (val: boolean) => {
    setServerState((prev) => ({ ...prev, startWithWindows: val }));
    showToast(val ? 'Dokke configurado para iniciar com o Windows.' : 'Inicialização automática desativada.');
  };

  const handleResetButtons = () => {
    setDockButtons(INITIAL_DOCK_BUTTONS);
    showToast('Teclas padrão do Companion Deck restauradas.');
  };

  // Ações disparadas pelo Companion Deck
  const handleExecuteDeckAction = (btn: DockButton) => {
    if (btn.actionType === 'focus_app') {
      handleFocusApp(btn.payload);
    } else if (btn.actionType === 'open_url') {
      showToast(`Abrindo link no navegador: ${btn.payload}`);
      if (typeof window !== 'undefined') {
        window.open(btn.payload, '_blank', 'noopener,noreferrer');
      }
    } else if (btn.actionType === 'obs') {
      if (btn.payload === 'toggle_record') {
        const nextRunning = !btn.running;
        setDockButtons((prev) =>
          prev.map((b) => (b.id === btn.id ? { ...b, running: nextRunning } : b))
        );
        showToast(nextRunning ? 'Gravação do OBS iniciada!' : 'Gravação do OBS interrompida.');
      } else if (btn.payload.startsWith('scene:')) {
        const sceneName = btn.payload.replace('scene:', '');
        showToast(`Cena do OBS alternada para: ${sceneName}`);
      }
    } else if (btn.actionType === 'media') {
      if (btn.payload === 'play_pause') {
        showToast('Comando de mídia: Reproduzir / Pausar enviado ao sistema.');
      } else if (btn.payload === 'toggle_mute') {
        showToast('Microfone silenciado / ativado no host.');
      }
    } else {
      showToast(`Comando personalizado executado: ${btn.label}`);
    }
  };

  const handleAddButton = (newBtn: DockButton) => {
    setDockButtons((prev) => [...prev, newBtn]);
    showToast(`Atalho "${newBtn.label}" adicionado ao Companion Deck!`);
  };

  const handleDeleteButton = (id: string) => {
    setDockButtons((prev) => prev.filter((b) => b.id !== id));
    showToast('Atalho removido do deck.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header */}
      <AppHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        serverStatus={serverState.status}
        lanIp={serverState.lanIp}
        onOpenQuickGuide={() => setQuickGuideOpen(true)}
      />

      {/* Notificação Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-bounce-short">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Conteúdo de Acordo com o Modo de Visualização */}
      <main className="flex-1 p-4 md:p-6 flex flex-col">
        {viewMode === 'dual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start max-w-7xl mx-auto w-full">
            {/* Lado Esquerdo: Host Desktop Windows (Col 7) */}
            <div className="lg:col-span-7 h-[680px]">
              <HostDesktop
                serverState={serverState}
                installedApps={installedApps}
                pinnedAppNames={pinnedAppNames}
                dockButtons={dockButtons}
                onPinApp={handlePinApp}
                onUnpinApp={handleUnpinApp}
                onAddCustomApp={handleAddCustomApp}
                onToggleAppRunning={handleToggleAppRunning}
                onFocusApp={handleFocusApp}
                onGenerateNewPin={handleGenerateNewPin}
                onToggleStartWithWindows={handleToggleStartWithWindows}
                onResetButtons={handleResetButtons}
                onSimulatePortBusy={() =>
                  setServerState((prev) => ({ ...prev, status: 'port-busy' }))
                }
                onRestoreServer={() =>
                  setServerState((prev) => ({ ...prev, status: 'online' }))
                }
                activeTab={activeHostTab}
                setActiveTab={setActiveHostTab}
              />
            </div>

            {/* Lado Direito: Companion Touch Deck (Col 5) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="mb-2 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Companion Deck (Smartphone / Tablet)
                </span>
                <p className="text-[11px] text-slate-500">
                  Experimente tocar nas teclas para focar janelas ou disparar links no PC
                </p>
              </div>

              <CompanionDeck
                buttons={dockButtons}
                lanIp={serverState.lanIp}
                expectedPin={serverState.pin}
                activeWindow={serverState.activeWindow}
                onExecuteAction={handleExecuteDeckAction}
                onAddButton={handleAddButton}
                onDeleteButton={handleDeleteButton}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            </div>
          </div>
        )}

        {viewMode === 'host' && (
          <div className="max-w-5xl mx-auto w-full flex-1 h-[720px]">
            <HostDesktop
              serverState={serverState}
              installedApps={installedApps}
              pinnedAppNames={pinnedAppNames}
              dockButtons={dockButtons}
              onPinApp={handlePinApp}
              onUnpinApp={handleUnpinApp}
              onAddCustomApp={handleAddCustomApp}
              onToggleAppRunning={handleToggleAppRunning}
              onFocusApp={handleFocusApp}
              onGenerateNewPin={handleGenerateNewPin}
              onToggleStartWithWindows={handleToggleStartWithWindows}
              onResetButtons={handleResetButtons}
              onSimulatePortBusy={() =>
                setServerState((prev) => ({ ...prev, status: 'port-busy' }))
              }
              onRestoreServer={() =>
                setServerState((prev) => ({ ...prev, status: 'online' }))
              }
              activeTab={activeHostTab}
              setActiveTab={setActiveHostTab}
            />
          </div>
        )}

        {viewMode === 'deck' && (
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            <CompanionDeck
              buttons={dockButtons}
              lanIp={serverState.lanIp}
              expectedPin={serverState.pin}
              activeWindow={serverState.activeWindow}
              onExecuteAction={handleExecuteDeckAction}
              onAddButton={handleAddButton}
              onDeleteButton={handleDeleteButton}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
          </div>
        )}
      </main>

      {/* Modal Guia Rápido & Arquitetura */}
      <QuickGuideModal
        isOpen={quickGuideOpen}
        onClose={() => setQuickGuideOpen(false)}
        lanIp={serverState.lanIp}
        pin={serverState.pin}
      />
    </div>
  );
}
