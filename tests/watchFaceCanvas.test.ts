import { describe, it, expect, vi } from 'vitest';
import {
  getWatchFaceTheme,
  formatWatchDate,
  formatWatchTime,
  calculateStepPercentage,
  simulateHeartRateMeasurement,
  getNextWeather,
  getNextTrack,
  calculateEcgPoint,
  calculateChronoHandAngles,
  drawWatchFace,
  DEFAULT_PLAYLIST,
  WEATHER_PRESETS,
  DrawWatchFaceOptions,
} from '../src/components/viewer3d/watchFaceCanvas';
import { SimulatedWidgets, WatchFaceId } from '../src/types';

describe('watchFaceCanvas - Watch Face Themes', () => {
  const faces: WatchFaceId[] = ['minimal', 'neon', 'chrono', 'health'];

  it('should return valid theme configs for all 4 required watch faces', () => {
    faces.forEach((faceId) => {
      const theme = getWatchFaceTheme(faceId);
      expect(theme).toBeDefined();
      expect(theme.id).toBe(faceId);
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.primaryColor).toBe('string');
      expect(typeof theme.accentColor).toBe('string');
      expect(typeof theme.bgColor).toBe('string');
    });
  });

  it('should have correct styling characteristics for Minimal face', () => {
    const theme = getWatchFaceTheme('minimal');
    expect(theme.name).toBe('Minimal');
    expect(theme.accentColor).toBe('#7C3AED');
    expect(theme.isDark).toBe(true);
  });

  it('should have cyan and violet neon tones for Neon face', () => {
    const theme = getWatchFaceTheme('neon');
    expect(theme.name).toBe('Neon');
    expect(theme.primaryColor).toBe('#06B6D4');
    expect(theme.accentColor).toBe('#7C3AED');
  });

  it('should have chronograph racing styling for Chrono face', () => {
    const theme = getWatchFaceTheme('chrono');
    expect(theme.name).toBe('Chrono');
    expect(theme.accentColor).toBe('#F59E0B');
  });

  it('should have high-visibility telemetry colors for Health face', () => {
    const theme = getWatchFaceTheme('health');
    expect(theme.name).toBe('Health');
    expect(theme.primaryColor).toBe('#EF4444');
    expect(theme.accentColor).toBe('#10B981');
  });

  it('should fallback gracefully to minimal for unknown face ID', () => {
    // @ts-expect-error Testing invalid input fallback
    const fallbackTheme = getWatchFaceTheme('unknown-face');
    expect(fallbackTheme.id).toBe('minimal');
  });
});

describe('watchFaceCanvas - Time and Date Formatting', () => {
  it('should format watch date in WED 22 OCT format', () => {
    // 2026-10-21 is Wednesday (October 21) or 2026-10-22 is Thursday
    const testDate = new Date(2026, 9, 22); // Month 9 is October (0-indexed)
    const formatted = formatWatchDate(testDate);
    expect(formatted).toBe('THU 22 OCT');

    const wedDate = new Date(2026, 9, 21);
    expect(formatWatchDate(wedDate)).toBe('WED 21 OCT');
  });

  it('should format time with 2-digit padded strings', () => {
    const testDate = new Date(2026, 9, 22, 9, 5, 8);
    const formatted = formatWatchTime(testDate);
    expect(formatted.hours).toBe('09');
    expect(formatted.minutes).toBe('05');
    expect(formatted.seconds).toBe('08');
    expect(formatted.timeString).toBe('09:05');
  });

  it('should support 12-hour format with period', () => {
    const testPm = new Date(2026, 9, 22, 14, 30, 0);
    const formatted12 = formatWatchTime(testPm, { use12Hour: true });
    expect(formatted12.hours).toBe('02');
    expect(formatted12.period).toBe('PM');
  });
});

describe('watchFaceCanvas - Widget Telemetry & Simulation Logic', () => {
  it('should constrain simulated heart rate between 68 and 125 BPM', () => {
    for (let i = 0; i < 50; i++) {
      const bpm = simulateHeartRateMeasurement();
      expect(bpm).toBeGreaterThanOrEqual(68);
      expect(bpm).toBeLessThanOrEqual(125);
      expect(Number.isInteger(bpm)).toBe(true);
    }
  });

  it('should calculate step percentage and clamp within bounds', () => {
    expect(calculateStepPercentage(7420, 10000)).toBeCloseTo(74.2, 1);
    expect(calculateStepPercentage(0, 10000)).toBe(0);
    expect(calculateStepPercentage(12000, 10000)).toBe(100);
    expect(calculateStepPercentage(-50, 10000)).toBe(0);
  });

  it('should cycle through weather presets predictably', () => {
    const sunny = WEATHER_PRESETS[0];
    const cloudy = getNextWeather(sunny);
    expect(cloudy.condition).toBe('cloudy');
    const rainy = getNextWeather(cloudy);
    expect(rainy.condition).toBe('rainy');
    const backToSunny = getNextWeather(rainy);
    expect(backToSunny.condition).toBe('sunny');
  });

  it('should cycle music tracks in the playlist', () => {
    expect(DEFAULT_PLAYLIST.length).toBeGreaterThanOrEqual(3);
    const track1 = DEFAULT_PLAYLIST[0];
    const track2 = getNextTrack(track1, DEFAULT_PLAYLIST);
    expect(track2).toEqual(DEFAULT_PLAYLIST[1]);

    const lastTrack = DEFAULT_PLAYLIST[DEFAULT_PLAYLIST.length - 1];
    const loopedTrack = getNextTrack(lastTrack, DEFAULT_PLAYLIST);
    expect(loopedTrack).toEqual(DEFAULT_PLAYLIST[0]);
  });

  it('should calculate realistic ECG wave points with P-Q-R-S-T morphology', () => {
    // Check baseline is near zero
    const baseline = calculateEcgPoint(0.1, 100, 0);
    expect(Math.abs(baseline)).toBeLessThan(10);

    // Check R-peak height at peak phase
    let maxDisplacement = 0;
    for (let x = 0; x <= 100; x += 2) {
      const val = Math.abs(calculateEcgPoint(x, 100, 0));
      if (val > maxDisplacement) maxDisplacement = val;
    }
    expect(maxDisplacement).toBeGreaterThan(15);
  });

  it('should calculate chronograph sub-dial and main hand angles correctly', () => {
    const fixedDate = new Date(2026, 9, 22, 12, 15, 30);
    const angles = calculateChronoHandAngles(fixedDate, 15000);
    expect(angles.secondAngle).toBeDefined();
    expect(angles.minuteAngle).toBeDefined();
    expect(angles.hourAngle).toBeDefined();
    expect(angles.subSecondsAngle).toBeDefined();
    expect(angles.subMinutesAngle).toBeDefined();
    expect(angles.subHoursAngle).toBeDefined();
  });
});

describe('watchFaceCanvas - Canvas Rendering Pipeline', () => {
  function createMockCanvasContext() {
    const calls: string[] = [];
    const mockCtx = {
      save: vi.fn(() => calls.push('save')),
      restore: vi.fn(() => calls.push('restore')),
      beginPath: vi.fn(() => calls.push('beginPath')),
      closePath: vi.fn(() => calls.push('closePath')),
      clearRect: vi.fn(() => calls.push('clearRect')),
      fillRect: vi.fn(() => calls.push('fillRect')),
      strokeRect: vi.fn(() => calls.push('strokeRect')),
      arc: vi.fn(() => calls.push('arc')),
      ellipse: vi.fn(() => calls.push('ellipse')),
      moveTo: vi.fn(() => calls.push('moveTo')),
      lineTo: vi.fn(() => calls.push('lineTo')),
      stroke: vi.fn(() => calls.push('stroke')),
      fill: vi.fn(() => calls.push('fill')),
      fillText: vi.fn(() => calls.push('fillText')),
      strokeText: vi.fn(() => calls.push('strokeText')),
      measureText: vi.fn(() => ({ width: 40 })),
      translate: vi.fn(() => calls.push('translate')),
      rotate: vi.fn(() => calls.push('rotate')),
      scale: vi.fn(() => calls.push('scale')),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      roundRect: vi.fn(() => calls.push('roundRect')),
      setLineDash: vi.fn(),
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      font: '12px sans-serif',
      textAlign: 'center',
      textBaseline: 'middle',
      shadowColor: '',
      shadowBlur: 0,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    return { mockCtx, calls };
  }

  const mockWidgets: SimulatedWidgets = {
    heartRate: 72,
    isMeasuringHeartRate: false,
    steps: 7420,
    stepGoal: 10000,
    isPlayingMusic: true,
    currentTrack: {
      title: 'Neon Midnight',
      artist: 'Synthwave',
    },
    weather: {
      temp: 24,
      condition: 'sunny',
      city: 'Tokyo, JP',
    },
    battery: 88,
  };

  it('should render Minimal face without throwing', () => {
    const { mockCtx } = createMockCanvasContext();
    const opts: DrawWatchFaceOptions = {
      faceId: 'minimal',
      widgets: mockWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('should render Neon face with glow rings without throwing', () => {
    const { mockCtx } = createMockCanvasContext();
    const opts: DrawWatchFaceOptions = {
      faceId: 'neon',
      widgets: mockWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
    expect(mockCtx.arc).toHaveBeenCalled();
  });

  it('should render Chrono face with sub-dials and tachymeter scale without throwing', () => {
    const { mockCtx } = createMockCanvasContext();
    const opts: DrawWatchFaceOptions = {
      faceId: 'chrono',
      widgets: mockWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
    expect(mockCtx.rotate).toHaveBeenCalled();
  });

  it('should render Health face with ECG wave and telemetry metrics', () => {
    const { mockCtx } = createMockCanvasContext();
    const opts: DrawWatchFaceOptions = {
      faceId: 'health',
      widgets: mockWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
      animationTimeMs: 1200,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
    expect(mockCtx.lineTo).toHaveBeenCalled();
  });

  it('should render heart rate diagnostic measuring state appropriately', () => {
    const { mockCtx } = createMockCanvasContext();
    const measuringWidgets: SimulatedWidgets = {
      ...mockWidgets,
      isMeasuringHeartRate: true,
    };
    const opts: DrawWatchFaceOptions = {
      faceId: 'health',
      widgets: measuringWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
      animationTimeMs: 2500,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
  });

  it('should adapt layout for band capsule screen shape', () => {
    const { mockCtx } = createMockCanvasContext();
    const opts: DrawWatchFaceOptions = {
      faceId: 'minimal',
      widgets: mockWidgets,
      time: new Date(2026, 9, 22, 10, 9, 30),
      size: 512,
      isBand: true,
    };

    expect(() => drawWatchFace(mockCtx, opts)).not.toThrow();
  });
});

describe('proceduralMeshes - 3D Models & Primitives Generation', () => {
  const modelTypes = [
    'band_standard',
    'band_pro',
    'watch_standard',
    'watch_pro',
    'watch_pro_max',
  ] as const;

  it('should generate all 5 procedural device models without error', async () => {
    const { createProceduralModel } = await import('../src/components/viewer3d/proceduralMeshes');

    modelTypes.forEach((type) => {
      const model = createProceduralModel(type, '#334155', '#7C3AED');
      expect(model).toBeDefined();
      expect(model.type).toBe(type);
      expect(model.group).toBeDefined();
      expect(model.screenMesh).toBeDefined();
      expect(model.screenMaterial).toBeDefined();
      expect(model.chassisMaterials.length).toBeGreaterThan(0);
      expect(model.strapMaterials.length).toBeGreaterThan(0);

      // Verify color updates
      model.updateChassisColor('#10B981');
      expect(model.chassisMaterials[0].color.getHexString()).toBe('10b981');

      model.updateStrapColor('#06B6D4');
      expect(model.strapMaterials[0].color.getHexString()).toBe('06b6d4');

      // Verify crown rotation for pro / pro max models
      if (model.rotateCrown) {
        expect(model.crownMesh).toBeDefined();
        const initialRotation = model.crownMesh!.rotation.x;
        model.rotateCrown(0.1);
        expect(model.crownMesh!.rotation.x).toBeCloseTo(initialRotation + 0.1);
      }

      // Verify clean disposal
      expect(() => model.dispose()).not.toThrow();
    });
  });

  it('should generate Watch Pro Max with safety orange action button', async () => {
    const { buildWatchProMax } = await import('../src/components/viewer3d/proceduralMeshes');
    const model = buildWatchProMax('#94A3B8', '#D97706');
    expect(model.type).toBe('watch_pro_max');
    expect(model.crownMesh).toBeDefined();

    // Check for safety orange button mesh in children
    let hasOrangeButton = false;
    model.group.traverse((child: any) => {
      if (child.material && child.material.color && child.material.color.getHexString() === 'f97316') {
        hasOrangeButton = true;
      }
    });
    expect(hasOrangeButton).toBe(true);
    model.dispose();
  });
});

describe('ViewerContext - Telemetry & State Logic', () => {
  it('should export INITIAL_WIDGETS with complete default telemetry values', async () => {
    const { INITIAL_WIDGETS } = await import('../src/context/ViewerContext');
    expect(INITIAL_WIDGETS).toBeDefined();
    expect(INITIAL_WIDGETS.heartRate).toBe(72);
    expect(INITIAL_WIDGETS.isMeasuringHeartRate).toBe(false);
    expect(INITIAL_WIDGETS.steps).toBe(7420);
    expect(INITIAL_WIDGETS.stepGoal).toBe(10000);
    expect(INITIAL_WIDGETS.battery).toBe(88);
    expect(INITIAL_WIDGETS.weather.condition).toBe('sunny');
    expect(INITIAL_WIDGETS.currentTrack.title).toBe('Neon Midnight');
  });

  it('should export ViewerProvider and useViewer hook', async () => {
    const { ViewerProvider, useViewer } = await import('../src/context/ViewerContext');
    expect(ViewerProvider).toBeDefined();
    expect(typeof ViewerProvider).toBe('function');
    expect(useViewer).toBeDefined();
    expect(typeof useViewer).toBe('function');
  });
});

describe('3D Components & SceneManager Integration', () => {
  it('should export SceneManager class with required API methods', async () => {
    const { SceneManager } = await import('../src/components/viewer3d/SceneManager');
    expect(SceneManager).toBeDefined();
    expect(typeof SceneManager).toBe('function');
    expect(typeof SceneManager.prototype.setModel).toBe('function');
    expect(typeof SceneManager.prototype.setAutoRotate).toBe('function');
    expect(typeof SceneManager.prototype.setCameraPreset).toBe('function');
    expect(typeof SceneManager.prototype.handleResize).toBe('function');
    expect(typeof SceneManager.prototype.dispose).toBe('function');
  });

  it('should export WatchViewer3D and ViewerControlsOverlay components', async () => {
    const { WatchViewer3D } = await import('../src/components/viewer3d/WatchViewer3D');
    const { ViewerControlsOverlay } = await import('../src/components/viewer3d/ViewerControlsOverlay');

    expect(WatchViewer3D).toBeDefined();
    expect(typeof WatchViewer3D).toBe('function');
    expect(ViewerControlsOverlay).toBeDefined();
    expect(typeof ViewerControlsOverlay).toBe('function');
  });
});


