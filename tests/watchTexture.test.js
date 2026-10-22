import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  CANVAS_SIZE,
  renderWatchFace,
  createWatchCanvasTexture,
} from '../src/components/3d/WatchCanvasTexture.js';
import {
  createWatchModel,
  createBandModel,
  updateModelColors,
  disposeModel,
} from '../src/components/3d/ProceduralWatchMesh.js';
import {
  WIDGETS,
  simulateNextHeartRate,
  incrementSteps,
  toggleMusicPlayback,
  toggleLowPowerMode,
} from '../src/data/widgets.js';
import { WATCH_FACES } from '../src/data/watchFaces.js';
import { COLORWAYS } from '../src/components/3d/ViewerControls.jsx';

function createMockCanvas(width = CANVAS_SIZE, height = CANVAS_SIZE) {
  const operations = [];
  const textDrawn = [];

  const ctx = {
    canvas: null,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    font: '10px sans-serif',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    shadowBlur: 0,
    shadowColor: 'transparent',
    lineCap: 'butt',
    lineJoin: 'miter',
    globalAlpha: 1.0,
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(() => operations.push('beginPath')),
    closePath: vi.fn(() => operations.push('closePath')),
    moveTo: vi.fn((x, y) => operations.push(`moveTo(${x},${y})`)),
    lineTo: vi.fn((x, y) => operations.push(`lineTo(${x},${y})`)),
    arc: vi.fn((x, y, r, sa, ea) => operations.push(`arc(${x},${y},${r},${sa},${ea})`)),
    stroke: vi.fn(() => operations.push('stroke')),
    fill: vi.fn(() => operations.push('fill')),
    fillRect: vi.fn((x, y, w, h) => operations.push(`fillRect(${x},${y},${w},${h})`)),
    clearRect: vi.fn((x, y, w, h) => operations.push(`clearRect(${x},${y},${w},${h})`)),
    fillText: vi.fn((text, x, y) => {
      operations.push(`fillText("${text}",${x},${y})`);
      textDrawn.push(String(text));
    }),
    strokeText: vi.fn((text, x, y) => {
      operations.push(`strokeText("${text}",${x},${y})`);
      textDrawn.push(String(text));
    }),
    roundRect: vi.fn((x, y, w, h, r) => operations.push(`roundRect(${x},${y},${w},${h},${r})`)),
    setLineDash: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    measureText: vi.fn((text) => ({ width: String(text).length * 8 })),
  };

  const canvas = {
    width,
    height,
    getContext: vi.fn((type) => (type === '2d' ? ctx : null)),
  };
  ctx.canvas = canvas;

  return { canvas, ctx, operations, textDrawn };
}

describe('Watch Canvas Texture & Watch Face Rendering', () => {
  it('should define CANVAS_SIZE as 512', () => {
    expect(CANVAS_SIZE).toBe(512);
  });

  describe('Watch Face Types', () => {
    it('should render Minimal face with hands, indices, and date', () => {
      const { canvas, ctx, textDrawn, operations } = createMockCanvas();
      const fixedTime = new Date('2026-10-22T10:15:30Z');

      renderWatchFace(canvas, {
        faceId: 'minimal',
        time: fixedTime,
        widgetId: 'heartRate',
        widgetState: { bpm: 75 },
      });

      expect(canvas.getContext).toHaveBeenCalledWith('2d');
      expect(ctx.fillRect).toHaveBeenCalled(); // Background fill
      expect(operations.length).toBeGreaterThan(10);
      expect(ctx.stroke).toHaveBeenCalled();
      // Should render date numeral
      const hasDateOrBpm = textDrawn.some((t) => t.includes('22') || t.includes('OCT') || t.includes('75'));
      expect(hasDateOrBpm).toBe(true);
    });

    it('should render Neon face with digital clock and glow', () => {
      const { canvas, ctx, textDrawn } = createMockCanvas();
      const fixedTime = new Date('2026-10-22T21:42:00Z');

      renderWatchFace(canvas, {
        faceId: 'neon',
        time: fixedTime,
        widgetId: 'steps',
        widgetState: { current: 8500, goal: 10000 },
      });

      expect(ctx.fillRect).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled(); // Pulsating orbit ring
      // Check for digital time or step indicator
      const hasDigitalText = textDrawn.some((t) => t.includes(':') || t.includes('8,500') || t.includes('8500') || t.includes('STEPS'));
      expect(hasDigitalText).toBe(true);
    });

    it('should render Chrono face with 3 sub-dials, tachymeter scale, and metallic indices', () => {
      const { canvas, ctx, operations } = createMockCanvas();
      const fixedTime = new Date('2026-10-22T14:30:00Z');

      renderWatchFace(canvas, {
        faceId: 'chrono',
        time: fixedTime,
      });

      expect(ctx.fillRect).toHaveBeenCalled();
      // Should draw multiple sub-dials (arcs)
      const arcCalls = operations.filter((op) => op.startsWith('arc'));
      expect(arcCalls.length).toBeGreaterThanOrEqual(3);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should render Health face with concentric activity rings and live metrics', () => {
      const { canvas, ctx, textDrawn, operations } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'health',
        widgetId: 'heartRate',
        widgetState: { bpm: 82 },
      });

      expect(ctx.fillRect).toHaveBeenCalled();
      // Concentric rings require multiple arc calls for Move, Exercise, Stand
      const arcCalls = operations.filter((op) => op.startsWith('arc'));
      expect(arcCalls.length).toBeGreaterThanOrEqual(3);
      const hasBpmOrHealthText = textDrawn.some((t) => t.includes('82') || t.includes('BPM') || t.includes('CAL') || t.includes('MOVE'));
      expect(hasBpmOrHealthText).toBe(true);
    });
  });

  describe('Dynamic Simulated Widgets Rendering', () => {
    it('should render Heart Rate widget with BPM and pulse wave', () => {
      const { canvas, textDrawn, operations } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'minimal',
        widgetId: 'heartRate',
        widgetState: { bpm: 88, status: 'Normal' },
      });

      const hasBpm = textDrawn.some((t) => t.includes('88') || t.includes('BPM'));
      expect(hasBpm).toBe(true);
      const hasLineTo = operations.some((op) => op.startsWith('lineTo'));
      expect(hasLineTo).toBe(true);
    });

    it('should render Step Counter widget with step progress and distance', () => {
      const { canvas, textDrawn } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'minimal',
        widgetId: 'steps',
        widgetState: { current: 7420, goal: 10000, distanceKm: 5.4 },
      });

      const hasSteps = textDrawn.some((t) => t.includes('7,420') || t.includes('7420') || t.includes('5.4'));
      expect(hasSteps).toBe(true);
    });

    it('should render Weather widget with temperature and condition', () => {
      const { canvas, textDrawn } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'minimal',
        widgetId: 'weather',
        widgetState: { tempC: 24, tempF: 75, condition: 'Partly Sunny' },
      });

      const hasWeather = textDrawn.some((t) => t.includes('24') || t.includes('75') || t.includes('Partly Sunny'));
      expect(hasWeather).toBe(true);
    });

    it('should render Music widget with track title and playback state', () => {
      const { canvas, textDrawn } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'minimal',
        widgetId: 'music',
        widgetState: { track: 'Echoes of Tomorrow', artist: 'Nova Beats', isPlaying: true },
      });

      const hasMusic = textDrawn.some((t) => t.includes('Echoes of Tomorrow') || t.includes('Nova Beats') || t.includes('Playing'));
      expect(hasMusic).toBe(true);
    });

    it('should render Battery widget with level and power status', () => {
      const { canvas, textDrawn } = createMockCanvas();

      renderWatchFace(canvas, {
        faceId: 'minimal',
        widgetId: 'battery',
        widgetState: { level: 88, lowPowerMode: false, isCharging: false },
      });

      const hasBattery = textDrawn.some((t) => t.includes('88%') || t.includes('88') || t.includes('BAT'));
      expect(hasBattery).toBe(true);
    });
  });

  describe('createWatchCanvasTexture lifecycle', () => {
    it('should create a CanvasTexture with update and dispose methods', () => {
      const { canvas } = createMockCanvas();
      const textureWrapper = createWatchCanvasTexture({
        customCanvas: canvas,
        faceId: 'neon',
        widgetId: 'heartRate',
        widgetState: { bpm: 78 },
      });

      expect(textureWrapper).toBeDefined();
      expect(textureWrapper.texture).toBeInstanceOf(THREE.CanvasTexture);
      expect(typeof textureWrapper.update).toBe('function');
      expect(typeof textureWrapper.dispose).toBe('function');

      // Test update method
      const initialVersion = textureWrapper.texture.version;
      textureWrapper.update({ faceId: 'health', widgetState: { bpm: 95 } });
      expect(textureWrapper.texture.version).toBeGreaterThan(initialVersion);

      // Test dispose method
      const disposeSpy = vi.spyOn(textureWrapper.texture, 'dispose');
      textureWrapper.dispose();
      expect(disposeSpy).toHaveBeenCalled();
    });
  });
});

describe('Procedural 3D Wearable Models', () => {
  let mockTexture;

  beforeEach(() => {
    const { canvas } = createMockCanvas();
    mockTexture = new THREE.CanvasTexture(canvas);
  });

  describe('createWatchModel', () => {
    it('should construct a Smart Watch group with chassis, crown, button, lugs, straps, and screen', () => {
      const watchGroup = createWatchModel({
        chassisColor: '#0F172A',
        strapColor: '#1E293B',
        screenTexture: mockTexture,
      });

      expect(watchGroup).toBeInstanceOf(THREE.Group);
      expect(watchGroup.name).toBe('SmartWatch');

      // Check for screen mesh with texture
      let foundScreen = false;
      let foundCrown = false;
      let foundStrap = false;
      let foundChassis = false;

      watchGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'WatchScreen') foundScreen = true;
          if (child.name === 'WatchCrown') foundCrown = true;
          if (child.name && child.name.includes('Strap')) foundStrap = true;
          if (child.name && child.name.includes('Chassis')) foundChassis = true;
        }
      });

      expect(foundScreen).toBe(true);
      expect(foundCrown).toBe(true);
      expect(foundStrap).toBe(true);
      expect(foundChassis).toBe(true);
    });
  });

  describe('createBandModel', () => {
    it('should construct a Smart Band group with capsule chassis, silicone strap loop, and pill screen', () => {
      const bandGroup = createBandModel({
        chassisColor: '#0F172A',
        strapColor: '#1E293B',
        screenTexture: mockTexture,
      });

      expect(bandGroup).toBeInstanceOf(THREE.Group);
      expect(bandGroup.name).toBe('SmartBand');

      let foundScreen = false;
      let foundStrap = false;
      let foundCapsule = false;

      bandGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'BandScreen') foundScreen = true;
          if (child.name && child.name.includes('Strap')) foundStrap = true;
          if (child.name && (child.name.includes('Capsule') || child.name.includes('Chassis'))) foundCapsule = true;
        }
      });

      expect(foundScreen).toBe(true);
      expect(foundStrap).toBe(true);
      expect(foundCapsule).toBe(true);
    });
  });

  describe('updateModelColors', () => {
    it('should update chassis and strap materials with new colors', () => {
      const watchGroup = createWatchModel({
        chassisColor: '#0F172A',
        strapColor: '#1E293B',
        screenTexture: mockTexture,
      });

      updateModelColors(watchGroup, {
        chassisColor: '#7C3AED',
        strapColor: '#5B21B6',
      });

      let chassisColorHex = null;
      let strapColorHex = null;

      watchGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'WatchChassis' && child.material) {
            chassisColorHex = '#' + child.material.color.getHexString().toUpperCase();
          }
          if (child.name.includes('WatchStrap') && child.material) {
            strapColorHex = '#' + child.material.color.getHexString().toUpperCase();
          }
        }
      });

      expect(chassisColorHex).toBe('#7C3AED');
      expect(strapColorHex).toBe('#5B21B6');
    });
  });

  describe('disposeModel', () => {
    it('should safely dispose all geometries and materials without throwing', () => {
      const watchGroup = createWatchModel({
        chassisColor: '#0F172A',
        strapColor: '#1E293B',
        screenTexture: mockTexture,
      });

      const uniqueGeometries = new Set();
      const uniqueMaterials = new Set();

      watchGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) uniqueGeometries.add(child.geometry);
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => uniqueMaterials.add(m));
            } else {
              uniqueMaterials.add(child.material);
            }
          }
        }
      });

      expect(uniqueGeometries.size).toBeGreaterThan(0);
      expect(uniqueMaterials.size).toBeGreaterThan(0);

      const geomSpies = Array.from(uniqueGeometries).map((g) => vi.spyOn(g, 'dispose'));
      const matSpies = Array.from(uniqueMaterials).map((m) => vi.spyOn(m, 'dispose'));

      expect(() => disposeModel(watchGroup)).not.toThrow();

      geomSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
      matSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    });
  });
});

describe('ViewerControls Component & Colorways', () => {
  it('should export 6 predefined colorways matching design system', () => {
    expect(COLORWAYS).toBeDefined();
    expect(COLORWAYS.length).toBe(6);
    const ids = COLORWAYS.map((c) => c.id);
    expect(ids).toContain('midnight-black');
    expect(ids).toContain('cosmic-purple');
    expect(ids).toContain('glacier-cyan');
    expect(ids).toContain('starlight-silver');
  });

  it('should render model switcher, 4 faces, 5 widgets, and swatches', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { ViewerControls } = await import('../src/components/3d/ViewerControls.jsx');

    const html = renderToString(
      React.createElement(ViewerControls, {
        activeModel: 'watch',
        activeFace: 'neon',
        activeWidget: 'steps',
        autoRotate: true,
      })
    );

    expect(html).toContain('Smart Watch');
    expect(html).toContain('Smart Band');
    expect(html).toContain('Minimal');
    expect(html).toContain('Neon');
    expect(html).toContain('Chrono');
    expect(html).toContain('Health');
    expect(html).toContain('Heart');
    expect(html).toContain('Daily');
    expect(html).toContain('Weather');
    expect(html).toContain('Music');
    expect(html).toContain('Battery');
    expect(html).toContain('Auto-Spin');
  });
});

describe('WatchViewer3D Component', () => {
  it('should render viewport container with interaction hints and controls', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { WatchViewer3D } = await import('../src/components/3d/WatchViewer3D.jsx');

    const html = renderToString(
      React.createElement(WatchViewer3D, {
        modelType: 'watch',
        tier: 'pro',
        showControls: true,
      })
    );

    expect(html).toContain('Interactive Smart Watch');
    expect(html).toContain('Drag to rotate 360°');
    expect(html).toContain('viewer-controls');
  });

  it('should support hiding controls dock when showControls is false', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { WatchViewer3D } = await import('../src/components/3d/WatchViewer3D.jsx');

    const html = renderToString(
      React.createElement(WatchViewer3D, {
        modelType: 'band',
        tier: 'standard',
        showControls: false,
      })
    );

    expect(html).toContain('Interactive Smart Band');
    expect(html).not.toContain('data-testid="viewer-controls"');
  });
});

describe('Simulated Widgets Logic & State Changes', () => {
  it('should simulate heart rate strictly clamped to [68, 115] BPM', () => {
    for (let i = 0; i < 50; i++) {
      const bpm = simulateNextHeartRate(78);
      expect(bpm).toBeGreaterThanOrEqual(68);
      expect(bpm).toBeLessThanOrEqual(115);
    }
  });

  it('should increment steps and compute realistic distance and calories', () => {
    const initial = { current: 7000, goal: 10000, distanceKm: 5.25, caloriesBurned: 315, progress: 0.7 };
    const updated = incrementSteps(initial, 500);

    expect(updated.current).toBe(7500);
    expect(updated.distanceKm).toBeCloseTo(5.62, 1);
    expect(updated.caloriesBurned).toBe(338);
    expect(updated.progress).toBe(0.75);
  });

  it('should toggle music playback state between true and false', () => {
    const paused = { isPlaying: false, track: 'Echoes of Tomorrow' };
    const playing = toggleMusicPlayback(paused);
    expect(playing.isPlaying).toBe(true);

    const pausedAgain = toggleMusicPlayback(playing);
    expect(pausedAgain.isPlaying).toBe(false);
  });

  it('should toggle low power mode state on battery indicator', () => {
    const normal = { level: 85, lowPowerMode: false };
    const lowPower = toggleLowPowerMode(normal);
    expect(lowPower.lowPowerMode).toBe(true);

    const normalAgain = toggleLowPowerMode(lowPower);
    expect(normalAgain.lowPowerMode).toBe(false);
  });
});
