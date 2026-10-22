import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  CATEGORIES,
  TIERS,
  TIER_LABELS,
  getProductById,
  getProductsByCategory,
  getProductsByTier,
  getFeaturedProducts,
} from '../src/data/products.js';
import {
  WATCH_FACES,
  DEFAULT_WATCH_FACE,
  getWatchFaceById,
} from '../src/data/watchFaces.js';
import {
  WIDGETS,
  simulateNextHeartRate,
  incrementSteps,
  toggleMusicPlayback,
  toggleLowPowerMode,
  getWidgetById,
} from '../src/data/widgets.js';
import {
  formatCurrency,
  formatUSD,
  formatVND,
  formatNumber,
  formatDate,
  formatPercentage,
  formatDuration,
} from '../src/utils/formatters.js';

describe('Product Catalog & Taxonomy', () => {
  it('should export a non-empty array of products', () => {
    expect(Array.isArray(PRODUCTS)).toBe(true);
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(5);
  });

  it('should strictly contain valid categories (band | watch)', () => {
    const validCategories = ['band', 'watch'];
    PRODUCTS.forEach((product) => {
      expect(validCategories).toContain(product.category);
    });
  });

  it('should enforce strict tier taxonomy per category', () => {
    // Band: standard | pro
    // Watch: standard | pro | pro_max
    const bandTiers = ['standard', 'pro'];
    const watchTiers = ['standard', 'pro', 'pro_max'];

    PRODUCTS.forEach((product) => {
      if (product.category === 'band') {
        expect(bandTiers).toContain(product.tier);
        expect(product.tier).not.toBe('pro_max');
      } else if (product.category === 'watch') {
        expect(watchTiers).toContain(product.tier);
      }
    });
  });

  it('should cover all 5 required taxonomy segments', () => {
    const segments = new Set(
      PRODUCTS.map((p) => `${p.category}-${p.tier}`)
    );

    expect(segments.has('band-standard')).toBe(true);
    expect(segments.has('band-pro')).toBe(true);
    expect(segments.has('watch-standard')).toBe(true);
    expect(segments.has('watch-pro')).toBe(true);
    expect(segments.has('watch-pro_max')).toBe(true);
  });

  it('should contain the spec-mandated flagship models verbatim', () => {
    const names = PRODUCTS.map((p) => p.name);

    expect(names).toContain('NovaBand Flow');
    expect(names).toContain('NovaBand Pro Elite');
    expect(names).toContain('NovaWatch Core');
    expect(names).toContain('NovaWatch Pro');
    expect(names).toContain('NovaWatch Pro Max Ultra');

    const flow = PRODUCTS.find((p) => p.name === 'NovaBand Flow');
    expect(flow.category).toBe('band');
    expect(flow.tier).toBe('standard');

    const bandPro = PRODUCTS.find((p) => p.name === 'NovaBand Pro Elite');
    expect(bandPro.category).toBe('band');
    expect(bandPro.tier).toBe('pro');

    const core = PRODUCTS.find((p) => p.name === 'NovaWatch Core');
    expect(core.category).toBe('watch');
    expect(core.tier).toBe('standard');

    const watchPro = PRODUCTS.find((p) => p.name === 'NovaWatch Pro');
    expect(watchPro.category).toBe('watch');
    expect(watchPro.tier).toBe('pro');

    const ultra = PRODUCTS.find((p) => p.name === 'NovaWatch Pro Max Ultra');
    expect(ultra.category).toBe('watch');
    expect(ultra.tier).toBe('pro_max');
  });

  it('should have unique IDs for all products', () => {
    const ids = PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should validate complete schema for every product', () => {
    const validFaces = ['minimal', 'neon', 'chrono', 'health'];
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

    PRODUCTS.forEach((p) => {
      // Basic info
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
      expect(typeof p.name).toBe('string');
      expect(typeof p.tagline).toBe('string');
      expect(typeof p.description).toBe('string');
      expect(typeof p.inStock).toBe('boolean');

      // Pricing & Ratings
      expect(typeof p.price).toBe('number');
      expect(p.price).toBeGreaterThan(0);
      expect(typeof p.originalPrice).toBe('number');
      expect(p.originalPrice).toBeGreaterThanOrEqual(p.price);
      expect(p.rating).toBeGreaterThanOrEqual(1);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.reviewsCount).toBeGreaterThanOrEqual(0);

      // Colors
      expect(Array.isArray(p.colors)).toBe(true);
      expect(p.colors.length).toBeGreaterThanOrEqual(2);
      p.colors.forEach((color) => {
        expect(typeof color.id).toBe('string');
        expect(typeof color.name).toBe('string');
        expect(color.hex).toMatch(hexRegex);
        expect(color.chassisHex).toMatch(hexRegex);
        expect(color.strapHex).toMatch(hexRegex);
      });

      // Specs
      expect(p.specs).toBeDefined();
      expect(typeof p.specs.display).toBe('string');
      expect(typeof p.specs.batteryLife).toBe('string');
      expect(typeof p.specs.waterResistance).toBe('string');
      expect(typeof p.specs.weight).toBe('string');
      expect(typeof p.specs.connectivity).toBe('string');
      expect(Array.isArray(p.specs.sensors)).toBe(true);
      expect(p.specs.sensors.length).toBeGreaterThan(0);
      expect(typeof p.specs.casingMaterial).toBe('string');

      // Features
      expect(Array.isArray(p.features)).toBe(true);
      expect(p.features.length).toBeGreaterThanOrEqual(3);

      // Default watch face
      expect(validFaces).toContain(p.defaultWatchFace);

      // 3D configuration preset
      expect(p.preset3d).toBeDefined();
      expect(typeof p.preset3d.geometry).toBe('string');
      expect(['band', 'watch']).toContain(p.preset3d.geometry);
      expect(typeof p.preset3d.caseShape).toBe('string');
    });
  });

  it('should export helper taxonomy constants and functions', () => {
    expect(CATEGORIES).toBeDefined();
    expect(CATEGORIES.some((c) => c.id === 'band')).toBe(true);
    expect(CATEGORIES.some((c) => c.id === 'watch')).toBe(true);

    expect(TIERS).toBeDefined();
    expect(TIERS.band).toEqual(['standard', 'pro']);
    expect(TIERS.watch).toEqual(['standard', 'pro', 'pro_max']);

    expect(TIER_LABELS.standard).toBe('Standard');
    expect(TIER_LABELS.pro).toBe('Pro');
    expect(TIER_LABELS.pro_max).toBe('Pro Max');

    // Query helpers
    const flow = getProductById('novaband-flow');
    expect(flow).toBeDefined();
    expect(flow.name).toBe('NovaBand Flow');

    expect(getProductById('invalid-id')).toBeUndefined();

    const bands = getProductsByCategory('band');
    expect(bands.length).toBeGreaterThanOrEqual(2);
    expect(bands.every((p) => p.category === 'band')).toBe(true);

    const watches = getProductsByCategory('watch');
    expect(watches.length).toBeGreaterThanOrEqual(3);
    expect(watches.every((p) => p.category === 'watch')).toBe(true);

    const proMaxProducts = getProductsByTier('pro_max');
    expect(proMaxProducts.length).toBeGreaterThanOrEqual(1);
    expect(proMaxProducts.every((p) => p.tier === 'pro_max')).toBe(true);

    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThanOrEqual(1);
    expect(featured.every((p) => p.isFeatured)).toBe(true);
  });
});

describe('Watch Faces Metadata', () => {
  it('should export exactly 4 watch faces: Minimal, Neon, Chrono, Health', () => {
    expect(Array.isArray(WATCH_FACES)).toBe(true);
    expect(WATCH_FACES.length).toBe(4);

    const faceIds = WATCH_FACES.map((f) => f.id);
    expect(faceIds).toContain('minimal');
    expect(faceIds).toContain('neon');
    expect(faceIds).toContain('chrono');
    expect(faceIds).toContain('health');
  });

  it('should validate watch face metadata schema', () => {
    WATCH_FACES.forEach((face) => {
      expect(typeof face.id).toBe('string');
      expect(typeof face.name).toBe('string');
      expect(typeof face.tagline).toBe('string');
      expect(typeof face.description).toBe('string');
      expect(typeof face.style).toBe('string');
      expect(typeof face.previewColor).toBe('string');
      expect(face.previewColor.startsWith('#')).toBe(true);
      expect(face.theme).toBeDefined();
      expect(typeof face.theme.background).toBe('string');
      expect(typeof face.theme.accent).toBe('string');
      expect(Array.isArray(face.features)).toBe(true);
    });
  });

  it('should export DEFAULT_WATCH_FACE as minimal', () => {
    expect(DEFAULT_WATCH_FACE).toBe('minimal');
  });

  it('should retrieve watch face by id', () => {
    const neon = getWatchFaceById('neon');
    expect(neon).toBeDefined();
    expect(neon.name).toBe('Neon');

    const chrono = getWatchFaceById('chrono');
    expect(chrono).toBeDefined();
    expect(chrono.name).toBe('Chrono');

    const invalid = getWatchFaceById('nonexistent');
    expect(invalid).toBeUndefined();
  });
});

describe('Widgets Metadata & Simulation Defaults', () => {
  it('should export 5 simulated widgets: heartRate, steps, weather, music, battery', () => {
    expect(Array.isArray(WIDGETS)).toBe(true);
    expect(WIDGETS.length).toBe(5);

    const widgetIds = WIDGETS.map((w) => w.id);
    expect(widgetIds).toContain('heartRate');
    expect(widgetIds).toContain('steps');
    expect(widgetIds).toContain('weather');
    expect(widgetIds).toContain('music');
    expect(widgetIds).toContain('battery');
  });

  it('should validate widget schema and initial mock states', () => {
    WIDGETS.forEach((widget) => {
      expect(typeof widget.id).toBe('string');
      expect(typeof widget.name).toBe('string');
      expect(typeof widget.unit).toBe('string');
      expect(widget.initialState).toBeDefined();
    });

    const hr = getWidgetById('heartRate');
    expect(hr.initialState.bpm).toBeGreaterThanOrEqual(68);
    expect(hr.initialState.bpm).toBeLessThanOrEqual(115);
    expect(Array.isArray(hr.initialState.history)).toBe(true);

    const steps = getWidgetById('steps');
    expect(steps.initialState.current).toBe(7420);
    expect(steps.initialState.goal).toBe(10000);
    expect(steps.initialState.distanceKm).toBeGreaterThan(0);

    const weather = getWidgetById('weather');
    expect(weather.initialState.tempC).toBe(24);
    expect(weather.initialState.tempF).toBe(75);
    expect(weather.initialState.condition).toBeDefined();

    const music = getWidgetById('music');
    expect(music.initialState.track).toBe('Echoes of Tomorrow');
    expect(music.initialState.artist).toBe('Nova Beats');
    expect(typeof music.initialState.isPlaying).toBe('boolean');

    const battery = getWidgetById('battery');
    expect(battery.initialState.level).toBe(88);
    expect(typeof battery.initialState.lowPowerMode).toBe('boolean');
  });

  it('should provide interactive simulation helpers', () => {
    // Heart rate fluctuation within 68 to 115
    for (let i = 0; i < 20; i++) {
      const nextBpm = simulateNextHeartRate(80);
      expect(nextBpm).toBeGreaterThanOrEqual(68);
      expect(nextBpm).toBeLessThanOrEqual(115);
    }

    // Step counter incrementation
    const incremented = incrementSteps(7420, 150);
    expect(incremented.current).toBe(7570);
    expect(incremented.progress).toBeCloseTo(0.757, 2);

    // Music play/pause toggle
    const initialMusic = { isPlaying: false, track: 'Echoes of Tomorrow' };
    const toggledMusic = toggleMusicPlayback(initialMusic);
    expect(toggledMusic.isPlaying).toBe(true);
    expect(toggleMusicPlayback(toggledMusic).isPlaying).toBe(false);

    // Battery low power mode toggle
    const initialBattery = { level: 88, lowPowerMode: false };
    const toggledBattery = toggleLowPowerMode(initialBattery);
    expect(toggledBattery.lowPowerMode).toBe(true);
    expect(toggleLowPowerMode(toggledBattery).lowPowerMode).toBe(false);
  });
});

describe('Formatting Utilities', () => {
  it('should format USD currency correctly', () => {
    expect(formatUSD(99)).toBe('$99.00');
    expect(formatUSD(249.5)).toBe('$249.50');
    expect(formatUSD(0)).toBe('$0.00');
    expect(formatUSD(null)).toBe('$0.00');
    expect(formatUSD(undefined)).toBe('$0.00');
  });

  it('should format VND currency correctly', () => {
    const formatted = formatVND(2500000);
    // Standard Vietnamese format uses dot separators and ₫ symbol
    expect(formatted).toMatch(/2[.,]500[.,]000/);
    expect(formatted).toContain('₫');
    expect(formatVND(0)).toContain('0');
  });

  it('should support general formatCurrency helper', () => {
    expect(formatCurrency(199, 'USD')).toBe('$199.00');
    expect(formatCurrency(199, 'VND')).toContain('₫');
  });

  it('should format numbers with standard thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(0)).toBe('0');
  });

  it('should format percentages correctly', () => {
    expect(formatPercentage(0.742)).toBe('74%');
    expect(formatPercentage(0.742, 1)).toBe('74.2%');
    expect(formatPercentage(1)).toBe('100%');
    expect(formatPercentage(0)).toBe('0%');
  });

  it('should format playback durations in mm:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(210)).toBe('3:30');
  });

  it('should format dates safely', () => {
    const testDate = new Date('2026-10-22T08:00:00Z');
    const formatted = formatDate(testDate);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
    expect(formatDate(null)).toBe('');
  });
});
