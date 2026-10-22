/**
 * Interactive Floating 3D Viewer Control Dock
 * Switch models, watch faces, simulated widgets, colorways, and camera controls
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Heart,
  Footprints,
  CloudSun,
  Music,
  Battery,
  Activity,
  Sparkles,
  Clock,
  Palette,
} from 'lucide-react';
import { WATCH_FACES } from '../../data/watchFaces.js';
import { WIDGETS } from '../../data/widgets.js';

export const COLORWAYS = [
  {
    id: 'midnight-black',
    name: 'Midnight Black',
    hex: '#1E293B',
    chassisHex: '#0F172A',
    strapHex: '#1E293B',
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    hex: '#7C3AED',
    chassisHex: '#5B21B6',
    strapHex: '#7C3AED',
  },
  {
    id: 'glacier-cyan',
    name: 'Glacier Cyan',
    hex: '#06B6D4',
    chassisHex: '#0891B2',
    strapHex: '#06B6D4',
  },
  {
    id: 'starlight-silver',
    name: 'Starlight Silver',
    hex: '#CBD5E1',
    chassisHex: '#94A3B8',
    strapHex: '#E2E8F0',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    hex: '#FB7185',
    chassisHex: '#E11D48',
    strapHex: '#FDA4AF',
  },
  {
    id: 'alpine-green',
    name: 'Alpine Green',
    hex: '#10B981',
    chassisHex: '#047857',
    strapHex: '#059669',
  },
];

const WIDGET_ICONS = {
  heartRate: Heart,
  steps: Footprints,
  weather: CloudSun,
  music: Music,
  battery: Battery,
};

const FACE_ICONS = {
  minimal: Clock,
  neon: Sparkles,
  chrono: Clock,
  health: Activity,
};

export function ViewerControls({
  activeModel = 'watch',
  onModelChange,
  activeFace = 'minimal',
  onFaceChange,
  activeWidget = 'heartRate',
  onWidgetChange,
  onWidgetAction,
  selectedColor,
  onColorChange,
  autoRotate = true,
  onToggleAutoRotate,
  onResetView,
  onZoomIn,
  onZoomOut,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-purple-900/5 text-slate-800 transition-all ${className}`}
      data-testid="viewer-controls"
    >
      {/* Top Bar: Model Switcher & Camera Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        {/* Model Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onModelChange && onModelChange('watch')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeModel === 'watch'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Watch
          </button>
          <button
            type="button"
            onClick={() => onModelChange && onModelChange('band')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeModel === 'band'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Band
          </button>
        </div>

        {/* Camera & Orbit Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Pause 360° Spin (1.5 RPM)' : 'Start 360° Auto-Spin'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              autoRotate
                ? 'bg-purple-100 text-purple-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Auto-Spin' : 'Spin'}</span>
          </button>

          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onResetView}
            title="Reset View to Front"
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Watch Faces Switcher */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Watch Face Preset
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {WATCH_FACES.map((face) => {
            const Icon = FACE_ICONS[face.id] || Clock;
            const isSelected = activeFace === face.id;
            return (
              <button
                key={face.id}
                type="button"
                onClick={() => onFaceChange && onFaceChange(face.id)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate text-[11px] font-semibold">{face.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Widgets Test Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Interactive Widgets
          </span>
          <span className="text-[10px] text-purple-600 font-medium">Click to test simulator</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {WIDGETS.map((widget) => {
            const Icon = WIDGET_ICONS[widget.id] || Heart;
            const isSelected = activeWidget === widget.id;
            return (
              <button
                key={widget.id}
                type="button"
                onClick={() => {
                  if (onWidgetChange) onWidgetChange(widget.id);
                  if (onWidgetAction) onWidgetAction(widget.id);
                }}
                title={`Simulate ${widget.name}`}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 ring-2 ring-cyan-400/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate text-[10px] font-semibold">{widget.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colorway / Strap & Chassis Swatches */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Colorway & Strap
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {COLORWAYS.map((c) => {
            const isSelected = selectedColor?.id === c.id || selectedColor?.hex === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onColorChange && onColorChange(c)}
                title={c.name}
                className={`group relative flex items-center justify-center w-7 h-7 rounded-full transition-transform ${
                  isSelected ? 'scale-110 ring-2 ring-purple-600 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.strapHex || c.hex }}
              >
                {/* Dual swatch indicator (chassis inner circle) */}
                <span
                  className="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                  style={{ backgroundColor: c.chassisHex || c.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
