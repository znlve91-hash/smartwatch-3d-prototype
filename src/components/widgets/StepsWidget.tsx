import React from 'react';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { Footprints, Flame, Navigation, RotateCcw, Plus, Award } from 'lucide-react';

export interface StepsWidgetProps {
  simulator: WatchSimulatorState;
  onClose?: () => void;
}

export const StepsWidget: React.FC<StepsWidgetProps> = ({ simulator, onClose }) => {
  const { stepCount, stepGoal, stepMetrics, addSteps, resetSteps } = simulator;
  const { progressPercent, distanceKm, caloriesBurned } = stepMetrics;

  // SVG ring circumference calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/50">
            <Footprints className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Activity & Steps</h4>
            <p className="text-xs text-slate-500">10,000 Daily Goal</p>
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

      {/* Radial Progress + Key Numbers */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-cyan-50/50 to-purple-50/50 p-4 rounded-xl border border-cyan-100/60">
        {/* SVG Circular Progress Ring */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-purple-100"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#stepsGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-extrabold text-slate-900">{progressPercent}%</span>
            <span className="text-[10px] text-slate-400 font-medium">GOAL</span>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex-1">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stepCount.toLocaleString()}
          </span>
          <span className="ml-1 text-xs font-semibold text-slate-500">/ {stepGoal.toLocaleString()}</span>
          <p className="text-xs font-medium text-cyan-700 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            {progressPercent >= 100 ? 'Goal Completed!' : `${(stepGoal - stepCount > 0 ? stepGoal - stepCount : 0).toLocaleString()} steps left`}
          </p>
        </div>
      </div>

      {/* Telemetry Stats: Distance & Calories */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
          <Navigation className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Distance</p>
            <p className="text-sm font-bold text-slate-800">{distanceKm} km</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100">
          <Flame className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Active Burn</p>
            <p className="text-sm font-bold text-slate-800">{caloriesBurned} kcal</p>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => addSteps(500)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-md shadow-cyan-500/20 active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+500 Steps Walk</span>
        </button>

        <button
          onClick={resetSteps}
          title="Reset Step Counter"
          className="p-2.5 rounded-xl border border-purple-200 text-slate-600 hover:bg-purple-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
