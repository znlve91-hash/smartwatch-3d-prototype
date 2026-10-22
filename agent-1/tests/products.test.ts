import { describe, it, expect } from 'vitest';
import { products, getProductById, getProductsByCategory, getProductsByTier } from '../src/data/products';
import type { Product, ProductCategory, ProductTier, WatchFaceId } from '../src/types';

describe('Products Catalog & Taxonomy Tests', () => {
  it('contains exactly 5 wearable devices', () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products).toHaveLength(5);
  });

  describe('Taxonomy Completeness', () => {
    it('contains the expected product IDs', () => {
      const ids = products.map((p) => p.id);
      expect(ids).toContain('band-aura-std');
      expect(ids).toContain('band-aura-pro');
      expect(ids).toContain('watch-horizon-std');
      expect(ids).toContain('watch-horizon-pro');
      expect(ids).toContain('watch-horizon-max');
    });

    it('has exactly 2 smart bands and 3 smart watches', () => {
      const bands = products.filter((p) => p.category === 'band');
      const watches = products.filter((p) => p.category === 'watch');

      expect(bands).toHaveLength(2);
      expect(watches).toHaveLength(3);
    });

    it('smart bands cover standard and pro tiers', () => {
      const bands = products.filter((p) => p.category === 'band');
      const tiers = bands.map((b) => b.tier);
      expect(tiers).toEqual(expect.arrayContaining(['standard', 'pro']));
      expect(tiers).not.toContain('pro_max');
    });

    it('smart watches cover standard, pro, and pro_max tiers', () => {
      const watches = products.filter((p) => p.category === 'watch');
      const tiers = watches.map((w) => w.tier);
      expect(tiers).toEqual(expect.arrayContaining(['standard', 'pro', 'pro_max']));
    });
  });

  describe('Pricing Logic', () => {
    it('has strictly positive prices for all products', () => {
      for (const product of products) {
        expect(product.price).toBeGreaterThan(0);
        if (product.originalPrice !== undefined) {
          expect(product.originalPrice).toBeGreaterThanOrEqual(product.price);
        }
      }
    });

    it('enforces tier pricing progression within bands', () => {
      const stdBand = products.find((p) => p.id === 'band-aura-std')!;
      const proBand = products.find((p) => p.id === 'band-aura-pro')!;

      expect(stdBand.price).toBe(49);
      expect(proBand.price).toBe(89);
      expect(stdBand.price).toBeLessThan(proBand.price);
    });

    it('enforces tier pricing progression within watches', () => {
      const stdWatch = products.find((p) => p.id === 'watch-horizon-std')!;
      const proWatch = products.find((p) => p.id === 'watch-horizon-pro')!;
      const maxWatch = products.find((p) => p.id === 'watch-horizon-max')!;

      expect(stdWatch.price).toBe(149);
      expect(proWatch.price).toBe(249);
      expect(maxWatch.price).toBe(399);

      expect(stdWatch.price).toBeLessThan(proWatch.price);
      expect(proWatch.price).toBeLessThan(maxWatch.price);
    });
  });

  describe('Schema Integrity & Required Attributes', () => {
    it('validates all required top-level product fields', () => {
      for (const product of products) {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.tagline).toBeTruthy();
        expect(['band', 'watch']).toContain(product.category);
        expect(['standard', 'pro', 'pro_max']).toContain(product.tier);
        expect(typeof product.price).toBe('number');
        expect(product.rating).toBeGreaterThanOrEqual(4.0);
        expect(product.rating).toBeLessThanOrEqual(5.0);
        expect(product.reviewCount).toBeGreaterThan(0);
        expect(typeof product.inStock).toBe('boolean');
        expect(Array.isArray(product.features)).toBe(true);
        expect(product.features.length).toBeGreaterThan(0);
        expect(product.description).toBeTruthy();
        expect(typeof product.bezelThickness).toBe('number');
        expect(product.bezelThickness).toBeGreaterThan(0);
        expect(typeof product.caseSizeMm).toBe('number');
        expect(product.caseSizeMm).toBeGreaterThan(0);
      }
    });

    it('validates color options and defaultColorId integrity', () => {
      for (const product of products) {
        expect(Array.isArray(product.colors)).toBe(true);
        expect(product.colors.length).toBeGreaterThanOrEqual(2);

        const colorIds = product.colors.map((c) => c.id);
        expect(colorIds).toContain(product.defaultColorId);

        for (const color of product.colors) {
          expect(color.id).toBeTruthy();
          expect(color.name).toBeTruthy();
          expect(color.hex).toMatch(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
          expect(color.caseHex).toMatch(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
          expect(color.strapHex).toMatch(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
        }
      }
    });

    it('validates default watch faces are supported watch faces', () => {
      const validFaces: WatchFaceId[] = ['minimal', 'neon', 'chrono', 'health'];
      for (const product of products) {
        expect(validFaces).toContain(product.defaultFace);
      }
    });

    it('validates detailed hardware specifications', () => {
      for (const product of products) {
        const { specs } = product;
        expect(specs).toBeDefined();
        expect(specs.display).toBeTruthy();
        expect(specs.caseMaterial).toBeTruthy();
        expect(specs.strapMaterial).toBeTruthy();
        expect(specs.batteryLife).toBeTruthy();
        expect(specs.waterResistance).toBeTruthy();
        expect(Array.isArray(specs.sensors)).toBe(true);
        expect(specs.sensors.length).toBeGreaterThanOrEqual(2);
        expect(Array.isArray(specs.connectivity)).toBe(true);
        expect(specs.connectivity.length).toBeGreaterThanOrEqual(1);
        expect(specs.weight).toBeTruthy();
        expect(specs.dimensions).toBeTruthy();
      }
    });

    it('validates 3D model configuration per category', () => {
      for (const product of products) {
        if (product.category === 'band') {
          expect(product.modelType).toBe('band_capsule');
          expect(product.caseSizeMm).toBeLessThanOrEqual(25);
        } else {
          expect(['watch_round', 'watch_squircle']).toContain(product.modelType);
          expect(product.caseSizeMm).toBeGreaterThanOrEqual(40);
        }
      }
    });

    it('validates specific hardware material specs matching documentation', () => {
      const stdBand = products.find((p) => p.id === 'band-aura-std')!;
      expect(stdBand.specs.caseMaterial).toContain('Polycarbonate');
      expect(stdBand.specs.display).toContain('1.1');
      expect(stdBand.defaultFace).toBe('minimal');

      const proBand = products.find((p) => p.id === 'band-aura-pro')!;
      expect(proBand.specs.caseMaterial).toContain('Aluminum');
      expect(proBand.specs.display).toContain('1.47');
      expect(proBand.defaultFace).toBe('neon');

      const stdWatch = products.find((p) => p.id === 'watch-horizon-std')!;
      expect(stdWatch.specs.caseMaterial).toContain('Aluminum');
      expect(stdWatch.specs.display).toContain('1.39');
      expect(stdWatch.defaultFace).toBe('minimal');

      const proWatch = products.find((p) => p.id === 'watch-horizon-pro')!;
      expect(proWatch.specs.caseMaterial).toContain('Stainless Steel');
      expect(proWatch.specs.display).toContain('1.43');
      expect(proWatch.defaultFace).toBe('chrono');

      const maxWatch = products.find((p) => p.id === 'watch-horizon-max')!;
      expect(maxWatch.specs.caseMaterial).toContain('Titanium');
      expect(maxWatch.specs.display).toContain('1.95');
      expect(maxWatch.defaultFace).toBe('health');
    });
  });

  describe('Catalog Query Helper Functions', () => {
    it('finds products by ID', () => {
      const found = getProductById('watch-horizon-max');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Horizon Watch Pro Max');

      const notFound = getProductById('non-existent');
      expect(notFound).toBeUndefined();
    });

    it('filters products by category', () => {
      const bands = getProductsByCategory('band');
      expect(bands).toHaveLength(2);
      expect(bands.every((p) => p.category === 'band')).toBe(true);

      const watches = getProductsByCategory('watch');
      expect(watches).toHaveLength(3);
      expect(watches.every((p) => p.category === 'watch')).toBe(true);
    });

    it('filters products by tier', () => {
      const standardItems = getProductsByTier('standard');
      expect(standardItems).toHaveLength(2); // std band, std watch

      const proItems = getProductsByTier('pro');
      expect(proItems).toHaveLength(2); // pro band, pro watch

      const proMaxItems = getProductsByTier('pro_max');
      expect(proMaxItems).toHaveLength(1); // max watch
    });
  });
});
