/**
 * ViewerContext - 3D Studio & Wearable Customizer State
 * Manages active product selection, chassis & strap color swatches,
 * active watch face, turntable auto-rotation, camera presets,
 * and simulated wearable telemetry (heart rate, steps, weather, music, battery).
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  ColorOption,
  MusicTrack,
  Product,
  SimulatedWidgets,
  WatchFaceId,
  WeatherData,
} from '../types';
import { DEFAULT_PRODUCT, getProductById, PRODUCTS } from '../data/products';
import {
  DEFAULT_PLAYLIST,
  getNextTrack,
  getNextWeather,
  simulateHeartRateMeasurement,
  WEATHER_PRESETS,
} from '../components/viewer3d/watchFaceCanvas';

export type CameraPreset = 'front' | 'angle' | 'side' | 'reset';

export interface ViewerContextType {
  // Device Configuration
  selectedProductId: string;
  selectedProduct: Product;
  setSelectedProductId: (id: string) => void;
  selectedChassisColor: ColorOption;
  setSelectedChassisColor: (color: ColorOption) => void;
  selectedStrapColor: ColorOption;
  setSelectedStrapColor: (color: ColorOption) => void;
  selectedWatchFace: WatchFaceId;
  setSelectedWatchFace: (face: WatchFaceId) => void;

  // Camera & Turntable Controls
  isAutoRotating: boolean;
  setIsAutoRotating: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAutoRotate: () => void;
  cameraPreset: CameraPreset | null;
  setCameraPreset: (preset: CameraPreset | null) => void;
  resetCamera: () => void;

  // Simulated Telemetry Widgets
  simulatedWidgets: SimulatedWidgets;
  measureHeartRate: () => void;
  addSteps: (amount: number) => void;
  toggleWeather: () => void;
  toggleMusicPlay: () => void;
  nextTrack: () => void;
  setBattery: (level: number) => void;
}

export const INITIAL_WIDGETS: SimulatedWidgets = {
  heartRate: 72,
  isMeasuringHeartRate: false,
  steps: 7420,
  stepGoal: 10000,
  isPlayingMusic: false,
  currentTrack: DEFAULT_PLAYLIST[0],
  weather: WEATHER_PRESETS[0],
  battery: 88,
};

const ViewerContext = createContext<ViewerContextType | undefined>(undefined);

export interface ViewerProviderProps {
  children: React.ReactNode;
  initialProductId?: string;
  initialWidgets?: Partial<SimulatedWidgets>;
}

export const ViewerProvider: React.FC<ViewerProviderProps> = ({
  children,
  initialProductId = DEFAULT_PRODUCT.id,
  initialWidgets = {},
}) => {
  const initialProduct = useMemo(
    () => getProductById(initialProductId) || DEFAULT_PRODUCT,
    [initialProductId]
  );

  const [selectedProductId, setSelectedProductIdState] = useState<string>(initialProduct.id);

  const selectedProduct = useMemo(() => {
    return getProductById(selectedProductId) || PRODUCTS[0];
  }, [selectedProductId]);

  const [selectedChassisColor, setSelectedChassisColor] = useState<ColorOption>(() => {
    const found = initialProduct.chassisColors.find(
      (c) => c.hex === initialProduct.defaultChassisColor
    );
    return found || initialProduct.chassisColors[0];
  });

  const [selectedStrapColor, setSelectedStrapColor] = useState<ColorOption>(() => {
    const found = initialProduct.strapColors.find(
      (c) => c.hex === initialProduct.defaultStrapColor
    );
    return found || initialProduct.strapColors[0];
  });

  const [selectedWatchFace, setSelectedWatchFace] = useState<WatchFaceId>(
    initialProduct.defaultFace || 'minimal'
  );

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>(null);

  const [simulatedWidgets, setSimulatedWidgets] = useState<SimulatedWidgets>({
    ...INITIAL_WIDGETS,
    ...initialWidgets,
  });

  // Handler for product switching: syncs default chassis, strap, and face
  const setSelectedProductId = useCallback((id: string) => {
    const prod = getProductById(id);
    if (prod) {
      setSelectedProductIdState(prod.id);
      const chassis = prod.chassisColors.find((c) => c.hex === prod.defaultChassisColor) || prod.chassisColors[0];
      const strap = prod.strapColors.find((c) => c.hex === prod.defaultStrapColor) || prod.strapColors[0];
      setSelectedChassisColor(chassis);
      setSelectedStrapColor(strap);
      setSelectedWatchFace(prod.defaultFace);
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const resetCamera = useCallback(() => {
    setCameraPreset('reset');
  }, []);

  // Telemetry: measure heart rate
  const measureHeartRate = useCallback(() => {
    setSimulatedWidgets((prev) => ({
      ...prev,
      isMeasuringHeartRate: true,
    }));

    const timer = setTimeout(() => {
      const reading = simulateHeartRateMeasurement();
      setSimulatedWidgets((prev) => ({
        ...prev,
        heartRate: reading,
        isMeasuringHeartRate: false,
      }));
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Telemetry: step counter increment
  const addSteps = useCallback((amount: number) => {
    setSimulatedWidgets((prev) => ({
      ...prev,
      steps: Math.max(0, prev.steps + amount),
    }));
  }, []);

  // Telemetry: cycle weather condition
  const toggleWeather = useCallback(() => {
    setSimulatedWidgets((prev) => ({
      ...prev,
      weather: getNextWeather(prev.weather),
    }));
  }, []);

  // Telemetry: music play/pause toggle
  const toggleMusicPlay = useCallback(() => {
    setSimulatedWidgets((prev) => ({
      ...prev,
      isPlayingMusic: !prev.isPlayingMusic,
    }));
  }, []);

  // Telemetry: next track
  const nextTrack = useCallback(() => {
    setSimulatedWidgets((prev) => ({
      ...prev,
      currentTrack: getNextTrack(prev.currentTrack),
    }));
  }, []);

  // Telemetry: set battery level
  const setBattery = useCallback((level: number) => {
    const clamped = Math.min(Math.max(Math.round(level), 0), 100);
    setSimulatedWidgets((prev) => ({
      ...prev,
      battery: clamped,
    }));
  }, []);

  const value = useMemo(
    () => ({
      selectedProductId,
      selectedProduct,
      setSelectedProductId,
      selectedChassisColor,
      setSelectedChassisColor,
      selectedStrapColor,
      setSelectedStrapColor,
      selectedWatchFace,
      setSelectedWatchFace,
      isAutoRotating,
      setIsAutoRotating,
      toggleAutoRotate,
      cameraPreset,
      setCameraPreset,
      resetCamera,
      simulatedWidgets,
      measureHeartRate,
      addSteps,
      toggleWeather,
      toggleMusicPlay,
      nextTrack,
      setBattery,
    }),
    [
      selectedProductId,
      selectedProduct,
      setSelectedProductId,
      selectedChassisColor,
      selectedStrapColor,
      selectedWatchFace,
      isAutoRotating,
      toggleAutoRotate,
      cameraPreset,
      resetCamera,
      simulatedWidgets,
      measureHeartRate,
      addSteps,
      toggleWeather,
      toggleMusicPlay,
      nextTrack,
      setBattery,
    ]
  );

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};

export function useViewer(): ViewerContextType {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
}
