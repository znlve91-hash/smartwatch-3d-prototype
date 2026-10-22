import React from 'react';
import type { Product, ColorOption, WatchFaceId, ActiveWidgetId } from '../../types';
import {
  RotateCw,
  Eye,
  Camera,
  Sliders,
  Sparkles,
  Compass,
  Activity,
  Heart,
  Footprints,
  Sun,
  Music,
  Battery,
} from 'lucide-react';

export type CameraPreset = 'front' | 'perspective' | 'crown' | 'profile';

export interface StudioControlsProps {
  product?: Product;
  colors?: ColorOption[];
  selectedColor?: ColorOption;
  onSelectColor?: (color: ColorOption) => void;

  activeFace: WatchFaceId;
  onSelectFace: (face: WatchFaceId) => void;

  activeCameraPreset?: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;

  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;

  isWidgetDrawerOpen: boolean;
  onToggleWidgetDrawer: () => void;

  activeWidget?: ActiveWidgetId | null;
  onSelectWidget?: (widget: ActiveWidgetId) => void;
  className?: string;
}

const WATCH_FACES: Array<{ id: WatchFaceId; label: string; tag: string }> = [
  { id: 'minimal', label: 'Minimal', tag: 'Classic' },
  { id: 'neon', label: 'Neon Cyber', tag: 'Glowing' },
  { id: 'chrono', label: 'Chrono Sub', tag: 'Precision' },
  { id: 'health', label: 'Health Rings', tag: 'Fitness' },
];

const CAMERA_PRESETS: Array<{ id: CameraPreset; label: string }> = [
  { id: 'front', label: 'Front' },
  { id: 'perspective', label: 'Perspective' },
  { id: 'crown', label: 'Crown Detail' },
  { id: 'profile', label: 'Side Profile' },
];

const WIDGET_TABS: Array<{ id: ActiveWidgetId; label: string; icon: React.ElementType }> = [
  { id: 'heart_rate', label: 'ECG Pulse', icon: Heart },
  { id: 'steps', label: '10k Steps', icon: Footprints },
  { id: 'weather', label: 'Weather', icon: Sun },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'battery', label: 'Battery', icon: Battery },
];

export const StudioControls: React.FC<StudioControlsProps> = ({
  product,
  colors,
  selectedColor,
  onSelectColor,
  activeFace,
  onSelectFace,
  activeCameraPreset = 'perspective',
  onSelectCameraPreset,
  isAutoRotating,
  onToggleAutoRotate,
  isWidgetDrawerOpen,
  onToggleWidgetDrawer,
  activeWidget,
  onSelectWidget,
  className = '',
}) => {
  const availableColors = colors || product?.colors || [];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Main Studio Toolbar Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-100 shadow-lg shadow-purple-500/5">
        {/* Section 1: Color Swatches */}
        {availableColors.length > 0 && onSelectColor && (
          <div className="flex items-center gap-2 border-r border-purple-100 pr-3 mr-1">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Color</span>
            <div className="flex items-center gap-1.5">
              {availableColors.map((c) => {
                const isSelected = selectedColor?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectColor(c)}
                    title={c.name}
                    className={`relative w-7 h-7 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-purple-600 ring-offset-2 ring-offset-white scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.caseHex || c.hex }}
                  >
                    {/* Two-tone indicator if strapHex is distinct */}
                    {c.strapHex && c.strapHex !== (c.caseHex || c.hex) && (
                      <span
                        className="absolute inset-y-0 right-0 w-1/2 rounded-r-full opacity-80"
                        style={{ backgroundColor: c.strapHex }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Watch Face Picker */}
        <div className="flex items-center gap-1.5 border-r border-purple-100 pr-3 mr-1">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">Face</span>
          <div className="flex items-center gap-1 bg-purple-50/70 p-1 rounded-xl border border-purple-100/60">
            {WATCH_FACES.map((face) => {
              const isActive = activeFace === face.id;
              return (
                <button
                  key={face.id}
                  onClick={() => onSelectFace(face.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-white/80'
                  }`}
                >
                  {face.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Camera Presets */}
        <div className="flex items-center gap-1.5 border-r border-purple-100 pr-3 mr-1">
          <Camera className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
          <div className="flex items-center gap-1">
            {CAMERA_PRESETS.map((preset) => {
              const isActive = activeCameraPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectCameraPreset(preset.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Auto-Rotate & Widgets Toggles */}
        <div className="flex items-center gap-2">
          {/* Auto-Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            title={isAutoRotating ? 'Pause Auto-Rotation' : 'Start 360° Auto-Rotation'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAutoRotating
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100/80 border border-purple-200/50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAutoRotating ? 'Spinning' : '360° Orbit'}</span>
          </button>

          {/* Widget Simulator Drawer Toggle */}
          <button
            onClick={onToggleWidgetDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isWidgetDrawerOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white border border-purple-200 text-slate-700 hover:border-purple-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Widgets</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
              5
            </span>
          </button>
        </div>
      </div>

      {/* Sub-bar for Direct Widget Switching (when drawer is open) */}
      {isWidgetDrawerOpen && onSelectWidget && (
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100/80 backdrop-blur-md overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 ml-1 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Simulate:
          </span>
          {WIDGET_TABS.map((w) => {
            const Icon = w.icon;
            const isTabActive = activeWidget === w.id;
            return (
              <button
                key={w.id}
                onClick={() => onSelectWidget(w.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isTabActive
                    ? 'bg-white text-purple-800 shadow-sm border border-purple-200/60'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>{w.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
