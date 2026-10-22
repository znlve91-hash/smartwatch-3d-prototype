// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as THREE from 'three';
import React from 'react';
import { render, screen, fireEvent, cleanup, renderHook, act } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
import {
  calculateStepMetrics,
  generateECGWave,
  calculateBatteryEstimate,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  clamp,
  TRACK_LIST,
  useWatchSimulator,
} from '../src/hooks/useWatchSimulator';
import type { WatchFaceId, ActiveWidgetId, ColorOption } from '../src/types';

import {
  createBandModel,
  createWatchRoundModel,
  createWatchSquircleModel,
  createWatchModel,
  updateWatchMaterials,
} from '../src/components/viewer3d/WatchGeometry';
import {
  renderWatchFace,
  drawMinimalFace,
  drawNeonFace,
  drawChronoFace,
  drawHealthFace,
} from '../src/components/viewer3d/WatchFaceRenderer';
import {
  WatchScreenManager,
  createWatchScreenManager,
} from '../src/components/viewer3d/WatchScreenTexture';
import { StudioControls } from '../src/components/viewer3d/StudioControls';
import { HeartRateWidget } from '../src/components/widgets/HeartRateWidget';
import { StepsWidget } from '../src/components/widgets/StepsWidget';
import { WeatherWidget } from '../src/components/widgets/WeatherWidget';
import { MusicWidget } from '../src/components/widgets/MusicWidget';
import { BatteryWidget } from '../src/components/widgets/BatteryWidget';
import { WatchViewer3D } from '../src/components/viewer3d/WatchViewer3D';

describe('Watch Simulator Calculation & Logic Utilities', () => {
  describe('clamp helper', () => {
    it('clamps values strictly within min and max', () => {
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(-20, 0, 100)).toBe(0);
      expect(clamp(50, 0, 100)).toBe(50);
    });
  });

  describe('Step Counter & Activity Metrics Calculation', () => {
    it('calculates 0% progress for 0 steps', () => {
      const metrics = calculateStepMetrics(0, 10000);
      expect(metrics.progressPercent).toBe(0);
      expect(metrics.distanceKm).toBe(0);
      expect(metrics.caloriesBurned).toBe(0);
    });

    it('calculates correct metrics for 5,000 steps (half goal)', () => {
      const metrics = calculateStepMetrics(5000, 10000);
      expect(metrics.progressPercent).toBe(50);
      // approx 0.000762 km per step = 3.81 km
      expect(metrics.distanceKm).toBeCloseTo(3.81, 1);
      // approx 0.04 kcal per step = 200 kcal
      expect(metrics.caloriesBurned).toBe(200);
    });

    it('calculates metrics for 10,000 steps (full goal)', () => {
      const metrics = calculateStepMetrics(10000, 10000);
      expect(metrics.progressPercent).toBe(100);
      expect(metrics.distanceKm).toBeCloseTo(7.62, 1);
      expect(metrics.caloriesBurned).toBe(400);
    });

    it('clamps progressPercent to 100% when exceeding goal', () => {
      const metrics = calculateStepMetrics(15000, 10000);
      expect(metrics.progressPercent).toBe(100);
      expect(metrics.distanceKm).toBeCloseTo(11.43, 1);
      expect(metrics.caloriesBurned).toBe(600);
    });
  });

  describe('ECG Waveform Synthesis', () => {
    it('generates an array of ECG wave points of specified sample length', () => {
      const points = generateECGWave(50, 72, 0);
      expect(points).toHaveLength(50);
    });

    it('keeps ECG wave values bounded within [-1, 1]', () => {
      const points = generateECGWave(100, 100, 0.5);
      for (const val of points) {
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('exhibits distinct peak near the QRS complex', () => {
      const points = generateECGWave(60, 72, 0);
      const maxVal = Math.max(...points);
      expect(maxVal).toBeGreaterThan(0.6);
    });
  });

  describe('Battery Life Estimation', () => {
    it('calculates standard hours remaining based on percentage', () => {
      const est100 = calculateBatteryEstimate(100, false);
      expect(est100).toBe(48);

      const est50 = calculateBatteryEstimate(50, false);
      expect(est50).toBe(24);

      const est0 = calculateBatteryEstimate(0, false);
      expect(est0).toBe(0);
    });

    it('extends battery life by 1.75x in Eco Mode', () => {
      const standardHours = calculateBatteryEstimate(80, false);
      const ecoHours = calculateBatteryEstimate(80, true);
      expect(ecoHours).toBeGreaterThan(standardHours);
      expect(ecoHours).toBe(Math.round(standardHours * 1.75));
    });
  });

  describe('Temperature Conversions', () => {
    it('converts Celsius to Fahrenheit correctly', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(24)).toBe(75);
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('converts Fahrenheit to Celsius correctly', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(75)).toBe(24);
      expect(fahrenheitToCelsius(212)).toBe(100);
    });
  });

  describe('Music Track Catalog', () => {
    it('contains valid tracks with title, artist, and positive duration', () => {
      expect(TRACK_LIST.length).toBeGreaterThanOrEqual(3);
      for (const track of TRACK_LIST) {
        expect(track.title).toBeTruthy();
        expect(track.artist).toBeTruthy();
        expect(track.durationSec).toBeGreaterThan(0);
      }
    });
  });
});

describe('useWatchSimulator Hook State Management', () => {
  it('initializes with default watch face and healthy baseline metrics', () => {
    const { result } = renderHook(() => useWatchSimulator('minimal'));

    expect(result.current.activeFace).toBe('minimal');
    expect(result.current.activeWidget).toBe('heart_rate');
    expect(result.current.heartRate).toBeGreaterThanOrEqual(65);
    expect(result.current.heartRate).toBeLessThanOrEqual(80);
    expect(result.current.stepCount).toBeGreaterThan(0);
    expect(result.current.batteryLevel).toBe(86);
    expect(result.current.isEcoMode).toBe(false);
    expect(result.current.isCharging).toBe(false);
  });

  describe('Watch Face Switching', () => {
    it('switches between all 4 supported watch faces', () => {
      const { result } = renderHook(() => useWatchSimulator('minimal'));
      const faces: WatchFaceId[] = ['minimal', 'neon', 'chrono', 'health'];

      for (const face of faces) {
        act(() => {
          result.current.setActiveFace(face);
        });
        expect(result.current.activeFace).toBe(face);
      }
    });
  });

  describe('Active Widget Selection', () => {
    it('switches active widget and allows closing drawer (null)', () => {
      const { result } = renderHook(() => useWatchSimulator());
      const widgets: (ActiveWidgetId | null)[] = [
        'heart_rate',
        'steps',
        'weather',
        'music',
        'battery',
        null,
      ];

      for (const widget of widgets) {
        act(() => {
          result.current.setActiveWidget(widget);
        });
        expect(result.current.activeWidget).toBe(widget);
      }
    });
  });

  describe('Heart Rate Measurement Simulation', () => {
    it('updates heart rate within realistic 68 to 128 BPM bounds when measured', () => {
      const { result } = renderHook(() => useWatchSimulator());

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.measureHeartRate();
        });
        expect(result.current.heartRate).toBeGreaterThanOrEqual(68);
        expect(result.current.heartRate).toBeLessThanOrEqual(128);
        expect(result.current.heartRateStatus).toMatch(/Resting|Elevated|Optimal|Normal/);
      }
    });
  });

  describe('Step Counter Simulation', () => {
    it('increments step count by default +500 steps and updates metrics', () => {
      const { result } = renderHook(() => useWatchSimulator());
      const initialSteps = result.current.stepCount;

      act(() => {
        result.current.addSteps(500);
      });

      expect(result.current.stepCount).toBe(initialSteps + 500);
      expect(result.current.stepMetrics.caloriesBurned).toBeGreaterThan(0);
      expect(result.current.stepMetrics.distanceKm).toBeGreaterThan(0);
    });

    it('resets step count to 0', () => {
      const { result } = renderHook(() => useWatchSimulator());

      act(() => {
        result.current.resetSteps();
      });

      expect(result.current.stepCount).toBe(0);
      expect(result.current.stepMetrics.progressPercent).toBe(0);
    });
  });

  describe('Battery State & Eco Mode Simulation', () => {
    it('toggles charging state', () => {
      const { result } = renderHook(() => useWatchSimulator());
      expect(result.current.isCharging).toBe(false);

      act(() => {
        result.current.toggleCharging();
      });
      expect(result.current.isCharging).toBe(true);

      act(() => {
        result.current.toggleCharging();
      });
      expect(result.current.isCharging).toBe(false);
    });

    it('toggles eco mode and alters remaining hours estimate', () => {
      const { result } = renderHook(() => useWatchSimulator());
      expect(result.current.isEcoMode).toBe(false);
      const normalHours = result.current.batteryEstimateHours;

      act(() => {
        result.current.toggleEcoMode();
      });
      expect(result.current.isEcoMode).toBe(true);
      expect(result.current.batteryEstimateHours).toBeGreaterThan(normalHours);
    });

    it('clamps battery level between 0 and 100 on manual adjustments', () => {
      const { result } = renderHook(() => useWatchSimulator());

      act(() => {
        result.current.setBatteryLevel(150);
      });
      expect(result.current.batteryLevel).toBe(100);

      act(() => {
        result.current.setBatteryLevel(-10);
      });
      expect(result.current.batteryLevel).toBe(0);
    });
  });

  describe('Music Playback Simulation', () => {
    it('toggles playback status', () => {
      const { result } = renderHook(() => useWatchSimulator());
      const initialPlaying = result.current.isPlayingMusic;

      act(() => {
        result.current.toggleMusicPlay();
      });
      expect(result.current.isPlayingMusic).toBe(!initialPlaying);
    });

    it('cycles next and previous tracks with wrap-around', () => {
      const { result } = renderHook(() => useWatchSimulator());
      const firstTrack = result.current.currentTrack;

      act(() => {
        result.current.nextTrack();
      });
      expect(result.current.currentTrack.title).not.toBe(firstTrack.title);

      act(() => {
        result.current.prevTrack();
      });
      expect(result.current.currentTrack.title).toBe(firstTrack.title);
    });
  });

  describe('Weather Temperature Unit Simulation', () => {
    it('toggles between Celsius and Fahrenheit', () => {
      const { result } = renderHook(() => useWatchSimulator());
      expect(result.current.isCelsius).toBe(true);

      act(() => {
        result.current.toggleWeatherUnit();
      });
      expect(result.current.isCelsius).toBe(false);

      act(() => {
        result.current.toggleWeatherUnit();
      });
      expect(result.current.isCelsius).toBe(true);
    });
  });
});

describe('Three.js Procedural Geometries (WatchGeometry)', () => {
  it('creates Band Model with capsule chassis, screen, and continuous strap', () => {
    const band = createBandModel({ caseColor: '#1E293B', strapColor: '#0F172A' });
    expect(band).toBeInstanceOf(THREE.Group);
    expect(band.name).toBe('BandModel');

    const roles: string[] = [];
    band.traverse((child) => {
      if (child.userData?.role) {
        roles.push(child.userData.role);
      }
    });

    expect(roles).toContain('case');
    expect(roles).toContain('screen');
    expect(roles).toContain('strap');
  });

  it('creates Round Watch Model with case, bezel, screen, crown, and straps', () => {
    const watch = createWatchRoundModel({ caseColor: '#CBD5E1', strapColor: '#94A3B8' });
    expect(watch).toBeInstanceOf(THREE.Group);
    expect(watch.name).toBe('WatchRoundModel');

    const roles: string[] = [];
    watch.traverse((child) => {
      if (child.userData?.role) {
        roles.push(child.userData.role);
      }
    });

    expect(roles).toContain('case');
    expect(roles).toContain('screen');
    expect(roles).toContain('crown');
    expect(roles).toContain('strap');
  });

  it('creates Squircle Watch Model with protective rim and crown guard', () => {
    const squircle = createWatchSquircleModel({ caseColor: '#94A3B8', strapColor: '#0891B2' });
    expect(squircle).toBeInstanceOf(THREE.Group);
    expect(squircle.name).toBe('WatchSquircleModel');

    const roles: string[] = [];
    squircle.traverse((child) => {
      if (child.userData?.role) {
        roles.push(child.userData.role);
      }
    });

    expect(roles).toContain('case');
    expect(roles).toContain('screen');
    expect(roles).toContain('crown');
    expect(roles).toContain('strap');
  });

  it('creates model via factory function createWatchModel', () => {
    const band = createWatchModel('band_capsule');
    const round = createWatchModel('watch_round');
    const squircle = createWatchModel('watch_squircle');

    expect(band.name).toBe('BandModel');
    expect(round.name).toBe('WatchRoundModel');
    expect(squircle.name).toBe('WatchSquircleModel');
  });

  it('updates watch materials in real time without throwing', () => {
    const watch = createWatchRoundModel();
    expect(() => {
      updateWatchMaterials(watch, {
        caseColor: '#FF0000',
        strapColor: '#00FF00',
      });
    }).not.toThrow();
  });
});

describe('Watch Face Drawing Engine (WatchFaceRenderer)', () => {
  const createMockContext = () => {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: 'left',
      textBaseline: 'top',
      lineCap: 'butt',
      lineJoin: 'miter',
      shadowColor: '',
      shadowBlur: 0,
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      roundRect: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    } as unknown as CanvasRenderingContext2D;
  };

  const dummyState = {
    activeFace: 'minimal' as WatchFaceId,
    setActiveFace: vi.fn(),
    activeWidget: 'heart_rate' as ActiveWidgetId,
    setActiveWidget: vi.fn(),
    heartRate: 74,
    isMeasuringHeartRate: false,
    heartRateStatus: 'Normal Resting Rate',
    measureHeartRate: vi.fn(),
    stepCount: 6420,
    stepGoal: 10000,
    stepMetrics: { progressPercent: 64, distanceKm: 4.89, caloriesBurned: 257 },
    addSteps: vi.fn(),
    resetSteps: vi.fn(),
    batteryLevel: 86,
    setBatteryLevel: vi.fn(),
    isCharging: false,
    toggleCharging: vi.fn(),
    isEcoMode: false,
    toggleEcoMode: vi.fn(),
    batteryEstimateHours: 41,
    weather: {
      tempC: 24,
      condition: 'Sunny',
      humidity: 48,
      uvIndex: 5,
      hourly: [],
    },
    isCelsius: true,
    toggleWeatherUnit: vi.fn(),
    currentTemperature: 24,
    currentTrack: TRACK_LIST[0],
    currentTrackIndex: 0,
    isPlayingMusic: false,
    toggleMusicPlay: vi.fn(),
    nextTrack: vi.fn(),
    prevTrack: vi.fn(),
    musicProgressSec: 42,
    equalizerBars: [20, 20, 20, 20, 20],
  };

  it('draws Minimal Face without errors', () => {
    const ctx = createMockContext();
    expect(() => drawMinimalFace(ctx, 512, new Date(), dummyState)).not.toThrow();
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('draws Neon Face without errors', () => {
    const ctx = createMockContext();
    expect(() => drawNeonFace(ctx, 512, new Date(), dummyState)).not.toThrow();
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('draws Chrono Face without errors', () => {
    const ctx = createMockContext();
    expect(() => drawChronoFace(ctx, 512, new Date(), dummyState)).not.toThrow();
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('draws Health Face without errors', () => {
    const ctx = createMockContext();
    expect(() => drawHealthFace(ctx, 512, new Date(), dummyState)).not.toThrow();
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('dispatches renderWatchFace for all face types', () => {
    const mockCanvas = {
      width: 512,
      height: 512,
      getContext: vi.fn(() => createMockContext()),
    } as unknown as HTMLCanvasElement;

    const faces: WatchFaceId[] = ['minimal', 'neon', 'chrono', 'health'];
    for (const face of faces) {
      expect(() => renderWatchFace(mockCanvas, face, new Date(), dummyState)).not.toThrow();
    }
  });
});

describe('WatchScreenTexture (WatchScreenManager)', () => {
  it('instantiates and disposes without memory leaks', () => {
    const manager = createWatchScreenManager(512);
    expect(manager.texture).toBeInstanceOf(THREE.CanvasTexture);
    expect(() => manager.dispose()).not.toThrow();
  });
});

describe('Interactive Smart Widgets React Components', () => {
  const dummyState = {
    activeFace: 'minimal' as WatchFaceId,
    setActiveFace: vi.fn(),
    activeWidget: 'heart_rate' as ActiveWidgetId,
    setActiveWidget: vi.fn(),
    heartRate: 74,
    isMeasuringHeartRate: false,
    heartRateStatus: 'Normal Resting Rate',
    measureHeartRate: vi.fn(),
    stepCount: 6420,
    stepGoal: 10000,
    stepMetrics: { progressPercent: 64, distanceKm: 4.89, caloriesBurned: 257 },
    addSteps: vi.fn(),
    resetSteps: vi.fn(),
    batteryLevel: 86,
    setBatteryLevel: vi.fn(),
    isCharging: false,
    toggleCharging: vi.fn(),
    isEcoMode: false,
    toggleEcoMode: vi.fn(),
    batteryEstimateHours: 41,
    weather: {
      tempC: 24,
      condition: 'Sunny',
      humidity: 48,
      uvIndex: 5,
      hourly: [
        { time: 'Now', tempC: 24, condition: 'Sunny' },
        { time: '14:00', tempC: 25, condition: 'Partly Cloudy' },
      ],
    },
    isCelsius: true,
    toggleWeatherUnit: vi.fn(),
    currentTemperature: 24,
    currentTrack: TRACK_LIST[0],
    currentTrackIndex: 0,
    isPlayingMusic: false,
    toggleMusicPlay: vi.fn(),
    nextTrack: vi.fn(),
    prevTrack: vi.fn(),
    musicProgressSec: 42,
    equalizerBars: [20, 20, 20, 20, 20],
  };

  it('renders HeartRateWidget with pulse readings and measure button', () => {
    render(React.createElement(HeartRateWidget, { simulator: dummyState }));
    expect(screen.getByText('Heart Rate ECG')).toBeDefined();
    expect(screen.getByText('74')).toBeDefined();
    expect(screen.getByText('Normal Resting Rate')).toBeDefined();

    const button = screen.getByText(/Measure Pulse Now/i);
    fireEvent.click(button);
    expect(dummyState.measureHeartRate).toHaveBeenCalled();
  });

  it('renders StepsWidget with step progress and add walk button', () => {
    render(React.createElement(StepsWidget, { simulator: dummyState }));
    expect(screen.getByText('Activity & Steps')).toBeDefined();
    expect(screen.getByText('6,420')).toBeDefined();
    expect(screen.getByText('4.89 km')).toBeDefined();
    expect(screen.getByText('257 kcal')).toBeDefined();

    const walkBtn = screen.getByText('+500 Steps Walk');
    fireEvent.click(walkBtn);
    expect(dummyState.addSteps).toHaveBeenCalledWith(500);
  });

  it('renders WeatherWidget with temperature and unit toggle', () => {
    render(React.createElement(WeatherWidget, { simulator: dummyState }));
    expect(screen.getByText('Weather & Forecast')).toBeDefined();
    expect(screen.getByText('24')).toBeDefined();
    expect(screen.getByText('Sunny')).toBeDefined();

    const unitBtn = screen.getByTitle('Toggle Celsius / Fahrenheit');
    fireEvent.click(unitBtn);
    expect(dummyState.toggleWeatherUnit).toHaveBeenCalled();
  });

  it('renders MusicWidget with track info and playback controls', () => {
    render(React.createElement(MusicWidget, { simulator: dummyState }));
    expect(screen.getByText('Music Player')).toBeDefined();
    expect(screen.getByText('Midnight Horizon')).toBeDefined();
    expect(screen.getByText('Aura Sounds')).toBeDefined();

    const playBtn = screen.getByTitle('Play');
    fireEvent.click(playBtn);
    expect(dummyState.toggleMusicPlay).toHaveBeenCalled();
  });

  it('renders BatteryWidget with charge status and eco mode button', () => {
    render(React.createElement(BatteryWidget, { simulator: dummyState }));
    expect(screen.getByText('Battery & Power')).toBeDefined();
    expect(screen.getAllByText('86%').length).toBeGreaterThanOrEqual(1);

    const ecoBtn = screen.getByText('Enable Eco Mode');
    fireEvent.click(ecoBtn);
    expect(dummyState.toggleEcoMode).toHaveBeenCalled();
  });

  it('renders StudioControls toolbar with face choices and preset triggers', () => {
    const dummyColor: ColorOption = {
      id: 'slate',
      name: 'Slate Silver',
      hex: '#CBD5E1',
      caseHex: '#E2E8F0',
      strapHex: '#94A3B8',
    };
    const onSelectFace = vi.fn();
    const onSelectPreset = vi.fn();
    const onToggleAutoRotate = vi.fn();
    const onToggleDrawer = vi.fn();

    render(
      React.createElement(StudioControls, {
        colors: [dummyColor],
        selectedColor: dummyColor,
        activeFace: 'minimal',
        onSelectFace: onSelectFace,
        activeCameraPreset: 'perspective',
        onSelectCameraPreset: onSelectPreset,
        isAutoRotating: false,
        onToggleAutoRotate: onToggleAutoRotate,
        isWidgetDrawerOpen: false,
        onToggleWidgetDrawer: onToggleDrawer,
      })
    );

    expect(screen.getByText('Minimal')).toBeDefined();
    expect(screen.getByText('Neon Cyber')).toBeDefined();
    expect(screen.getByText('Chrono Sub')).toBeDefined();
    expect(screen.getByText('Health Rings')).toBeDefined();

    const neonBtn = screen.getByText('Neon Cyber');
    fireEvent.click(neonBtn);
    expect(onSelectFace).toHaveBeenCalledWith('neon');

    const frontBtn = screen.getByText('Front');
    fireEvent.click(frontBtn);
    expect(onSelectPreset).toHaveBeenCalledWith('front');
  });
});

describe('WatchViewer3D Component Integration', () => {
  it('mounts cleanly and renders 3D studio container and drag overlay hint', () => {
    const { unmount } = render(
      React.createElement(WatchViewer3D, {
        modelType: 'watch_round',
        autoRotate: true,
        showControls: true,
      })
    );

    expect(screen.getByText(/Drag to orbit 360°/i)).toBeDefined();
    expect(screen.getByText('Titanium Slate')).toBeDefined();
    expect(screen.getByText('Minimal')).toBeDefined();

    // Verify unmount executes GPU disposal cleanly without errors
    expect(() => unmount()).not.toThrow();
  });

  it('renders with band_capsule and watch_squircle models', () => {
    const { unmount: unmountBand } = render(
      React.createElement(WatchViewer3D, {
        modelType: 'band_capsule',
        showControls: false,
      })
    );
    expect(screen.getByText(/Drag to orbit 360°/i)).toBeDefined();
    expect(() => unmountBand()).not.toThrow();

    const { unmount: unmountSquircle } = render(
      React.createElement(WatchViewer3D, {
        modelType: 'watch_squircle',
        showControls: false,
      })
    );
    expect(screen.getByText(/Drag to orbit 360°/i)).toBeDefined();
    expect(() => unmountSquircle()).not.toThrow();
  });

  it('handles user drag, wheel zoom, and camera preset button clicks', () => {
    const { container, unmount } = render(
      React.createElement(WatchViewer3D, {
        modelType: 'watch_round',
        showControls: true,
      })
    );

    // Pointer events on stage container
    const stage = container.querySelector('.cursor-grab') as HTMLElement;
    expect(stage).toBeDefined();

    if (stage) {
      fireEvent.pointerDown(stage, { clientX: 100, clientY: 100, pointerId: 1 });
      fireEvent.pointerMove(stage, { clientX: 120, clientY: 110, pointerId: 1 });
      fireEvent.pointerUp(stage, { clientX: 120, clientY: 110, pointerId: 1 });
      fireEvent.wheel(stage, { deltaY: 100, cancelable: true });
    }

    // Camera preset clicks
    const crownBtn = screen.getByText('Crown Detail');
    fireEvent.click(crownBtn);

    const profileBtn = screen.getByText('Side Profile');
    fireEvent.click(profileBtn);

    // Auto rotate toggle
    const rotateBtn = screen.getByTitle(/Auto-Rotation/i);
    fireEvent.click(rotateBtn);

    // Widget drawer toggle
    const widgetBtn = screen.getByText('Widgets');
    fireEvent.click(widgetBtn);
    expect(screen.getByText('ECG Pulse')).toBeDefined();

    expect(() => unmount()).not.toThrow();
  });
});
