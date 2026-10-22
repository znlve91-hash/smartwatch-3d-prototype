import React, { useEffect, useRef, useState } from 'react';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { generateECGWave } from '../../hooks/useWatchSimulator';
import { Heart, Activity, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export interface HeartRateWidgetProps {
  simulator: WatchSimulatorState;
  onClose?: () => void;
}

export const HeartRateWidget: React.FC<HeartRateWidgetProps> = ({ simulator, onClose }) => {
  const { heartRate, isMeasuringHeartRate, heartRateStatus, measureHeartRate } = simulator;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pulseScale, setPulseScale] = useState(1);

  // Animate ECG sparkline canvas
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG waveform
      const sampleCount = 90;
      const points = generateECGWave(sampleCount, heartRate, phase);

      ctx.beginPath();
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const centerY = height / 2;
      const scaleY = (height / 2) * 0.75;

      points.forEach((val, index) => {
        const x = (index / (sampleCount - 1)) * width;
        const y = centerY - val * scaleY;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Glowing dot at current leading pulse
      const lastIndex = points.length - 1;
      const lastX = width;
      const lastY = centerY - points[lastIndex] * scaleY;
      ctx.beginPath();
      ctx.arc(lastX - 4, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Phase progression matches current heart rate
      phase += (heartRate / 60) * 0.015;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [heartRate]);

  // Pulse effect trigger
  useEffect(() => {
    setPulseScale(1.15);
    const timer = setTimeout(() => setPulseScale(1), 220);
    return () => clearTimeout(timer);
  }, [heartRate]);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/50">
            <Heart
              className="w-5 h-5 transition-transform duration-200 text-rose-500 fill-rose-500"
              style={{ transform: `scale(${pulseScale})` }}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Heart Rate ECG</h4>
            <p className="text-xs text-slate-500">Optical PPG Bio-Sensor</p>
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

      {/* Main Readout */}
      <div className="flex items-baseline justify-between bg-gradient-to-r from-purple-50/60 to-cyan-50/40 p-4 rounded-xl border border-purple-100/50">
        <div>
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {heartRate}
          </span>
          <span className="ml-1.5 text-sm font-semibold text-purple-700">BPM</span>
          <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            {heartRateStatus}
          </p>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-100/70 text-cyan-800">
            <Zap className="w-3 h-3 text-cyan-600" />
            98% SpO2
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Resting: 60-100 BPM</p>
        </div>
      </div>

      {/* Real-time ECG Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900/5 border border-purple-100">
        <canvas
          ref={canvasRef}
          width={320}
          height={90}
          className="w-full h-[90px] block"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-mono text-purple-600 font-semibold bg-white/80 px-1.5 py-0.5 rounded">
          <Activity className="w-3 h-3" />
          <span>LEAD-I ECG</span>
        </div>
      </div>

      {/* Action Simulation Button */}
      <button
        onClick={measureHeartRate}
        disabled={isMeasuringHeartRate}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 active:scale-[0.99] transition-all disabled:opacity-75"
      >
        <RefreshCw className={`w-4 h-4 ${isMeasuringHeartRate ? 'animate-spin' : ''}`} />
        <span>{isMeasuringHeartRate ? 'Measuring Bio-Pulse...' : 'Measure Pulse Now (68-128 BPM)'}</span>
      </button>
    </div>
  );
};
