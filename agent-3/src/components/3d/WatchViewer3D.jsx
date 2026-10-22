/**
 * Interactive 3D Wearable Viewport Component
 * 360-degree Orbit, Touch Rotation, 1.5 RPM Auto-Spin, Zoom, and Dock Controls
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Compass, Sparkles } from 'lucide-react';
import { use3DWatch } from '../../hooks/use3DWatch.js';
import { ViewerControls, COLORWAYS } from './ViewerControls.jsx';
import {
  WIDGETS,
  simulateNextHeartRate,
  incrementSteps,
  toggleMusicPlayback,
  toggleLowPowerMode,
} from '../../data/widgets.js';

export function WatchViewer3D({
  modelType: propModelType,
  tier: propTier,
  color: propColor,
  activeFace: propFace,
  activeWidget: propWidget,
  widgetState: propWidgetState,
  autoRotate: propAutoRotate,
  showControls = true,
  onModelChange: propOnModelChange,
  onFaceChange: propOnFaceChange,
  onWidgetChange: propOnWidgetChange,
  onColorChange: propOnColorChange,
  className = '',
}) {
  // Container ref for Three.js WebGL canvas mount
  const containerRef = useRef(null);

  // Controlled or uncontrolled internal states
  const [localModelType, setLocalModelType] = useState('watch');
  const [localTier, setLocalTier] = useState('pro');
  const [localColor, setLocalColor] = useState(COLORWAYS[0]);
  const [localFace, setLocalFace] = useState('minimal');
  const [localWidget, setLocalWidget] = useState('heartRate');
  const [localAutoRotate, setLocalAutoRotate] = useState(true);

  // Initial widget states dictionary
  const [widgetStates, setWidgetStates] = useState(() => {
    const states = {};
    WIDGETS.forEach((w) => {
      states[w.id] = { ...w.initialState };
    });
    return states;
  });

  const activeModel = propModelType ?? localModelType;
  const activeTier = propTier ?? localTier;
  const activeColor = propColor ?? localColor;
  const activeFace = propFace ?? localFace;
  const activeWidget = propWidget ?? localWidget;
  const autoRotate = propAutoRotate ?? localAutoRotate;
  const currentWidgetState = propWidgetState ?? (widgetStates[activeWidget] || {});

  // Handle widget simulator interactions
  const handleWidgetAction = useCallback((widgetId) => {
    setWidgetStates((prev) => {
      const current = prev[widgetId] || {};
      let updated = { ...current };

      switch (widgetId) {
        case 'heartRate':
          updated.bpm = simulateNextHeartRate(current.bpm ?? 78);
          break;
        case 'steps':
          updated = incrementSteps(current, 350);
          break;
        case 'weather':
          updated.tempC = current.tempC === 24 ? 26 : 24;
          updated.tempF = current.tempF === 75 ? 79 : 75;
          updated.condition = current.condition === 'Partly Sunny' ? 'Clear Sky' : 'Partly Sunny';
          break;
        case 'music':
          updated = toggleMusicPlayback(current);
          break;
        case 'battery':
          updated = toggleLowPowerMode(current);
          break;
        default:
          break;
      }

      return {
        ...prev,
        [widgetId]: updated,
      };
    });
  }, []);

  // Connect 3D rendering hook
  const { resetView, zoomIn, zoomOut } = use3DWatch({
    containerRef,
    modelType: activeModel,
    tier: activeTier,
    chassisColor: activeColor.chassisHex || activeColor.hex || '#0F172A',
    strapColor: activeColor.strapHex || activeColor.hex || '#1E293B',
    accentColor: '#7C3AED',
    faceId: activeFace,
    widgetId: activeWidget,
    widgetState: currentWidgetState,
    autoRotate,
  });

  const handleToggleAutoRotate = () => {
    setLocalAutoRotate((prev) => !prev);
  };

  const handleModelChange = (model) => {
    if (propOnModelChange) propOnModelChange(model);
    else setLocalModelType(model);
  };

  const handleFaceChange = (face) => {
    if (propOnFaceChange) propOnFaceChange(face);
    else setLocalFace(face);
  };

  const handleWidgetChange = (widget) => {
    if (propOnWidgetChange) propOnWidgetChange(widget);
    else setLocalWidget(widget);
  };

  const handleColorChange = (col) => {
    if (propOnColorChange) propOnColorChange(col);
    else setLocalColor(col);
  };

  return (
    <div
      className={`relative w-full h-[540px] md:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F1EDFF] via-[#F8F6FF] to-[#EBF4FF] select-none flex flex-col justify-between ${className}`}
      data-testid="watch-viewer-3d"
    >
      {/* 3D WebGL Canvas Mounting Point */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
        title="Click and drag to rotate 360° • Scroll or pinch to zoom"
      />

      {/* Top Floating Badge & Quick Actions */}
      <div className="relative z-10 flex items-center justify-between p-4 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm pointer-events-auto">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">
            {activeModel === 'watch' ? 'Interactive Smart Watch' : 'Interactive Smart Band'}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {activeTier.replace('_', ' ')}
          </span>
        </div>

        {/* View Controls Quick Pill */}
        <div className="flex items-center gap-1.5 bg-white/75 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-sm pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            title={autoRotate ? 'Pause 360° spin' : 'Start 360° auto-spin (1.5 RPM)'}
            className={`p-1.5 rounded-full transition-all ${
              autoRotate ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={zoomIn}
            title="Zoom In"
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={zoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={resetView}
            title="Reset to Front View"
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 3D Interaction Hint */}
      <div className="relative z-10 self-center pointer-events-none mb-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/10 backdrop-blur-sm text-[11px] text-slate-600">
          <Compass className="w-3.5 h-3.5" />
          <span>Drag to rotate 360° • Scroll to zoom</span>
        </div>
      </div>

      {/* Bottom Floating Controls Dock */}
      {showControls && (
        <div className="relative z-10 p-4 max-w-xl mx-auto w-full pointer-events-auto">
          <ViewerControls
            activeModel={activeModel}
            onModelChange={handleModelChange}
            activeFace={activeFace}
            onFaceChange={handleFaceChange}
            activeWidget={activeWidget}
            onWidgetChange={handleWidgetChange}
            onWidgetAction={handleWidgetAction}
            selectedColor={activeColor}
            onColorChange={handleColorChange}
            autoRotate={autoRotate}
            onToggleAutoRotate={handleToggleAutoRotate}
            onResetView={resetView}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
        </div>
      )}
    </div>
  );
}
