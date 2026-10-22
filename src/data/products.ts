/**
 * Mock Product Catalog and Taxonomy Data
 * Covers 5 hardware tiers across 2 categories (Band, Smart Watch).
 */

import { Product, ProductCategory, ProductTier, WatchFaceDefinition, WatchFaceId } from '../types';

export const WATCH_FACES: WatchFaceDefinition[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean Analog & Typographic',
    description: 'Ultra-clean minimalist layout with crisp serif date indicators, refined second markers, and subtle battery pill.',
    primaryColor: '#F8FAFC',
    accentColor: '#7C3AED',
  },
  {
    id: 'neon',
    name: 'Neon',
    tagline: 'Cyberpunk Glowing Rings',
    description: 'Vibrant dual-gradient typography, glowing digital readout, and concentric step/calorie activity arcs.',
    primaryColor: '#06B6D4',
    accentColor: '#7C3AED',
  },
  {
    id: 'chrono',
    name: 'Chrono',
    tagline: 'Precision Racing Sub-dials',
    description: 'Classic chronograph dial with three active sub-dials, tachymeter ring, and brushed slate industrial backdrop.',
    primaryColor: '#E2E8F0',
    accentColor: '#F59E0B',
  },
  {
    id: 'health',
    name: 'Health',
    tagline: 'Live Telemetry Dashboard',
    description: 'Real-time telemetry showing live animated ECG rhythm wave, instant heart rate counter, and step goal progression.',
    primaryColor: '#EF4444',
    accentColor: '#10B981',
  },
];

export const DEFAULT_WATCH_FACE: WatchFaceId = 'minimal';

export const PRODUCTS: Product[] = [
  {
    id: 'pulseband-2',
    name: 'PulseBand 2',
    tagline: 'Sleek everyday fitness companion',
    category: 'band',
    tier: 'standard',
    price: 49,
    originalPrice: 59,
    badge: 'Sale',
    rating: 4.6,
    reviewsCount: 328,
    description: 'Sleek everyday fitness tracker with 14-day standby, vivid 1.1" OLED display, lightweight silicone band, and continuous daily activity tracking.',
    specs: {
      display: '1.1" Crisp OLED (126 x 294)',
      batteryLife: 'Up to 14 days',
      waterResistance: '5 ATM (50m)',
      connectivity: 'Bluetooth 5.2 BLE',
      sensors: ['Optical Heart Rate Sensor', '3-Axis Accelerometer', 'SpO2 Blood Oxygen Sensor'],
      weight: '22g (with strap)',
      casingMaterial: 'Polycarbonate with Aluminum Bezel',
    },
    chassisColors: [
      { id: 'obsidian-black', name: 'Obsidian Black', hex: '#1E293B' },
      { id: 'frost-silver', name: 'Frost Silver', hex: '#E2E8F0' },
      { id: 'lavender-mist', name: 'Lavender Mist', hex: '#C4B5FD' },
    ],
    strapColors: [
      { id: 'obsidian-black', name: 'Obsidian Black', hex: '#0F172A' },
      { id: 'frost-white', name: 'Frost White', hex: '#F8FAFC' },
      { id: 'lavender-mist', name: 'Lavender Mist', hex: '#DDD6FE' },
    ],
    defaultChassisColor: '#1E293B',
    defaultStrapColor: '#0F172A',
    defaultFace: 'minimal',
    featured: false,
    modelType: 'band_standard',
  },
  {
    id: 'pulseband-pro',
    name: 'PulseBand Pro',
    tagline: 'Curved AMOLED with standalone GPS',
    category: 'band',
    tier: 'pro',
    price: 89,
    originalPrice: 109,
    badge: 'Best Value',
    rating: 4.8,
    reviewsCount: 512,
    description: 'Curved 1.47" AMOLED display with aircraft-grade aluminum bezel, standalone GPS, continuous SpO2/ECG monitoring, and fast magnetic charging.',
    specs: {
      display: '1.47" Curved AMOLED (194 x 368)',
      batteryLife: 'Up to 10 days (Fast Charging)',
      waterResistance: '5 ATM (50m)',
      connectivity: 'Bluetooth 5.3 BLE, Standalone GPS / GLONASS',
      sensors: ['Optical Heart Rate', 'ECG Sensor', 'SpO2 Sensor', '6-Axis IMU', 'Barometric Altimeter'],
      weight: '28g (with strap)',
      casingMaterial: 'Aircraft-grade Aluminum Bezel',
    },
    chassisColors: [
      { id: 'midnight', name: 'Midnight', hex: '#0F172A' },
      { id: 'space-gray', name: 'Space Gray', hex: '#334155' },
      { id: 'electric-violet', name: 'Electric Violet', hex: '#6D28D9' },
    ],
    strapColors: [
      { id: 'midnight', name: 'Midnight', hex: '#0F172A' },
      { id: 'alpine-teal', name: 'Alpine Teal', hex: '#0D9488' },
      { id: 'electric-violet', name: 'Electric Violet', hex: '#7C3AED' },
    ],
    defaultChassisColor: '#0F172A',
    defaultStrapColor: '#0D9488',
    defaultFace: 'health',
    featured: true,
    modelType: 'band_pro',
  },
  {
    id: 'horizon-watch-se',
    name: 'Horizon Watch SE',
    tagline: 'Timeless style & everyday smarts',
    category: 'watch',
    tier: 'standard',
    price: 179,
    originalPrice: 199,
    badge: 'Popular',
    rating: 4.7,
    reviewsCount: 840,
    description: 'Minimalist everyday smartwatch featuring a vibrant 1.4" AMOLED 60Hz display, lightweight aluminum frame, Bluetooth calling, and 50+ workout modes.',
    specs: {
      display: '1.4" AMOLED (454 x 454, 60Hz, 1000 nits)',
      batteryLife: 'Up to 7 days',
      waterResistance: '5 ATM (50m)',
      connectivity: 'Bluetooth 5.3, Wi-Fi 2.4GHz, NFC',
      sensors: ['BioTracker 3.0 Optical HR', 'SpO2 Sensor', 'Barometer', 'Ambient Light Sensor', 'Geomagnetic Sensor'],
      weight: '38g (without strap)',
      casingMaterial: 'Anodized Aluminum Frame',
    },
    chassisColors: [
      { id: 'cloud-silver', name: 'Cloud Silver', hex: '#E2E8F0' },
      { id: 'space-grey', name: 'Space Grey', hex: '#334155' },
      { id: 'lavender-cyan', name: 'Lavender Cyan', hex: '#C4B5FD' },
    ],
    strapColors: [
      { id: 'cloud-silver', name: 'Cloud Silver', hex: '#E2E8F0' },
      { id: 'space-grey', name: 'Space Grey', hex: '#1E293B' },
      { id: 'lavender-cyan', name: 'Lavender Cyan', hex: '#818CF8' },
    ],
    defaultChassisColor: '#334155',
    defaultStrapColor: '#1E293B',
    defaultFace: 'minimal',
    featured: false,
    modelType: 'watch_standard',
  },
  {
    id: 'horizon-watch-pro',
    name: 'Horizon Watch Pro',
    tagline: 'Aerospace titanium with precision digital crown',
    category: 'watch',
    tier: 'pro',
    price: 299,
    originalPrice: 349,
    badge: 'Pro Pick',
    rating: 4.9,
    reviewsCount: 1205,
    description: 'Brushed aerospace titanium case with sapphire crystal glass, tactile rotating digital crown, dual-mic noise cancelling speaker, and multi-sport telemetry.',
    specs: {
      display: '1.43" Ultra-Bright AMOLED (466 x 466, Sapphire Crystal)',
      batteryLife: 'Up to 10 days',
      waterResistance: '5 ATM + IP68 (50m)',
      connectivity: 'Bluetooth 5.3, Dual-band Wi-Fi, Multi-GNSS GPS, NFC',
      sensors: ['ECG & PPG Sensor', 'Continuous SpO2', 'Skin Temperature Sensor', 'Compass', 'Barometric Altimeter'],
      weight: '46g (without strap)',
      casingMaterial: 'Aerospace Titanium & Sapphire Crystal',
    },
    chassisColors: [
      { id: 'titanium-silver', name: 'Titanium Silver', hex: '#CBD5E1' },
      { id: 'deep-indigo', name: 'Deep Indigo', hex: '#1E1B4B' },
      { id: 'matte-black', name: 'Matte Black', hex: '#18181B' },
    ],
    strapColors: [
      { id: 'titanium-silver', name: 'Titanium Silver', hex: '#CBD5E1' },
      { id: 'deep-indigo', name: 'Deep Indigo', hex: '#312E81' },
      { id: 'matte-black', name: 'Matte Black', hex: '#18181B' },
    ],
    defaultChassisColor: '#CBD5E1',
    defaultStrapColor: '#312E81',
    defaultFace: 'chrono',
    featured: true,
    modelType: 'watch_pro',
  },
  {
    id: 'horizon-watch-pro-max',
    name: 'Horizon Watch Pro Max',
    tagline: 'Expedition rugged armor with 100m dive resistance',
    category: 'watch',
    tier: 'pro_max',
    price: 449,
    originalPrice: 499,
    badge: 'Flagship',
    rating: 5.0,
    reviewsCount: 642,
    description: 'Rugged expedition-ready 49mm titanium bumper chassis, dual-frequency high-precision GNSS, sapphire lens with 100m water resistance, emergency 86dB siren, and ultra-extended 14-day dual-engine battery.',
    specs: {
      display: '1.99" Always-On Sapphire AMOLED (502 x 410, 2000 nits peak)',
      batteryLife: 'Up to 14 days (Dual-Engine Mode), 60h in GPS Mode',
      waterResistance: '10 ATM / 100m (EN13319 Dive Certified)',
      connectivity: 'Dual-Frequency L1/L5 GNSS, Bluetooth 5.3 LE, Dual-Band Wi-Fi, Offline Maps',
      sensors: ['Precision ECG Sensor', 'Continuous SpO2', 'Depth Gauge & Water Temp', 'Skin Temp Sensor', 'Dual-mic Noise Cancelling'],
      weight: '61g (without strap)',
      casingMaterial: '49mm Grade 5 Titanium Bumper & Sapphire Lens',
    },
    chassisColors: [
      { id: 'titanium-amber', name: 'Titanium Amber', hex: '#D97706' },
      { id: 'natural-titanium', name: 'Natural Titanium', hex: '#94A3B8' },
      { id: 'stealth-black', name: 'Stealth Black', hex: '#0F172A' },
    ],
    strapColors: [
      { id: 'titanium-amber', name: 'Titanium Amber', hex: '#D97706' },
      { id: 'arctic-white', name: 'Arctic White', hex: '#F8FAFC' },
      { id: 'cyber-violet', name: 'Cyber Violet', hex: '#7C3AED' },
    ],
    defaultChassisColor: '#94A3B8',
    defaultStrapColor: '#D97706',
    defaultFace: 'neon',
    featured: true,
    modelType: 'watch_pro_max',
  },
];

export const products = PRODUCTS;

export const DEFAULT_PRODUCT: Product = PRODUCTS[3]; // Horizon Watch Pro as hero spotlight

/**
 * Retrieves a single product by its unique string identifier.
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Filters the product catalog by category ('band', 'watch', or 'all').
 */
export function getProductsByCategory(category: ProductCategory | 'all'): Product[] {
  if (category === 'all') {
    return [...PRODUCTS];
  }
  return PRODUCTS.filter((p) => p.category === category);
}

/**
 * Filters the product catalog by hardware tier ('standard', 'pro', 'pro_max').
 */
export function getProductsByTier(tier: ProductTier): Product[] {
  return PRODUCTS.filter((p) => p.tier === tier);
}

/**
 * Returns all featured flagship products.
 */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
