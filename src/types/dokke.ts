export type ActionType = 'open_url' | 'focus_app' | 'media' | 'obs' | 'system' | 'custom';

export interface DockButton {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  color: string;
  actionType: ActionType;
  payload: string;
  running?: boolean;
  active?: boolean;
}

export interface InstalledApp {
  id: string;
  name: string;
  path: string;
  category: 'Dev' | 'Web' | 'Audio/Video' | 'Games' | 'Utilities' | 'Custom';
  icon?: string;
  colors: [string, string];
  initials: string;
  running: boolean;
  pid?: number;
}

export interface HostServerState {
  status: 'online' | 'port-busy' | 'adopted' | 'failed';
  port: number;
  lanIp: string;
  pin: string;
  startWithWindows: boolean;
  clientCount: number;
  activeWindow: string | null;
  serverUptimeSeconds: number;
}

export interface OBSState {
  isStreaming: boolean;
  isRecording: boolean;
  activeScene: string;
  micMuted: boolean;
  desktopMuted: boolean;
  scenes: string[];
}
