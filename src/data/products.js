/**
 * Product Catalog Data & Taxonomy Models
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Products', description: 'Explore our complete wearable line-up' },
  { id: 'band', name: 'Smart Bands', description: 'Ultra-light, ergonomic fitness trackers' },
  { id: 'watch', name: 'Smart Watches', description: 'Feature-rich smart timepieces with premium craft' },
];

export const TIERS = {
  band: ['standard', 'pro'],
  watch: ['standard', 'pro', 'pro_max'],
};

export const TIER_LABELS = {
  standard: 'Standard',
  pro: 'Pro',
  pro_max: 'Pro Max',
};

const COMMON_COLORWAYS = {
  midnightBlack: {
    id: 'midnight-black',
    name: 'Midnight Black',
    hex: '#1E293B',
    chassisHex: '#0F172A',
    strapHex: '#1E293B',
  },
  cosmicPurple: {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    hex: '#7C3AED',
    chassisHex: '#5B21B6',
    strapHex: '#7C3AED',
  },
  glacierCyan: {
    id: 'glacier-cyan',
    name: 'Glacier Cyan',
    hex: '#06B6D4',
    chassisHex: '#0891B2',
    strapHex: '#06B6D4',
  },
  starlightSilver: {
    id: 'starlight-silver',
    name: 'Starlight Silver',
    hex: '#CBD5E1',
    chassisHex: '#94A3B8',
    strapHex: '#E2E8F0',
  },
  roseGold: {
    id: 'rose-gold',
    name: 'Rose Gold',
    hex: '#FB7185',
    chassisHex: '#E11D48',
    strapHex: '#FDA4AF',
  },
  alpineGreen: {
    id: 'alpine-green',
    name: 'Alpine Green',
    hex: '#10B981',
    chassisHex: '#047857',
    strapHex: '#059669',
  },
};

export const PRODUCTS = [
  // --------------------------------------------------------------------------
  // 1. BAND - STANDARD TIER
  // --------------------------------------------------------------------------
  {
    id: 'novaband-flow',
    name: 'NovaBand Flow',
    category: 'band',
    tier: 'standard',
    price: 49.99,
    originalPrice: 59.99,
    tagline: 'Ultra-slim fitness companion for seamless daily tracking',
    description: 'Designed for effortless 24/7 wear, NovaBand Flow combines a featherlight elastomer band with a vivid 1.1" AMOLED display. Features continuous sleep monitoring, all-day stress tracking, and an impressive 14-day battery reserve.',
    rating: 4.7,
    reviewsCount: 284,
    inStock: true,
    isFeatured: false,
    isNew: false,
    defaultWatchFace: 'minimal',
    colors: [
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.glacierCyan,
      COMMON_COLORWAYS.cosmicPurple,
    ],
    specs: {
      display: '1.1" AMOLED 126x294 px (450 nits)',
      batteryLife: 'Up to 14 days',
      waterResistance: '5 ATM (50m Swimproof)',
      weight: '22g (with strap)',
      connectivity: 'Bluetooth 5.2 BLE',
      sensors: [
        'Optical Heart Rate Sensor',
        'SpO2 Pulse Oximeter',
        '3-Axis Accelerometer',
        'Skin Temperature Sensor',
      ],
      casingMaterial: 'Reinforced Polycarbonate Chassis',
    },
    features: [
      '14-Day Battery Endurance',
      'Continuous SpO2 & Sleep Stage Analysis',
      'Subtle Haptic Smart Notifications',
      '50+ Calibrated Exercise Modes',
      'Ultra-Lightweight 22g Profile',
    ],
    preset3d: {
      geometry: 'band',
      caseShape: 'capsule',
      strapStyle: 'silicone',
      bezelFinish: 'matte',
      defaultColorId: 'midnight-black',
    },
  },
  {
    id: 'novaband-active',
    name: 'NovaBand Active',
    category: 'band',
    tier: 'standard',
    price: 59.99,
    originalPrice: 69.99,
    tagline: 'Vibrant sport band built for dynamic workouts and energy',
    description: 'Engineered for high-intensity activity, NovaBand Active features an expanded 1.2" high-brightness AMOLED screen, dynamic real-time heart rate zones, and breathable sport-vented straps.',
    rating: 4.6,
    reviewsCount: 156,
    inStock: true,
    isFeatured: false,
    isNew: true,
    defaultWatchFace: 'health',
    colors: [
      COMMON_COLORWAYS.glacierCyan,
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.alpineGreen,
    ],
    specs: {
      display: '1.2" AMOLED 160x320 px (500 nits)',
      batteryLife: 'Up to 12 days',
      waterResistance: '5 ATM (50m Swimproof)',
      weight: '24g (with strap)',
      connectivity: 'Bluetooth 5.3 BLE',
      sensors: [
        'Photoplethysmography (PPG) Heart Rate',
        'SpO2 Sensor',
        '3-Axis Gyroscope',
        'Accelerometer',
      ],
      casingMaterial: 'Impact-Resistant Thermoplastic',
    },
    features: [
      'Real-Time Heart Rate Zone Alerts',
      'Curved 2.5D Touch Glass',
      'Magnetic Quick Charging',
      'Water Resistance to 50 Meters',
      'Daily Step & Calorie Goal Tracking',
    ],
    preset3d: {
      geometry: 'band',
      caseShape: 'capsule',
      strapStyle: 'silicone',
      bezelFinish: 'matte',
      defaultColorId: 'glacier-cyan',
    },
  },

  // --------------------------------------------------------------------------
  // 2. BAND - PRO TIER
  // --------------------------------------------------------------------------
  {
    id: 'novaband-pro-elite',
    name: 'NovaBand Pro Elite',
    category: 'band',
    tier: 'pro',
    price: 89.99,
    originalPrice: 109.99,
    tagline: 'Curved edge-to-edge AMOLED with dual GPS & advanced biometrics',
    description: 'The pinnacle of smart bands. Boasting a striking 1.47" curved AMOLED display, an aerospace-grade aluminum bezel trim, standalone dual-band GPS, SpO2 tracking, and rapid charge capability.',
    rating: 4.9,
    reviewsCount: 412,
    inStock: true,
    isFeatured: true,
    isNew: true,
    defaultWatchFace: 'neon',
    colors: [
      COMMON_COLORWAYS.cosmicPurple,
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.starlightSilver,
      COMMON_COLORWAYS.glacierCyan,
    ],
    specs: {
      display: '1.47" Curved 2.5D AMOLED 198x368 px (600 nits)',
      batteryLife: 'Up to 10 days typical (5 days continuous GPS)',
      waterResistance: '5 ATM (50m) Swimproof',
      weight: '29g (with strap)',
      connectivity: 'Bluetooth 5.3 BLE, Standalone Dual GPS',
      sensors: [
        'Multi-Path PPG Biotracker 4.0',
        'Pulse Oximeter SpO2',
        'Ambient Light Sensor',
        'Barometric Altimeter',
        'Skin Temperature Sensor',
      ],
      casingMaterial: 'Aerospace 6000-Series Aluminum Trim & Glass Fiber',
    },
    features: [
      'Standalone Dual-Band GPS Route Tracking',
      'Continuous SpO2 & VO2 Max Analytics',
      'Edge-to-Edge Curved Glass Screen',
      'Rapid Charge: 60 Minutes to 100%',
      'Advanced Sleep Recovery Score',
    ],
    preset3d: {
      geometry: 'band',
      caseShape: 'capsule',
      strapStyle: 'silicone',
      bezelFinish: 'brushed',
      defaultColorId: 'cosmic-purple',
    },
  },

  // --------------------------------------------------------------------------
  // 3. SMART WATCH - STANDARD TIER
  // --------------------------------------------------------------------------
  {
    id: 'novawatch-core',
    name: 'NovaWatch Core',
    category: 'watch',
    tier: 'standard',
    price: 149.99,
    originalPrice: 179.99,
    tagline: 'Classic circular AMOLED with Bluetooth calling & 100+ sport modes',
    description: 'Classic circular timepiece design meets modern intelligence. Features a 1.32" high-resolution AMOLED display, aerospace aluminum frame, 100+ sport modes, Bluetooth voice calling, and a 7-day battery.',
    rating: 4.8,
    reviewsCount: 520,
    inStock: true,
    isFeatured: true,
    isNew: false,
    defaultWatchFace: 'minimal',
    colors: [
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.starlightSilver,
      COMMON_COLORWAYS.cosmicPurple,
    ],
    specs: {
      display: '1.32" Circular AMOLED 466x466 px (1000 nits)',
      batteryLife: 'Up to 7 days typical usage',
      waterResistance: 'IP68 & 5 ATM (50m)',
      weight: '38g (without strap)',
      connectivity: 'Bluetooth 5.3 & BLE, Speaker & Mic',
      sensors: [
        'BioTracker PPG Heart Rate',
        'SpO2 Blood Oxygen Sensor',
        '6-Axis Motion Sensor',
        'Geomagnetic Compass',
      ],
      casingMaterial: 'Aerospace-Grade Aluminum Alloy',
    },
    features: [
      'Crystal-Clear Bluetooth Phone Calling',
      'Always-On Display (AOD) with Auto-Brightness',
      '100+ Dedicated Professional Sport Modes',
      'Customizable Watch Faces & Interactive Widgets',
      'Local Music Controller & Media Sync',
    ],
    preset3d: {
      geometry: 'watch',
      caseShape: 'round',
      strapStyle: 'segmented',
      bezelFinish: 'brushed',
      defaultColorId: 'midnight-black',
    },
  },
  {
    id: 'novawatch-air',
    name: 'NovaWatch Air',
    category: 'watch',
    tier: 'standard',
    price: 129.99,
    originalPrice: 149.99,
    tagline: 'Ultra-featherweight smartwatch tailored for all-day comfort',
    description: 'Slim, airy, and discreet on the wrist. NovaWatch Air brings you crisp health statistics, notifications, and media controls without any unnecessary bulk.',
    rating: 4.7,
    reviewsCount: 198,
    inStock: true,
    isFeatured: false,
    isNew: false,
    defaultWatchFace: 'health',
    colors: [
      COMMON_COLORWAYS.starlightSilver,
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.roseGold,
    ],
    specs: {
      display: '1.3" Circular AMOLED 360x360 px (800 nits)',
      batteryLife: 'Up to 8 days',
      waterResistance: '5 ATM (50m)',
      weight: '31g (featherweight body)',
      connectivity: 'Bluetooth 5.2 BLE',
      sensors: [
        '24/7 PPG Optical Heart Sensor',
        'SpO2 Pulse Oximeter',
        '3-Axis Accelerometer',
        'Pedometer & Step Sensor',
      ],
      casingMaterial: 'Polished Composite Resin & Aluminum Bezel',
    },
    features: [
      'Ultra-Light 31g Ergonomic Silhouette',
      'Guided Breathing & Stress Relaxation',
      'Intelligent Hydration & Activity Reminders',
      'Smart App Notifications & Quick Replies',
      'Remote Camera Shutter Controller',
    ],
    preset3d: {
      geometry: 'watch',
      caseShape: 'round',
      strapStyle: 'silicone',
      bezelFinish: 'polished',
      defaultColorId: 'starlight-silver',
    },
  },

  // --------------------------------------------------------------------------
  // 4. SMART WATCH - PRO TIER
  // --------------------------------------------------------------------------
  {
    id: 'novawatch-pro',
    name: 'NovaWatch Pro',
    category: 'watch',
    tier: 'pro',
    price: 269.99,
    originalPrice: 299.99,
    tagline: 'Surgical stainless steel, sapphire glass & medical-grade ECG',
    description: 'Engineered for executives and discerning athletes. Built with a surgical stainless steel chassis, 1.43" sapphire crystal glass, haptic rotating digital crown, ECG cardiac rhythm sensor, and contactless payment simulation.',
    rating: 4.9,
    reviewsCount: 638,
    inStock: true,
    isFeatured: true,
    isNew: true,
    defaultWatchFace: 'chrono',
    colors: [
      COMMON_COLORWAYS.starlightSilver,
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.cosmicPurple,
      COMMON_COLORWAYS.glacierCyan,
    ],
    specs: {
      display: '1.43" Sapphire Glass AMOLED 466x466 px (1200 nits)',
      batteryLife: 'Up to 5 days normal / 12 days battery saver',
      waterResistance: '5 ATM + IP68 Certified',
      weight: '52g (chassis only)',
      connectivity: 'Bluetooth 5.3, Wi-Fi 2.4GHz, NFC, Dual GPS',
      sensors: [
        'Medical-Grade ECG Sensor',
        'Dual-Frequency PPG Sensor',
        'Continuous SpO2',
        'Skin Temperature Array',
        'Barometric Altimeter',
      ],
      casingMaterial: '316L Surgical Stainless Steel Chassis',
    },
    features: [
      'ECG Arrhythmia & Cardiac Rhythm Analysis',
      'Precision Haptic Rotating Digital Crown',
      'Sapphire Crystal Scratch-Proof Glass',
      'Contactless NFC Payment Simulation',
      'HD Studio Speaker & Dual Beamforming Mics',
    ],
    preset3d: {
      geometry: 'watch',
      caseShape: 'round',
      strapStyle: 'segmented',
      bezelFinish: 'polished',
      defaultColorId: 'starlight-silver',
    },
  },

  // --------------------------------------------------------------------------
  // 5. SMART WATCH - PRO MAX TIER
  // --------------------------------------------------------------------------
  {
    id: 'novawatch-pro-max-ultra',
    name: 'NovaWatch Pro Max Ultra',
    category: 'watch',
    tier: 'pro_max',
    price: 429.99,
    originalPrice: 479.99,
    tagline: 'Grade 5 Titanium, 2000 nits sapphire screen & 21-day expedition battery',
    description: 'The supreme adventure instrument. Forged from Grade 5 aerospace titanium with an ultra-bright 1.96" 2000 nits sapphire display, dedicated programmable orange action button, dual-frequency 5-satellite GPS, 100m water resistance, and 21-day expedition endurance.',
    rating: 5.0,
    reviewsCount: 892,
    inStock: true,
    isFeatured: true,
    isNew: true,
    defaultWatchFace: 'neon',
    colors: [
      COMMON_COLORWAYS.midnightBlack,
      COMMON_COLORWAYS.starlightSilver,
      COMMON_COLORWAYS.cosmicPurple,
      COMMON_COLORWAYS.alpineGreen,
    ],
    specs: {
      display: '1.96" High-Luminance Sapphire Glass 502x410 px (2000 nits)',
      batteryLife: 'Up to 21 days expedition / 60h continuous GPS',
      waterResistance: '10 ATM (100m) & EN13319 Scuba Standard',
      weight: '64g (Titanium body)',
      connectivity: 'Dual-Band L1+L5 GPS (5-Satellite System), Bluetooth 5.4, Wi-Fi 5GHz, NFC',
      sensors: [
        'Dual-Channel Biometric Array',
        'Live Depth Gauge & Water Temp',
        'Barometric Altimeter',
        'Digital 3D Compass',
        'Skin Temp & Heart Rate',
        'ECG + Continuous SpO2',
      ],
      casingMaterial: 'Grade 5 Aerospace Titanium with Raised Bezel Lip',
    },
    features: [
      'Grade 5 Aerospace Titanium Architecture',
      'Dedicated Programmable Action Button',
      'Dual-Frequency 5-Satellite Precision GPS',
      '100m Water Resistance with Live Depth Gauge',
      'Night Vision Red Mode & 86dB Siren',
    ],
    preset3d: {
      geometry: 'watch',
      caseShape: 'round',
      strapStyle: 'segmented',
      bezelFinish: 'matte',
      defaultColorId: 'midnight-black',
    },
  },
];

// ----------------------------------------------------------------------------
// Helper Query Functions
// ----------------------------------------------------------------------------

export function getProductById(id) {
  if (!id) return undefined;
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByTier(tier) {
  if (!tier || tier === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.tier === tier);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function filterProducts(category = 'all', tier = 'all', searchQuery = '') {
  let list = PRODUCTS;

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (tier && tier !== 'all') {
    list = list.filter((p) => p.tier === tier);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tier.toLowerCase().includes(q)
    );
  }

  return list;
}
