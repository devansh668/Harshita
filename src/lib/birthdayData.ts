import { BirthdayConfig, GalleryPhoto, MemoryItem, StyleOption } from '@/types';

export const DEFAULT_CONFIG: BirthdayConfig = {
  recipientName: 'Harshita',
  nickname: 'Beautiful',
  birthdayDate: 'November 17',
  heroMessage:
    'Today is dedicated entirely to celebrating the most wonderful, radiant, and inspiring soul. May your day be as dazzling and lovely as your smile!',
  letterGreeting: 'My Dearest Harshita,',
  letterBody: `Happy Birthday! Words often fall short when trying to express how genuinely lucky I feel to have you in my life. You bring a kind of warmth that makes ordinary moments feel special, and your laughter is honestly contagious.

Thank you for being the person who listens without judgment, who shares late-night conversations and silly jokes, and who brings light into every room you step into. Seeing you grow, achieve your dreams, and navigate life with such grace and kindness inspires me every single day.

As you step into another chapter of your life, I wish you endless adventures, peaceful moments of happiness, good health, and dreams fulfilled. Remember that you are deeply cherished, celebrated today and every single day.`,
  letterClosing: 'With all my love and warmest wishes,',
  letterSender: 'Forever Your Friend ❤️',
};

export const TRANSFORMATION_STYLES: StyleOption[] = [
  {
    id: 'manhwa-webtoon',
    name: 'Modern Anime / Manhwa',
    tagline: 'Clean Inked Lines & Cel-Shaded Gloss',
    badge: 'Requested Style ✨',
    description: 'Crisp digital ink contours, poreless cel-shaded skin, stylized dark glossy hair, and vibrant anime comic illustration.',
    iconName: 'Sparkles',
  },
  {
    id: 'cartoon-3d',
    name: '3D Cartoon Style',
    tagline: 'Pixar & Modern Animated Aesthetic',
    badge: 'Popular',
    description: 'Smooth clay finish, studio rim lighting, vivid dimensional shading, and sparkling eye catchlights.',
    iconName: 'Sparkles',
  },
  {
    id: 'anime',
    name: 'Cute Anime Style',
    tagline: 'Vibrant Japanese Studio Anime',
    badge: 'Vibrant',
    description: 'Clean inked contours, soft pastel skin tones, blush highlights, and expressive anime color grading.',
    iconName: 'Heart',
  },
  {
    id: 'disney',
    name: 'Fairytale Disney Aesthetic',
    tagline: 'Magical Storybook Dream',
    badge: 'Dreamy',
    description: 'Golden hour ambient glow, soft dream bloom filter, romantic fairy tale warm tones and star accents.',
    iconName: 'Crown',
  },
  {
    id: 'pencil',
    name: 'Pencil Sketch',
    tagline: 'Hand-Drawn Charcoal & Graphite',
    badge: 'Artistic',
    description: 'Fine graphite hatching, artistic contour shading, authentic paper texture, and textured stroke lines.',
    iconName: 'PenTool',
  },
  {
    id: 'watercolor',
    name: 'Watercolor Painting',
    tagline: 'Soft Pigment & Fluid Canvas',
    badge: 'Romantic',
    description: 'Fluid watercolor bleeds, delicate edge pooling, pastel pigment layers, and wet paper granulation.',
    iconName: 'Palette',
  },
  {
    id: 'aesthetic-soft',
    name: 'Soft Aesthetic Portrait',
    tagline: 'Rose Gold Glow & Dreamy Bloom',
    badge: 'Gentle',
    description: 'Ethereal diffuse lighting, rose-gold undertones, gentle vintage bloom, and velvety skin tone soften.',
    iconName: 'Sun',
  },
  {
    id: 'chibi',
    name: 'Chibi Character Style',
    tagline: 'Adorable Micro Cutie',
    badge: 'Cute',
    description: 'Oversized expressive features, rosy blush circles, playful saturated colors, and adorable charm.',
    iconName: 'Smile',
  },
  {
    id: 'pro-enhance',
    name: 'Pro Photo Enhancement',
    tagline: 'Magazine Studio Polish',
    badge: 'Studio',
    description: 'Dynamic range expansion, natural skin clarity, crisp micro-contrast, vibrant tone curves, and subtle lens vignette.',
    iconName: 'Camera',
  },
];

export const SAMPLE_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    title: 'Her Radiance',
    description: 'Upload her favorite portrait to enhance, transform into anime art, and celebrate.',
    originalUrl: '/images/placeholders/portrait-1.svg',
    date: 'Ready for Upload',
    location: 'Studio Keepsake',
  },
  {
    id: 'p2',
    title: 'Pure Joy',
    description: 'Upload a candid smiling photo that captures her contagious laughter.',
    originalUrl: '/images/placeholders/portrait-2.svg',
    date: 'Ready for Upload',
    location: 'Cherished Moment',
  },
  {
    id: 'p3',
    title: 'Golden Moments',
    description: 'Upload a glowing golden hour portrait or travel photo.',
    originalUrl: '/images/placeholders/portrait-3.svg',
    date: 'Ready for Upload',
    location: 'Sunset Memory',
  },
  {
    id: 'p4',
    title: 'Sweet Adventures',
    description: 'Upload an outdoor adventure or spontaneous cafe memory.',
    originalUrl: '/images/placeholders/portrait-4.svg',
    date: 'Ready for Upload',
    location: 'Weekend Trip',
  },
  {
    id: 'p5',
    title: 'Heartfelt Keepsake',
    description: 'Upload a timeless portrait showing her effortless grace.',
    originalUrl: '/images/placeholders/portrait-5.svg',
    date: 'Ready for Upload',
    location: 'Precious Memory',
  },
  {
    id: 'p6',
    title: 'Forever Celebrating',
    description: 'Upload a birthday party photo or queen celebration moment.',
    originalUrl: '/images/placeholders/portrait-6.svg',
    date: 'Ready for Upload',
    location: 'Celebration Day',
  },
];

export const SAMPLE_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    title: 'The Day We First Clicked',
    date: 'October 14, 2022',
    caption: 'That 3-hour conversation that felt like 5 minutes. We instantly knew this friendship was going to be forever.',
    imageUrl: '/images/placeholders/portrait-1.svg',
    location: 'Central Perk Cafe',
    sticker: 'coffee',
    rotation: -2,
  },
  {
    id: 'm2',
    title: 'Spontaneous Road Trip',
    date: 'April 22, 2023',
    caption: 'Wrong turns, playlist on full blast, screaming our favorite songs with the windows rolled down.',
    imageUrl: '/images/placeholders/portrait-2.svg',
    location: 'Highway Scenic Drive',
    sticker: 'camera',
    rotation: 3,
  },
  {
    id: 'm3',
    title: 'The Flower Market Adventure',
    date: 'June 18, 2023',
    caption: 'You insisted on smelling every single rose and tulip. You ended up walking home with a giant bouquet!',
    imageUrl: '/images/placeholders/portrait-3.svg',
    location: 'Morning Flower Market',
    sticker: 'flower',
    rotation: -3,
  },
  {
    id: 'm4',
    title: 'Midnight Birthday Surprise',
    date: 'November 17, 2023',
    caption: 'Banging on your door at 12:00 AM with cake and silly party hats. The look on your face was priceless!',
    imageUrl: '/images/placeholders/portrait-4.svg',
    location: 'Her Living Room',
    sticker: 'sparkle',
    rotation: 2,
  },
  {
    id: 'm5',
    title: 'Stargazing by the Lake',
    date: 'August 9, 2024',
    caption: 'Sitting on the dock wrapped in blankets, talking about dreams, the universe, and our future.',
    imageUrl: '/images/placeholders/portrait-5.svg',
    location: 'Silver Lake Dock',
    sticker: 'star',
    rotation: -1,
  },
  {
    id: 'm6',
    title: 'Always By Your Side',
    date: 'Today & Always',
    caption: 'Through all the highs and lows, laughing until our stomachs hurt. Forever grateful for you.',
    imageUrl: '/images/placeholders/portrait-6.svg',
    location: 'Everywhere With You',
    sticker: 'heart',
    rotation: 2,
  },
];

export function getStoredConfig(): BirthdayConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem('birthday_surprise_config');
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config: BirthdayConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('birthday_surprise_config', JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save birthday config to localStorage', e);
  }
}
