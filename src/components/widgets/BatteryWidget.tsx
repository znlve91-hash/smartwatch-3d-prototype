import React from 'react';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { Battery, BatteryCharging, Zap, Leaf, Sparkles, AlertCircle } from 'lucide-react';

export interface BatteryWidgetProps {
  simulator: WatchSimulatorState;
  onClose?: () => void;
}

export const BatteryWidget: React.FC<BatteryWidgetProps> = ({ simulator, onClose }) => {
  const {
    batteryLevel,
    setBatteryLevel,
    isCharging,
    toggleCharging,
    isEcoMode,
    toggleEcoMode,
    batteryEstimateHours,
  } = simulator;

  // Color mapping based on level
  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'from-rose-500 to-amber-500';
    if (level <= 50) return 'from-amber-500 to-emerald-500';
    return 'from-emerald-500 to-cyan-500';
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
            {isCharging ? (
              <BatteryCharging className="w-5 h-5 text-emerald-600 animate-pulse" />
            ) : (
              <Battery className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Battery & Power</h4>
            <p className="text-xs text-slate-500">Dual-cell Li-Po Architecture</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Charge Meter */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 p-4 rounded-xl border border-emerald-100/60">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {batteryLevel}%
            </span>
            {isCharging && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 ml-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                Charging
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Est. ~{batteryEstimateHours} hrs remaining {isEcoMode && '(Eco Extended)'}
          </p>
        </div>

        {/* Battery Physical Visual Meter */}
        <div className="w-20 h-10 border-2 border-slate-700 rounded-lg p-1 relative flex items-center bg-slate-900/5">
          <div
            className={`h-full rounded bg-gradient-to-r ${getBatteryColor(
              batteryLevel
            )} transition-all duration-300`}
            style={{ width: `${batteryLevel}%` }}
          />
          {/* Terminal pip */}
          <div className="absolute -right-2 top-2.5 w-1.5 h-5 bg-slate-700 rounded-r-sm" />
        </div>
      </div>

      {/* Battery Adjustment Slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Simulate Charge Level</span>
          <span className="font-bold text-slate-700">{batteryLevel}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={batteryLevel}
          onChange={(e) => setBatteryLevel(Number(e.target.value))}
          className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer"
        />
      </div>

      {/* Toggles: Charger & Eco Mode */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={toggleCharging}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            isCharging
              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Zap className={`w-4 h-4 ${isCharging ? 'fill-emerald-600 text-emerald-600' : ''}`} />
          <span>{isCharging ? 'Charger Plugged' : 'Plug In Charger'}</span>
        </button>

        <button
          onClick={toggleEcoMode}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            isEcoMode
              ? 'bg-cyan-100/70 border-cyan-300 text-cyan-800 ring-2 ring-cyan-400/30'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Leaf className={`w-4 h-4 ${isEcoMode ? 'fill-cyan-600 text-cyan-600' : ''}`} />
          <span>{isEcoMode ? 'Eco Mode Active' : 'Enable Eco Mode'}</span>
        </button>
      </div>

      {isEcoMode && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-50/70 text-cyan-800 border border-cyan-200 text-[11px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-cyan-600" />
          <span>Power-Saving Mode dims display refresh and throttles background sensor sampling.</span>
        </div>
      )}
    </div>
  );
};
