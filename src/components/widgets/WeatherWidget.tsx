import React from 'react';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { celsiusToFahrenheit } from '../../hooks/useWatchSimulator';
import { Sun, CloudSun, Droplets, Compass, Thermometer } from 'lucide-react';

export interface WeatherWidgetProps {
  simulator: WatchSimulatorState;
  onClose?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ simulator, onClose }) => {
  const { weather, isCelsius, toggleWeatherUnit, currentTemperature } = simulator;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200/50">
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Weather & Forecast</h4>
            <p className="text-xs text-slate-500">San Francisco, CA</p>
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

      {/* Main Temperature & Condition */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50/60 via-purple-50/40 to-cyan-50/40 p-4 rounded-xl border border-amber-100/60">
        <div>
          <div className="flex items-start">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {currentTemperature}
            </span>
            <button
              onClick={toggleWeatherUnit}
              title="Toggle Celsius / Fahrenheit"
              className="ml-1 text-sm font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
            >
              °{isCelsius ? 'C' : 'F'}
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            {weather.condition}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-white/80 px-2 py-1 rounded-lg border border-purple-100">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            {weather.humidity}% Humidity
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-white/80 px-2 py-1 rounded-lg border border-purple-100">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            UV {weather.uvIndex} (Moderate)
          </span>
        </div>
      </div>

      {/* 3-Hour Mini Forecast */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
          <Thermometer className="w-3.5 h-3.5 text-purple-500" />
          3-Hour Outlook
        </p>
        <div className="grid grid-cols-4 gap-2">
          {weather.hourly.map((item, idx) => {
            const displayTemp = isCelsius ? item.tempC : celsiusToFahrenheit(item.tempC);
            return (
              <div
                key={idx}
                className="flex flex-col items-center py-2.5 px-1 rounded-xl bg-purple-50/40 border border-purple-100/80 text-center"
              >
                <span className="text-[11px] font-medium text-slate-500">{item.time}</span>
                <div className="my-1 text-amber-500">
                  {item.condition.includes('Sun') ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <CloudSun className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {displayTemp}°{isCelsius ? 'C' : 'F'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
