import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { WatchFaceId, ActiveWidgetId } from '../types';

export interface Track {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  albumArtColor: string;
}

export const TRACK_LIST: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Horizon',
    artist: 'Aura Sounds',
    durationSec: 195,
    albumArtColor: '#7C3AED',
  },
  {
    id: 'track-2',
    title: 'Cyber Pulse',
    artist: 'Neon Drive',
    durationSec: 210,
    albumArtColor: '#06B6D4',
  },
  {
    id: 'track-3',
    title: 'Solar Drift',
    artist: 'Cosmic Echoes',
    durationSec: 180,
    albumArtColor: '#8B5CF6',
  },
  {
    id: 'track-4',
    title: 'Deep Focus',
    artist: 'Lumina Ambient',
    durationSec: 240,
    albumArtColor: '#3B82F6',
  },
];

export interface HourlyForecast {
  time: string;
  tempC: number;
  condition: string;
}

export const DEFAULT_FORECAST: HourlyForecast[] = [
  { time: 'Now', tempC: 24, condition: 'Sunny' },
  { time: '14:00', tempC: 25, condition: 'Partly Cloudy' },
  { time: '15:00', tempC: 26, condition: 'Sunny' },
  { time: '16:00', tempC: 23, condition: 'Clear' },
];

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function calculateStepMetrics(steps: number, goal = 10000): {
  progressPercent: number;
  distanceKm: number;
  caloriesBurned: number;
} {
  const safeSteps = Math.max(0, steps);
  const progressPercent = clamp(Math.round((safeSteps / goal) * 100), 0, 100);
  const distanceKm = parseFloat((safeSteps * 0.000762).toFixed(2));
  const caloriesBurned = Math.round(safeSteps * 0.04);

  return {
    progressPercent,
    distanceKm,
    caloriesBurned,
  };
}

export function generateECGWave(sampleCount: number, bpm = 72, phase = 0): number[] {
  const points: number[] = [];
  const cycles = (bpm / 60) * 1.5;

  for (let i = 0; i < sampleCount; i++) {
    const t = ((i / sampleCount) * cycles + phase) % 1.0;
    let y = 0;

    // Baseline slight drift
    y += 0.05 * Math.sin(t * Math.PI * 2);

    // P-wave (at t ~ 0.15)
    if (t > 0.1 && t < 0.22) {
      const pPhase = (t - 0.16) / 0.06;
      y += 0.18 * Math.exp(-Math.pow(pPhase * 2.5, 2));
    }

    // Q-dip (at t ~ 0.27)
    if (t > 0.25 && t < 0.29) {
      y -= 0.15 * Math.sin(((t - 0.25) / 0.04) * Math.PI);
    }

    // R-peak (at t ~ 0.32) - sharp high spike
    if (t > 0.28 && t < 0.36) {
      const rPhase = (t - 0.32) / 0.04;
      y += 0.95 * Math.exp(-Math.pow(rPhase * 3.5, 2));
    }

    // S-dip (at t ~ 0.38)
    if (t > 0.35 && t < 0.42) {
      y -= 0.28 * Math.exp(-Math.pow(((t - 0.385) / 0.035) * 3, 2));
    }

    // T-wave (at t ~ 0.55)
    if (t > 0.46 && t < 0.68) {
      const tPhase = (t - 0.57) / 0.11;
      y += 0.32 * Math.exp(-Math.pow(tPhase * 2.2, 2));
    }

    points.push(clamp(parseFloat(y.toFixed(3)), -1, 1));
  }

  return points;
}

export function calculateBatteryEstimate(level: number, isEco: boolean): number {
  const safeLevel = clamp(level, 0, 100);
  const baseHours = Math.round((safeLevel / 100) * 48);
  if (isEco) {
    return Math.round(baseHours * 1.75);
  }
  return baseHours;
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export interface WatchSimulatorState {
  activeFace: WatchFaceId;
  setActiveFace: (face: WatchFaceId) => void;
  activeWidget: ActiveWidgetId | null;
  setActiveWidget: (widget: ActiveWidgetId | null) => void;

  // Heart Rate
  heartRate: number;
  isMeasuringHeartRate: boolean;
  heartRateStatus: string;
  measureHeartRate: () => void;

  // Steps
  stepCount: number;
  stepGoal: number;
  stepMetrics: {
    progressPercent: number;
    distanceKm: number;
    caloriesBurned: number;
  };
  addSteps: (count?: number) => void;
  resetSteps: () => void;

  // Battery
  batteryLevel: number;
  setBatteryLevel: (level: number) => void;
  isCharging: boolean;
  toggleCharging: () => void;
  isEcoMode: boolean;
  toggleEcoMode: () => void;
  batteryEstimateHours: number;

  // Weather
  weather: {
    tempC: number;
    condition: string;
    humidity: number;
    uvIndex: number;
    hourly: HourlyForecast[];
  };
  isCelsius: boolean;
  toggleWeatherUnit: () => void;
  currentTemperature: number;

  // Music
  currentTrack: Track;
  currentTrackIndex: number;
  isPlayingMusic: boolean;
  toggleMusicPlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  musicProgressSec: number;
  equalizerBars: number[];
}

export function useWatchSimulator(initialFace: WatchFaceId = 'minimal'): WatchSimulatorState {
  const [activeFace, setActiveFace] = useState<WatchFaceId>(initialFace);
  const [activeWidget, setActiveWidget] = useState<ActiveWidgetId | null>('heart_rate');

  // Heart Rate State
  const [heartRate, setHeartRate] = useState<number>(72);
  const [isMeasuringHeartRate, setIsMeasuringHeartRate] = useState<boolean>(false);
  const [heartRateStatus, setHeartRateStatus] = useState<string>('Normal Resting Rate');
  const measureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, []);

  const measureHeartRate = useCallback(() => {
    setIsMeasuringHeartRate(true);
    // Simulate realistic fluctuation between 68 and 128 BPM
    const randomBpm = Math.floor(Math.random() * (128 - 68 + 1)) + 68;
    setHeartRate(randomBpm);

    if (randomBpm < 70) {
      setHeartRateStatus('Resting Rate');
    } else if (randomBpm <= 88) {
      setHeartRateStatus('Normal Resting Rate');
    } else if (randomBpm <= 110) {
      setHeartRateStatus('Optimal Active Rate');
    } else {
      setHeartRateStatus('Elevated Heart Rate');
    }

    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }
    measureTimeoutRef.current = setTimeout(() => {
      setIsMeasuringHeartRate(false);
    }, 600);
  }, []);

  // Steps State
  const [stepCount, setStepCount] = useState<number>(6420);
  const stepGoal = 10000;

  const stepMetrics = useMemo(() => {
    return calculateStepMetrics(stepCount, stepGoal);
  }, [stepCount, stepGoal]);

  const addSteps = useCallback((count = 500) => {
    setStepCount((prev) => prev + count);
  }, []);

  const resetSteps = useCallback(() => {
    setStepCount(0);
  }, []);

  // Battery State
  const [batteryLevel, setBatteryLevelRaw] = useState<number>(86);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isEcoMode, setIsEcoMode] = useState<boolean>(false);

  const setBatteryLevel = useCallback((lvl: number) => {
    setBatteryLevelRaw(clamp(lvl, 0, 100));
  }, []);

  const toggleCharging = useCallback(() => {
    setIsCharging((prev) => !prev);
  }, []);

  const toggleEcoMode = useCallback(() => {
    setIsEcoMode((prev) => !prev);
  }, []);

  const batteryEstimateHours = useMemo(() => {
    return calculateBatteryEstimate(batteryLevel, isEcoMode);
  }, [batteryLevel, isEcoMode]);

  // Weather State
  const [weather] = useState({
    tempC: 24,
    condition: 'Sunny',
    humidity: 48,
    uvIndex: 5,
    hourly: DEFAULT_FORECAST,
  });
  const [isCelsius, setIsCelsius] = useState<boolean>(true);

  const toggleWeatherUnit = useCallback(() => {
    setIsCelsius((prev) => !prev);
  }, []);

  const currentTemperature = useMemo(() => {
    return isCelsius ? weather.tempC : celsiusToFahrenheit(weather.tempC);
  }, [isCelsius, weather.tempC]);

  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicProgressSec] = useState<number>(42);

  const currentTrack = useMemo(() => {
    return TRACK_LIST[currentTrackIndex] || TRACK_LIST[0];
  }, [currentTrackIndex]);

  const toggleMusicPlay = useCallback(() => {
    setIsPlayingMusic((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACK_LIST.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACK_LIST.length) % TRACK_LIST.length);
  }, []);

  const equalizerBars = useMemo(() => {
    if (!isPlayingMusic) {
      return [18, 12, 15, 10, 14];
    }
    return [65, 88, 42, 95, 70];
  }, [isPlayingMusic]);

  return {
    activeFace,
    setActiveFace,
    activeWidget,
    setActiveWidget,

    // Heart Rate
    heartRate,
    isMeasuringHeartRate,
    heartRateStatus,
    measureHeartRate,

    // Steps
    stepCount,
    stepGoal,
    stepMetrics,
    addSteps,
    resetSteps,

    // Battery
    batteryLevel,
    setBatteryLevel,
    isCharging,
    toggleCharging,
    isEcoMode,
    toggleEcoMode,
    batteryEstimateHours,

    // Weather
    weather,
    isCelsius,
    toggleWeatherUnit,
    currentTemperature,

    // Music
    currentTrack,
    currentTrackIndex,
    isPlayingMusic,
    toggleMusicPlay,
    nextTrack,
    prevTrack,
    musicProgressSec,
    equalizerBars,
  };
}
