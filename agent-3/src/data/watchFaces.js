/**
 * Watch Face Presets & Metadata
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

export const DEFAULT_WATCH_FACE = 'minimal';

export const WATCH_FACES = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Pure typographic elegance',
    description: 'Clean typographic clock with sleek analog hour and minute hands, subtle date numeral, and a distraction-free high-contrast aesthetic.',
    style: 'analog',
    previewColor: '#7C3AED',
    theme: {
      background: '#0F172A',
      accent: '#7C3AED',
      text: '#FFFFFF',
      dial: '#334155',
      hands: '#FFFFFF',
      secondHand: '#A78BFA',
    },
    features: [
      'Analog Hour & Minute Hands',
      'Subtle Date Display Aperture',
      'High-Contrast Geometric Indices',
      'Ultra-Low Power Ambient Mode',
    ],
  },
  {
    id: 'neon',
    name: 'Neon',
    tagline: 'Cyberpunk glow & pulse second ring',
    description: 'Vibrant digital readout illuminated by electric cyan and deep purple glows, complete with a dynamic animated pulse second ring.',
    style: 'digital',
    previewColor: '#06B6D4',
    theme: {
      background: '#050814',
      accent: '#06B6D4',
      secondaryAccent: '#A855F7',
      glow: 'rgba(6, 182, 212, 0.45)',
      text: '#00F0FF',
      subText: '#C084FC',
    },
    features: [
      'Digital 24h Numeric Clock Readout',
      'Neon Cyan & Purple Ambient Glow',
      'Animated Orbit Pulse Ring',
      'Live Step & Battery Bars',
    ],
  },
  {
    id: 'chrono',
    name: 'Chrono',
    tagline: 'Classic luxury triple sub-dial precision',
    description: 'Timeless luxury chronograph dial featuring three sub-dials (small seconds, 30-minute stop timer, and 24h clock), a tachymeter scale ring, and metallic indices.',
    style: 'chronograph',
    previewColor: '#E2E8F0',
    theme: {
      background: '#111827',
      accent: '#E2E8F0',
      subDial: '#1F2937',
      hands: '#CBD5E1',
      markers: '#F8FAFC',
      accentHand: '#EF4444',
    },
    features: [
      'Triple Sub-Dial Mechanical Layout',
      'Outer Tachymeter Speed Scale',
      'Embossed Metallic Hour Indices',
      'Precision Split Chronograph Action',
    ],
  },
  {
    id: 'health',
    name: 'Health',
    tagline: 'Concentric activity rings & live biometrics',
    description: 'Activity-focused fitness face with tri-color concentric rings (Move, Exercise, Stand), prominent live heart-rate metric, and real-time calorie burn count.',
    style: 'fitness',
    previewColor: '#10B981',
    theme: {
      background: '#090D16',
      accent: '#10B981',
      moveRing: '#FA114F',
      exerciseRing: '#92E82A',
      standRing: '#00D8F6',
      text: '#FFFFFF',
      bpmText: '#FF3B30',
    },
    features: [
      'Tri-Color Concentric Activity Rings',
      'Prominent Live BPM Metric',
      'Active Calorie Burn Counter',
      'Step Goal Completion Percentage',
    ],
  },
];

export function getWatchFaceById(id) {
  if (!id) return undefined;
  return WATCH_FACES.find((face) => face.id === id);
}

export function getAllWatchFaces() {
  return WATCH_FACES;
}
