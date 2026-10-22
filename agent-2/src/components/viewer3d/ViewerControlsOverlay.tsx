/**
 * ViewerControlsOverlay - Floating Studio Controls and Telemetry Widget Dock
 * Floating over the 3D viewport with auto-rotate toggle, camera angle presets,
 * reset view, and simulated telemetry widgets (HR test, steps booster, weather, music, battery).
 */

import React from 'react';
import {
  RotateCw,
  RotateCcw,
  Eye,
  Heart,
  Footprints,
  Sun,
  Cloud,
  CloudRain,
  Play,
  Pause,
  SkipForward,
  Battery,
  Activity,
  Compass,
} from 'lucide-react';
import { useViewer } from '../../context/ViewerContext';

export const ViewerControlsOverlay: React.FC = () => {
  const {
    selectedProduct,
    isAutoRotating,
    toggleAutoRotate,
    setCameraPreset,
    resetCamera,
    simulatedWidgets,
    measureHeartRate,
    addSteps,
    toggleWeather,
    toggleMusicPlay,
    nextTrack,
  } = useViewer();

  // Weather Icon Helper
  const renderWeatherIcon = () => {
    switch (simulatedWidgets.weather.condition) {
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-slate-500" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-cyan-600" />;
      case 'sunny':
      default:
        return <Sun className="w-4 h-4 text-amber-500 animate-[spin_12s_linear_infinite]" />;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none z-10">
      {/* Top Bar: Device Badge & Camera Toolbar */}
      <div className="flex items-start justify-between gap-3">
        {/* Active Device Tier Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-purple-100 shadow-sm text-xs font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          <span>{selectedProduct.name}</span>
          <span className="text-slate-400">|</span>
          <span className="text-violet-600 uppercase tracking-wider text-[10px]">
            {selectedProduct.tier.replace('_', ' ')}
          </span>
        </div>

        {/* Camera Preset & Turntable Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-100 shadow-sm">
          {/* Auto-Rotate Turntable Toggle */}
          <button
            onClick={toggleAutoRotate}
            title={isAutoRotating ? 'Pause auto-rotate' : 'Start turntable auto-rotate'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isAutoRotating
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Turntable</span>
          </button>

          {/* Quick Camera Presets */}
          <button
            onClick={() => setCameraPreset('front')}
            title="Front Face View"
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
          >
            Front
          </button>

          <button
            onClick={() => setCameraPreset('angle')}
            title="45° Angle Isometric View"
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
          >
            45°
          </button>

          <button
            onClick={() => setCameraPreset('side')}
            title="Side Profile View"
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
          >
            Side
          </button>

          <div className="w-[1px] h-4 bg-purple-100 my-auto mx-0.5" />

          {/* Reset View */}
          <button
            onClick={resetCamera}
            title="Reset camera viewpoint"
            aria-label="Reset camera viewpoint"
            className="p-1.5 rounded-xl text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Floating 360 Hint (Discreet) */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/10 backdrop-blur-sm text-[11px] font-medium text-slate-600">
          <Compass className="w-3.5 h-3.5 text-violet-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Drag to orbit 360° • Scroll to zoom</span>
        </div>
      </div>

      {/* Bottom Floating Interactive Telemetry Dock */}
      <div className="flex flex-col gap-2">
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.06)]">
          {/* 1. Heart Rate Telemetry Widget */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-rose-50/70 border border-rose-100">
            <Heart
              className={`w-4 h-4 text-rose-500 fill-rose-500 transition-transform ${
                simulatedWidgets.isMeasuringHeartRate
                  ? 'animate-ping'
                  : 'animate-pulse'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-rose-500">
                {simulatedWidgets.isMeasuringHeartRate ? 'Diagnostic' : 'Heart Rate'}
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                {simulatedWidgets.isMeasuringHeartRate
                  ? 'Measuring...'
                  : `${simulatedWidgets.heartRate} BPM`}
              </span>
            </div>
            <button
              onClick={measureHeartRate}
              disabled={simulatedWidgets.isMeasuringHeartRate}
              className="ml-1 px-2 py-0.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-100/60 rounded-md border border-rose-200 transition-colors disabled:opacity-50"
            >
              Test
            </button>
          </div>

          {/* 2. Step Counter Booster Widget */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-cyan-50/70 border border-cyan-100">
            <Footprints className="w-4 h-4 text-cyan-600" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-cyan-600">Steps</span>
              <span className="text-xs font-extrabold text-slate-900">
                {simulatedWidgets.steps.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => addSteps(100)}
                title="Add 100 steps"
                className="px-1.5 py-0.5 text-[10px] font-bold text-cyan-700 bg-white hover:bg-cyan-100 rounded border border-cyan-200 transition-colors"
              >
                +100
              </button>
              <button
                onClick={() => addSteps(500)}
                title="Add 500 steps"
                className="px-1.5 py-0.5 text-[10px] font-bold text-cyan-700 bg-white hover:bg-cyan-100 rounded border border-cyan-200 transition-colors"
              >
                +500
              </button>
            </div>
          </div>

          {/* 3. Weather Toggle Widget */}
          <button
            onClick={toggleWeather}
            title="Tap to change weather simulation"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-colors"
          >
            {renderWeatherIcon()}
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-amber-600">
                {simulatedWidgets.weather.city.split(',')[0]}
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                {simulatedWidgets.weather.temp}°C {simulatedWidgets.weather.condition}
              </span>
            </div>
          </button>

          {/* 4. Music Playback Simulator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-violet-50/70 border border-violet-100">
            <button
              onClick={toggleMusicPlay}
              title={simulatedWidgets.isPlayingMusic ? 'Pause track' : 'Play track'}
              className="p-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white transition-colors"
            >
              {simulatedWidgets.isPlayingMusic ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 translate-x-0.5" />
              )}
            </button>
            <div className="flex flex-col max-w-[90px] sm:max-w-[120px] overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-violet-600 truncate">
                {simulatedWidgets.isPlayingMusic ? 'Now Playing' : 'Paused'}
              </span>
              <span className="text-xs font-bold text-slate-900 truncate">
                {simulatedWidgets.currentTrack.title}
              </span>
            </div>
            <button
              onClick={nextTrack}
              title="Next Track"
              className="p-1 text-slate-500 hover:text-violet-600 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5. Battery Monitor */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <Battery className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">
              {simulatedWidgets.battery}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
