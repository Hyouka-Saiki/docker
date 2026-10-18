import React, { useState } from 'react';
import {
  X,
  Monitor,
  Smartphone,
  Download,
  QrCode,
  ShieldAlert,
  CheckCircle,
  Copy,
  Check,
  Apple,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from '../utils/qr';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lanIp: string;
  pin: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  lanIp,
  pin,
}) => {
  const [activeDevice, setActiveDevice] = useState<'pc' | 'phone'>('pc');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const accessUrl = `http://${lanIp}:3000`;

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Como Baixar e Instalar o Dokke</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instale o Host no computador e use o celular como Stream Deck táctil sem fio.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Seletor PC vs Celular */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveDevice('pc')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeDevice === 'pc'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>No Computador (Windows / Mac)</span>
          </button>

          <button
            onClick={() => setActiveDevice('phone')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeDevice === 'phone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>No Celular (Android / iPhone)</span>
          </button>
        </div>

        {/* CONTEÚDO: NO COMPUTADOR */}
        {activeDevice === 'pc' && (
          <div className="space-y-4 text-xs">
            {/* Opção 1: Instalador Oficial do Windows */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">1</span>
                  Instalador para Windows (NSIS)
                </span>
                <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-800/40 px-2 py-0.5 rounded-full">
                  Dokke-Setup.exe
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                O pacote <code className="text-blue-300 font-mono">Dokke-Setup.exe</code> é o instalador automático. Ele instala na pasta do seu usuário sem exigir permissões de administrador e cria o atalho no Menu Iniciar.
              </p>

              {/* Dica do SmartScreen */}
              <div className="bg-amber-950/30 border border-amber-600/30 rounded-lg p-3 text-[11px] text-amber-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Aviso do Windows SmartScreen:</strong> Como o Dokke é um software independente sem certificado de assinatura comercial paga, caso o aviso azul do Windows apareça, basta clicar em <strong className="text-white underline">Mais informações</strong> e depois em <strong className="text-white underline">Executar assim mesmo</strong>.
                </div>
              </div>
            </div>

            {/* Opção 2: Executar via Node.js / Código Fonte */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xs">2</span>
                Execução Rápida via Node.js (Windows &amp; Mac)
              </span>

              <p className="text-slate-300 text-[11px]">
                Se você já possui o Node.js (v20+) instalado no PC, pode iniciar o Dokke com 2 comandos simples:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-[11px] text-emerald-300">
                <code>git clone https://github.com/pietrojordan/dokke.git &amp;&amp; cd dokke &amp;&amp; npm start</code>
                <button
                  onClick={() => copyCommand('git clone https://github.com/pietrojordan/dokke.git && cd dokke && npm start')}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copiar comando"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Ao rodar, o servidor escutará na porta <strong className="text-slate-200">3000</strong> e gerará o PIN de pareamento no terminal ou na janela.
              </p>
            </div>
          </div>
        )}

        {/* CONTEÚDO: NO CELULAR */}
        {activeDevice === 'phone' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                  No Celular NÃO precisa baixar app da loja!
                </span>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  PWA Touch Deck
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                O Dokke funciona diretamente pelo navegador como um <strong>Progressive Web App (PWA)</strong> de resposta instantânea na mesma rede Wi-Fi.
              </p>

              {/* Passos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                  <p className="font-semibold text-white">No Android (Google Chrome):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Conecte o celular no mesmo Wi-Fi do PC.</li>
                    <li>Abra o Chrome e acesse <code className="text-blue-300">{accessUrl}</code> (ou aponte a câmera pro QR Code).</li>
                    <li>Digite o PIN de pareamento: <strong className="text-white">{pin}</strong>.</li>
                    <li>Toque nos 3 pontinhos <code className="text-slate-200">⋮</code> no canto superior.</li>
                    <li>Toque em <strong className="text-slate-200">&quot;Instalar aplicativo&quot;</strong> ou &quot;Adicionar à tela inicial&quot;.</li>
                  </ol>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                  <p className="font-semibold text-white">No iPhone (Apple Safari):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Conecte o iPhone no mesmo Wi-Fi do PC.</li>
                    <li>Abra a câmera do iPhone e escaneie o QR Code abaixo.</li>
                    <li>No Safari, toque no botão de <strong className="text-slate-200">Compartilhar</strong> (quadrado com seta).</li>
                    <li>Role para baixo e toque em <strong className="text-slate-200">&quot;Adicionar à Tela de Início&quot;</strong>.</li>
                    <li>Pronto! Ele abre em tela cheia como um app nativo.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* QR Code de Escaneamento Rápido */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="shrink-0">
                <QRCodeSVG value={`${accessUrl}?pin=${pin}`} size={110} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white text-xs">Escaneie agora com o seu Celular:</p>
                <p className="text-[11px] text-slate-400">
                  Ao apontar a câmera do celular para este código, o Safari ou Chrome abrirá diretamente o Companion Deck com o PIN <code className="text-blue-300 font-bold">{pin}</code> já pré-preenchido!
                </p>
                <div className="pt-1">
                  <span className="text-[10px] text-emerald-400 font-medium">
                    ✓ Sem necessidade de internet externa — comunicação 100% via Wi-Fi local.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
