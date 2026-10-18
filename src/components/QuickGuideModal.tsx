import React from 'react';
import { X, ShieldCheck, Terminal, Smartphone, Monitor, Download, ExternalLink, CheckCircle } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lanIp: string;
  pin: string;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose, lanIp, pin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <h2 className="text-base font-bold text-white">Guia de Uso &amp; Arquitetura Dokke</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passo a Passo */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Como funciona a conexão sem fio na LAN
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold text-white">Host no Windows</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                O Dokke sobe o servidor Node na porta 3000 e monitora processos em execução e atalhos configurados.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold text-white">Conexão do Celular</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Abra <code className="text-blue-300">http://{lanIp}:3000</code> no navegador do celular ou escaneie o QR Code na aba Sobre.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold text-white">PIN &amp; Controle</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Insira o código PIN de 4 dígitos ({pin}) e toque nas teclas táteis para controlar aplicativos instantaneamente!
              </p>
            </div>
          </div>
        </div>

        {/* Recursos Principais */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Destaques da Implementação Windows</span>
          </h4>
          <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">PowerShell UTF-8:</strong> Integração resiliente com suporte completo a acentuação e nomes compostos (ex: Bloco de Notas).</li>
            <li><strong className="text-slate-200">Foco de Janelas:</strong> Utiliza chamadas Win32 nativas via PowerShell para restaurar e focar janelas minimizadas.</li>
            <li><strong className="text-slate-200">Ícones e Monogramas:</strong> Extração elegante de ícones e geração de monogramas com gradiente SVG de alto contraste.</li>
            <li><strong className="text-slate-200">Sem nuvem externa:</strong> Todo tráfego ocorre estritamente dentro da sua rede local (LAN).</li>
          </ul>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            Entendi, voltar ao app
          </button>
        </div>
      </div>
    </div>
  );
};
