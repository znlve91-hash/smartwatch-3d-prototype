import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  PRODUCTS,
  products,
  DEFAULT_PRODUCT,
  DEFAULT_WATCH_FACE,
  getProductById,
  getProductsByCategory,
  getProductsByTier,
  getFeaturedProducts,
  WATCH_FACES,
} from '../src/data/products';
import { Product, ProductCategory, ProductTier, WatchFaceId } from '../src/types';
import {
  formatCurrency,
  formatNumber,
  formatTierName,
  formatCategoryName,
  formatDate,
  formatRating,
  formatPercentage,
} from '../src/utils/formatters';
import {
  safeStorage,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  STORAGE_KEYS,
} from '../src/utils/storage';

describe('Product Taxonomy & Catalog Integrity', () => {
  it('should export PRODUCTS and products alias with 5 distinct devices', () => {
    expect(PRODUCTS).toBeDefined();
    expect(Array.isArray(PRODUCTS)).toBe(true);
    expect(PRODUCTS.length).toBe(5);
    expect(products).toBe(PRODUCTS);

    const ids = PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(5);
  });

  it('should cover all 5 required hardware tiers across the 2 categories', () => {
    const bands = PRODUCTS.filter((p) => p.category === 'band');
    const watches = PRODUCTS.filter((p) => p.category === 'watch');

    expect(bands.length).toBe(2);
    expect(watches.length).toBe(3);

    const bandTiers = bands.map((b) => b.tier).sort();
    expect(bandTiers).toEqual(['pro', 'standard']);

    const watchTiers = watches.map((w) => w.tier).sort();
    expect(watchTiers).toEqual(['pro', 'pro_max', 'standard']);
  });

  it('should include the specific 5 models from the specification with accurate attributes', () => {
    const bandStandard = PRODUCTS.find(
      (p) => p.category === 'band' && p.tier === 'standard'
    );
    const bandPro = PRODUCTS.find((p) => p.category === 'band' && p.tier === 'pro');
    const watchStandard = PRODUCTS.find(
      (p) => p.category === 'watch' && p.tier === 'standard'
    );
    const watchPro = PRODUCTS.find(
      (p) => p.category === 'watch' && p.tier === 'pro'
    );
    const watchProMax = PRODUCTS.find(
      (p) => p.category === 'watch' && p.tier === 'pro_max'
    );

    expect(bandStandard).toBeDefined();
    expect(bandStandard?.name).toBe('PulseBand 2');
    expect(bandStandard?.modelType).toBe('band_standard');
    expect(bandStandard?.price).toBe(49);
    expect(bandStandard?.originalPrice).toBe(59);

    expect(bandPro).toBeDefined();
    expect(bandPro?.name).toBe('PulseBand Pro');
    expect(bandPro?.modelType).toBe('band_pro');
    expect(bandPro?.price).toBe(89);
    expect(bandPro?.originalPrice).toBe(109);

    expect(watchStandard).toBeDefined();
    expect(watchStandard?.name).toBe('Horizon Watch SE');
    expect(watchStandard?.modelType).toBe('watch_standard');
    expect(watchStandard?.price).toBe(179);
    expect(watchStandard?.originalPrice).toBe(199);

    expect(watchPro).toBeDefined();
    expect(watchPro?.name).toBe('Horizon Watch Pro');
    expect(watchPro?.modelType).toBe('watch_pro');
    expect(watchPro?.price).toBe(299);
    expect(watchPro?.originalPrice).toBe(349);

    expect(watchProMax).toBeDefined();
    expect(watchProMax?.name).toBe('Horizon Watch Pro Max');
    expect(watchProMax?.modelType).toBe('watch_pro_max');
    expect(watchProMax?.price).toBe(449);
    expect(watchProMax?.originalPrice).toBe(499);
  });

  it('should ensure each product has complete, valid technical specifications', () => {
    for (const product of PRODUCTS) {
      expect(product.id).toMatch(/^[a-z0-9-]+$/);
      expect(product.name).toBeTruthy();
      expect(product.tagline).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.rating).toBeGreaterThanOrEqual(1);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.reviewsCount).toBeGreaterThanOrEqual(0);

      // Specs verification
      const { specs } = product;
      expect(specs).toBeDefined();
      expect(specs.display).toBeTruthy();
      expect(specs.batteryLife).toBeTruthy();
      expect(specs.waterResistance).toBeTruthy();
      expect(specs.connectivity).toBeTruthy();
      expect(Array.isArray(specs.sensors)).toBe(true);
      expect(specs.sensors.length).toBeGreaterThanOrEqual(3);
      expect(specs.weight).toBeTruthy();
      expect(specs.casingMaterial).toBeTruthy();
    }
  });

  it('should ensure valid color swatches and defaults for all products', () => {
    const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    for (const product of PRODUCTS) {
      expect(product.chassisColors.length).toBeGreaterThanOrEqual(3);
      expect(product.strapColors.length).toBeGreaterThanOrEqual(3);

      for (const color of [...product.chassisColors, ...product.strapColors]) {
        expect(color.id).toBeTruthy();
        expect(color.name).toBeTruthy();
        expect(color.hex).toMatch(hexRegex);
      }

      // Default colors should be valid hex codes present in swatches
      const chassisHexes = product.chassisColors.map((c) => c.hex.toLowerCase());
      const strapHexes = product.strapColors.map((c) => c.hex.toLowerCase());

      expect(chassisHexes).toContain(product.defaultChassisColor.toLowerCase());
      expect(strapHexes).toContain(product.defaultStrapColor.toLowerCase());

      // Default watch face
      const validFaces: WatchFaceId[] = ['minimal', 'neon', 'chrono', 'health'];
      expect(validFaces).toContain(product.defaultFace);
    }
  });

  it('should provide the 4 standard watch face definitions and default face constant', () => {
    expect(WATCH_FACES).toBeDefined();
    expect(WATCH_FACES.length).toBe(4);
    const faceIds = WATCH_FACES.map((f) => f.id);
    expect(faceIds).toContain('minimal');
    expect(faceIds).toContain('neon');
    expect(faceIds).toContain('chrono');
    expect(faceIds).toContain('health');
    expect(DEFAULT_WATCH_FACE).toBe('minimal');

    for (const face of WATCH_FACES) {
      expect(face.name).toBeTruthy();
      expect(face.tagline).toBeTruthy();
      expect(face.description).toBeTruthy();
      expect(face.primaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(face.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('should expose a valid DEFAULT_PRODUCT', () => {
    expect(DEFAULT_PRODUCT).toBeDefined();
    expect(PRODUCTS).toContain(DEFAULT_PRODUCT);
  });
});

describe('Product Catalog Query Helpers', () => {
  it('should retrieve a product by ID correctly', () => {
    const p = getProductById('pulseband-2');
    expect(p).toBeDefined();
    expect(p?.name).toBe('PulseBand 2');

    const nonExistent = getProductById('non-existent-device');
    expect(nonExistent).toBeUndefined();
  });

  it('should filter products by category', () => {
    const all = getProductsByCategory('all');
    expect(all.length).toBe(5);

    const bands = getProductsByCategory('band');
    expect(bands.length).toBe(2);
    expect(bands.every((p) => p.category === 'band')).toBe(true);

    const watches = getProductsByCategory('watch');
    expect(watches.length).toBe(3);
    expect(watches.every((p) => p.category === 'watch')).toBe(true);
  });

  it('should filter products by tier', () => {
    const standardProducts = getProductsByTier('standard');
    expect(standardProducts.length).toBe(2); // PulseBand 2 and Horizon Watch SE

    const proProducts = getProductsByTier('pro');
    expect(proProducts.length).toBe(2); // PulseBand Pro and Horizon Watch Pro

    const proMaxProducts = getProductsByTier('pro_max');
    expect(proMaxProducts.length).toBe(1); // Horizon Watch Pro Max
  });

  it('should filter featured products', () => {
    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});

describe('Utility: Currency & Text Formatters', () => {
  it('should format currency correctly in USD', () => {
    expect(formatCurrency(49)).toMatch(/\$49/);
    expect(formatCurrency(299.99)).toMatch(/\$299\.99/);
    expect(formatCurrency(0)).toMatch(/\$0/);
    expect(formatCurrency(1250)).toMatch(/\$1,250/);
  });

  it('should support custom formatting options in formatCurrency', () => {
    const formatted = formatCurrency(49, { minimumFractionDigits: 2 });
    expect(formatted).toBe('$49.00');
  });

  it('should format numbers with thousands separators', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(10000)).toBe('10,000');
    expect(formatNumber(7420)).toBe('7,420');
  });

  it('should format tier names cleanly for display', () => {
    expect(formatTierName('standard')).toBe('Standard');
    expect(formatTierName('pro')).toBe('Pro');
    expect(formatTierName('pro_max')).toBe('Pro Max');
    expect(formatTierName('')).toBe('');
  });

  it('should format category names friendly for display', () => {
    expect(formatCategoryName('band')).toBe('Fitness Band');
    expect(formatCategoryName('watch')).toBe('Smart Watch');
    expect(formatCategoryName('all')).toBe('All Devices');
    expect(formatCategoryName('custom')).toBe('Custom');
  });

  it('should format dates nicely', () => {
    const sampleDate = '2026-10-22T10:00:00.000Z';
    const formatted = formatDate(sampleDate);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('should format ratings and percentages', () => {
    expect(formatRating(4.85)).toBe('4.9');
    expect(formatRating(5)).toBe('5.0');
    expect(formatPercentage(88.4)).toBe('88%');
    expect(formatPercentage(99.6)).toBe('100%');
  });
});

describe('Utility: Safe Local Storage', () => {
  beforeEach(() => {
    clearStorage();
    safeStorage.clear();
  });

  it('should export standard storage constants', () => {
    expect(STORAGE_KEYS.CART).toBe('antigravity_smartwatch_cart_v1');
  });

  it('should set and get items cleanly with helper and safeStorage object', () => {
    const testObj = { id: 'test-1', count: 42, active: true };
    const success = safeStorage.setItem('test_key', testObj);
    expect(success).toBe(true);

    const retrieved = safeStorage.getItem('test_key', null);
    expect(retrieved).toEqual(testObj);

    // Also via direct exported functions
    setStorageItem('direct_key', ['item1', 'item2']);
    const list = getStorageItem<string[]>('direct_key', []);
    expect(list).toEqual(['item1', 'item2']);
  });

  it('should return default value when key does not exist', () => {
    const fallback = { fallback: true };
    const result = safeStorage.getItem('non_existent_key', fallback);
    expect(result).toEqual(fallback);
  });

  it('should remove items correctly', () => {
    safeStorage.setItem('remove_me', 'value');
    expect(safeStorage.getItem('remove_me', null)).toBe('value');

    const removed = removeStorageItem('remove_me');
    expect(removed).toBe(true);
    expect(safeStorage.getItem('remove_me', 'default')).toBe('default');
  });

  it('should clear all stored items', () => {
    safeStorage.setItem('k1', 'v1');
    safeStorage.setItem('k2', 'v2');
    safeStorage.clear();

    expect(safeStorage.getItem('k1', null)).toBeNull();
    expect(safeStorage.getItem('k2', null)).toBeNull();
  });

  it('should handle invalid JSON gracefully by returning fallback', () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('corrupted_key', '{not valid json');
      const result = safeStorage.getItem('corrupted_key', 'fallback_value');
      expect(result).toBe('fallback_value');
    }
  });

  it('should not throw if storage fails', () => {
    expect(() => {
      safeStorage.setItem('key', { val: 'test' });
    }).not.toThrow();
  });
});
