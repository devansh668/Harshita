export type TransformationStyle =
  | 'manhwa-webtoon'
  | 'cartoon-3d'
  | 'anime'
  | 'disney'
  | 'pencil'
  | 'watercolor'
  | 'aesthetic-soft'
  | 'chibi'
  | 'pro-enhance';

export interface StyleOption {
  id: TransformationStyle;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  iconName: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  originalUrl: string;
  enhancedUrl?: string;
  convertedUrl?: string;
  date?: string;
  location?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  location?: string;
  sticker: 'heart' | 'sparkle' | 'camera' | 'coffee' | 'flower' | 'star';
  rotation: number;
}

export interface BirthdayConfig {
  recipientName: string;
  nickname: string;
  birthdayDate: string;
  heroMessage: string;
  letterGreeting: string;
  letterBody: string;
  letterClosing: string;
  letterSender: string;
}
