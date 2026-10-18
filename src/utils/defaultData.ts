import { InstalledApp, DockButton } from '../types/dokke';

/**
 * Normaliza strings removendo diacríticos/acentos e convertendo para minúsculas
 * (Conforme especificado na Task 1 e Task 5 do Dokke)
 */
export function normalizeText(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Verifica se o nome casa com a query de busca (sem caixa e sem acento)
 */
export function matchesQuery(name: string, query: string): boolean {
  if (!query) return true;
  return normalizeText(name).includes(normalizeText(query));
}

/**
 * Retorna os apps disponíveis para fixação (excluindo os já fixados e ordenando pt-BR)
 */
export function availableToPin(
  installed: InstalledApp[],
  pinnedNames: string[],
  query: string
): InstalledApp[] {
  const pinnedSet = new Set(pinnedNames.map((n) => normalizeText(n)));
  return installed
    .filter((app) => !pinnedSet.has(normalizeText(app.name)))
    .filter((app) => matchesQuery(app.name, query))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
}

export const INITIAL_INSTALLED_APPS: InstalledApp[] = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    category: 'Web',
    colors: ['#4285F4', '#34A853'],
    initials: 'GC',
    running: true,
    pid: 14208,
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    path: 'C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    category: 'Dev',
    colors: ['#007ACC', '#1F8AD2'],
    initials: 'VS',
    running: true,
    pid: 28540,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe',
    category: 'Audio/Video',
    colors: ['#1DB954', '#191414'],
    initials: 'SP',
    running: true,
    pid: 19820,
  },
  {
    id: 'discord',
    name: 'Discord',
    path: 'C:\\Users\\User\\AppData\\Local\\Discord\\app-1.0.9015\\Discord.exe',
    category: 'Web',
    colors: ['#5865F2', '#404EED'],
    initials: 'DC',
    running: true,
    pid: 21304,
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    path: 'C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe',
    category: 'Audio/Video',
    colors: ['#302E31', '#1E1E24'],
    initials: 'OB',
    running: false,
  },
  {
    id: 'terminal',
    name: 'Terminal do Windows (PowerShell)',
    path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    category: 'Utilities',
    colors: ['#012456', '#5390D9'],
    initials: 'PS',
    running: true,
    pid: 8840,
  },
  {
    id: 'steam',
    name: 'Steam',
    path: 'C:\\Program Files (x86)\\Steam\\steam.exe',
    category: 'Games',
    colors: ['#171A21', '#1B2838'],
    initials: 'ST',
    running: false,
  },
  {
    id: 'notepad',
    name: 'Bloco de Notas',
    path: 'C:\\Windows\\System32\\notepad.exe',
    category: 'Utilities',
    colors: ['#4A5568', '#718096'],
    initials: 'BN',
    running: false,
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    path: 'C:\\Program Files\\Adobe\\Adobe Photoshop 2026\\Photoshop.exe',
    category: 'Audio/Video',
    colors: ['#31A8FF', '#001E36'],
    initials: 'PS',
    running: false,
  },
  {
    id: 'figma',
    name: 'Figma Desktop',
    path: 'C:\\Users\\User\\AppData\\Local\\Figma\\Figma.exe',
    category: 'Dev',
    colors: ['#F24E1E', '#A259FF'],
    initials: 'FG',
    running: false,
  },
  {
    id: 'calc',
    name: 'Calculadora',
    path: 'shell:AppsFolder\\Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
    category: 'Utilities',
    colors: ['#0078D7', '#107C41'],
    initials: 'CA',
    running: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    path: 'C:\\Users\\User\\AppData\\Local\\Programs\\Notion\\Notion.exe',
    category: 'Web',
    colors: ['#2F3437', '#000000'],
    initials: 'NO',
    running: true,
    pid: 17624,
  },
];

export const INITIAL_PINNED_APP_NAMES: string[] = [
  'Google Chrome',
  'Visual Studio Code',
  'Spotify',
  'Discord',
  'OBS Studio',
  'Terminal do Windows (PowerShell)',
];

export const INITIAL_DOCK_BUTTONS: DockButton[] = [
  {
    id: 'btn-chrome',
    label: 'Chrome',
    sublabel: 'Browser',
    icon: 'Compass',
    color: 'from-blue-600 to-indigo-600',
    actionType: 'focus_app',
    payload: 'Google Chrome',
    running: true,
  },
  {
    id: 'btn-vscode',
    label: 'VS Code',
    sublabel: 'Editor',
    icon: 'Code',
    color: 'from-sky-600 to-blue-700',
    actionType: 'focus_app',
    payload: 'Visual Studio Code',
    running: true,
  },
  {
    id: 'btn-spotify',
    label: 'Spotify',
    sublabel: 'Música',
    icon: 'Music',
    color: 'from-emerald-600 to-teal-700',
    actionType: 'focus_app',
    payload: 'Spotify',
    running: true,
  },
  {
    id: 'btn-discord',
    label: 'Discord',
    sublabel: 'Chat & Voz',
    icon: 'MessageSquare',
    color: 'from-indigo-600 to-purple-700',
    actionType: 'focus_app',
    payload: 'Discord',
    running: true,
  },
  {
    id: 'btn-playpause',
    label: 'Play / Pause',
    sublabel: 'Mídia',
    icon: 'Play',
    color: 'from-amber-600 to-orange-700',
    actionType: 'media',
    payload: 'play_pause',
  },
  {
    id: 'btn-mute',
    label: 'Mudo Microfone',
    sublabel: 'Áudio',
    icon: 'MicOff',
    color: 'from-rose-600 to-red-700',
    actionType: 'media',
    payload: 'toggle_mute',
  },
  {
    id: 'btn-obs-live',
    label: 'OBS Ao Vivo',
    sublabel: 'Cena Principal',
    icon: 'Video',
    color: 'from-violet-600 to-fuchsia-700',
    actionType: 'obs',
    payload: 'scene:Ao Vivo',
    active: true,
  },
  {
    id: 'btn-obs-rec',
    label: 'Gravar Vídeo',
    sublabel: 'OBS Studio',
    icon: 'Radio',
    color: 'from-red-600 to-rose-700',
    actionType: 'obs',
    payload: 'toggle_record',
    running: false,
  },
  {
    id: 'btn-youtube',
    label: 'YouTube',
    sublabel: 'Vídeos',
    icon: 'PlaySquare',
    color: 'from-red-500 to-red-700',
    actionType: 'open_url',
    payload: 'https://youtube.com',
  },
  {
    id: 'btn-github',
    label: 'GitHub',
    sublabel: 'Repositórios',
    icon: 'GitBranch',
    color: 'from-slate-700 to-zinc-900',
    actionType: 'open_url',
    payload: 'https://github.com',
  },
  {
    id: 'btn-chatgpt',
    label: 'ChatGPT',
    sublabel: 'Assistente AI',
    icon: 'Bot',
    color: 'from-teal-600 to-emerald-700',
    actionType: 'open_url',
    payload: 'https://chatgpt.com',
  },
  {
    id: 'btn-terminal',
    label: 'Terminal',
    sublabel: 'PowerShell',
    icon: 'Terminal',
    color: 'from-blue-700 to-slate-900',
    actionType: 'focus_app',
    payload: 'Terminal do Windows (PowerShell)',
    running: true,
  },
];
