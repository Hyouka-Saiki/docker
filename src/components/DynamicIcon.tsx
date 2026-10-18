import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name] || Icons.SquareTerminal;
  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = [
  'Code',
  'Compass',
  'Music',
  'MessageSquare',
  'Play',
  'Pause',
  'Mic',
  'MicOff',
  'Volume2',
  'VolumeX',
  'Video',
  'Radio',
  'Camera',
  'PlaySquare',
  'GitBranch',
  'Bot',
  'Terminal',
  'Folder',
  'Globe',
  'Monitor',
  'Tv',
  'Layers',
  'Sliders',
  'Power',
  'Gamepad2',
  'Cpu',
  'Sparkles',
  'ExternalLink',
  'Bookmark',
  'Settings',
];
