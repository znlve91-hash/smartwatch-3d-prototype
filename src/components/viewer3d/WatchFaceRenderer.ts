import type { WatchFaceId } from '../../types';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { generateECGWave } from '../../hooks/useWatchSimulator';

export interface WatchFaceRenderOptions {
  faceId: WatchFaceId;
  time?: Date;
  simulatorState: WatchSimulatorState;
}

export function drawMinimalFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  time: Date,
  state: WatchSimulatorState
): void {
  const cx = size / 2;
  const cy = size / 2;

  // Background
  ctx.fillStyle = '#080B14';
  ctx.fillRect(0, 0, size, size);

  // Subtle radial gradient center glow
  const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.45);
  radial.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Minimal Hour Markers
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const isMajor = i % 3 === 0;
    const r1 = size * 0.42;
    const r2 = isMajor ? size * 0.38 : size * 0.40;

    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.sin(angle) * r1, -Math.cos(angle) * r1);
    ctx.lineTo(Math.sin(angle) * r2, -Math.cos(angle) * r2);
    ctx.stroke();
  }
  ctx.restore();

  // Date Pill at top
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dateStr = `${days[time.getDay()]} ${time.getDate()} ${months[time.getMonth()]}`;

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 13px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dateStr, cx, cy - 80);

  // Big Digital Clock
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 76px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, cy - 10);

  // Seconds display
  const seconds = time.getSeconds().toString().padStart(2, '0');
  ctx.fillStyle = '#06B6D4';
  ctx.font = '600 18px Inter, -apple-system, sans-serif';
  ctx.fillText(`${seconds}s`, cx, cy + 36);

  // Bottom Status Pills (Battery & Heart Rate)
  const pillY = cy + 90;

  // Battery pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(cx - 100, pillY - 14, 90, 28, 14);
  ctx.fill();

  ctx.fillStyle = '#A78BFA';
  ctx.font = '600 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`⚡ ${state.batteryLevel}%`, cx - 55, pillY);

  // Steps pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(cx + 10, pillY - 14, 90, 28, 14);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.fillText(`👟 ${state.stepCount > 9999 ? (state.stepCount / 1000).toFixed(1) + 'k' : state.stepCount}`, cx + 55, pillY);
}

export function drawNeonFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  time: Date,
  state: WatchSimulatorState
): void {
  const cx = size / 2;
  const cy = size / 2;

  // Dark Cyber Background
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, size, size);

  // Radial Cyber Glow
  const glow = ctx.createRadialGradient(cx, cy, 30, cx, cy, size * 0.48);
  glow.addColorStop(0, 'rgba(124, 58, 237, 0.28)');
  glow.addColorStop(0.6, 'rgba(6, 182, 212, 0.12)');
  glow.addColorStop(1, 'rgba(3, 7, 18, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // Outer Neon Track Ring
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.25)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Seconds Progress Arc
  const secFraction = (time.getSeconds() * 1000 + time.getMilliseconds()) / 60000;
  const secAngle = -Math.PI / 2 + secFraction * Math.PI * 2;
  ctx.strokeStyle = '#06B6D4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, -Math.PI / 2, secAngle);
  ctx.stroke();

  // Neon Digital Hours & Minutes
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  ctx.save();
  ctx.shadowColor = '#06B6D4';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#22D3EE';
  ctx.font = '800 84px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(hours, cx - 12, cy - 25);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = '#7C3AED';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#C084FC';
  ctx.font = '800 84px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(minutes, cx + 12, cy - 25);
  ctx.restore();

  // Pulsing Separator Dots
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy - 38, 4, 0, Math.PI * 2);
  ctx.arc(cx, cy - 12, 4, 0, Math.PI * 2);
  ctx.fill();

  // Neon Telemetry Dashboard
  const cardY = cy + 55;

  // BPM Box
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cx - 120, cardY, 75, 48, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F87171';
  ctx.font = '700 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PULSE', cx - 82, cardY + 16);
  ctx.font = '800 16px Inter, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${state.heartRate}`, cx - 82, cardY + 34);

  // Steps Box
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.beginPath();
  ctx.roundRect(cx - 37, cardY, 75, 48, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#22D3EE';
  ctx.font = '700 11px Inter, sans-serif';
  ctx.fillText('STEPS', cx, cardY + 16);
  ctx.font = '800 15px Inter, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${state.stepCount}`, cx, cardY + 34);

  // Battery Box
  ctx.fillStyle = 'rgba(124, 58, 237, 0.15)';
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)';
  ctx.beginPath();
  ctx.roundRect(cx + 45, cardY, 75, 48, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#C084FC';
  ctx.font = '700 11px Inter, sans-serif';
  ctx.fillText('BATTERY', cx + 82, cardY + 16);
  ctx.font = '800 16px Inter, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${state.batteryLevel}%`, cx + 82, cardY + 34);

  // Bottom Banner
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillText(`AURA // ${state.weather.condition.toUpperCase()} ${state.currentTemperature}°`, cx, cy + 130);
}

export function drawChronoFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  time: Date,
  state: WatchSimulatorState
): void {
  const cx = size / 2;
  const cy = size / 2;

  // Deep Navy Sunburst Dial
  ctx.fillStyle = '#060B18';
  ctx.fillRect(0, 0, size, size);

  // Outer Bezel Tachymeter Track
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  // Minute & Second Tick Marks
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isHour = i % 5 === 0;
    const r1 = size * 0.45;
    const r2 = isHour ? size * 0.41 : size * 0.435;

    ctx.strokeStyle = isHour ? '#E2E8F0' : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = isHour ? 2.5 : 1;
    ctx.beginPath();
    ctx.moveTo(Math.sin(angle) * r1, -Math.cos(angle) * r1);
    ctx.lineTo(Math.sin(angle) * r2, -Math.cos(angle) * r2);
    ctx.stroke();

    if (isHour) {
      const num = i === 0 ? '60' : i.toString().padStart(2, '0');
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textR = size * 0.38;
      ctx.fillText(num, Math.sin(angle) * textR, -Math.cos(angle) * textR);
    }
  }
  ctx.restore();

  // 3 Sub-Dials Helper
  const drawSubDial = (x: number, y: number, r: number, label: string, valStr: string, needleAngle: number) => {
    // Dial base
    ctx.fillStyle = '#0C1322';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dial ticks
    for (let j = 0; j < 12; j++) {
      const a = (j * Math.PI) / 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + Math.sin(a) * (r - 2), y - Math.cos(a) * (r - 2));
      ctx.lineTo(x + Math.sin(a) * (r - 5), y - Math.cos(a) * (r - 5));
      ctx.stroke();
    }

    // Needle
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(needleAngle) * (r - 7), y - Math.cos(needleAngle) * (r - 7));
    ctx.stroke();

    // Center pin
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - r - 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 10px Inter, sans-serif';
    ctx.fillText(valStr, x, y + r + 11);
  };

  // Sub-Dial 1: Top (30-Minute Counter)
  const minAngle = ((time.getMinutes() % 30) / 30) * Math.PI * 2;
  drawSubDial(cx, cy - 70, 36, 'CHRONO', `${time.getMinutes()}M`, minAngle);

  // Sub-Dial 2: Left (24-Hour Dial)
  const hrAngle = ((time.getHours() % 24) / 24) * Math.PI * 2;
  drawSubDial(cx - 75, cy + 10, 36, '24-HR', `${time.getHours()}H`, hrAngle);

  // Sub-Dial 3: Bottom (Heart Rate / Pulse Dial)
  const bpmAngle = ((state.heartRate - 50) / 100) * Math.PI * 2;
  drawSubDial(cx, cy + 85, 36, 'PULSE', `${state.heartRate}`, bpmAngle);

  // Date Window at 3 o'clock
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cx + 50, cy - 12, 38, 24, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${time.getDate()}`, cx + 69, cy);

  // Main Analog Hands
  const hoursVal = (time.getHours() % 12) + time.getMinutes() / 60;
  const hourAngle = (hoursVal / 12) * Math.PI * 2;
  const minuteAngle = ((time.getMinutes() + time.getSeconds() / 60) / 60) * Math.PI * 2;
  const secondAngle = ((time.getSeconds() * 1000 + time.getMilliseconds()) / 60000) * Math.PI * 2;

  // Hour Hand
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(hourAngle);
  ctx.fillStyle = '#F1F5F9';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.roundRect(-4, -size * 0.22, 8, size * 0.22 + 10, 4);
  ctx.fill();
  ctx.restore();

  // Minute Hand
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(minuteAngle);
  ctx.fillStyle = '#E2E8F0';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.roundRect(-3, -size * 0.33, 6, size * 0.33 + 12, 3);
  ctx.fill();
  ctx.restore();

  // Sweep Seconds Hand (Chrono Red/Cyan)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(secondAngle);
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -size * 0.39);
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Center Pin Cap
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, 2, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHealthFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  time: Date,
  state: WatchSimulatorState
): void {
  const cx = size / 2;
  const cy = size / 2;

  // Deep Obsidian Background
  ctx.fillStyle = '#05070E';
  ctx.fillRect(0, 0, size, size);

  // Digital Time at Top
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 46px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, cy - 130);

  // Concentric Activity Rings
  const ringCenterY = cy - 15;
  const ringWidth = 14;

  const drawRing = (r: number, color: string, bgTrack: string, progressFraction: number) => {
    // Background track
    ctx.strokeStyle = bgTrack;
    ctx.lineWidth = ringWidth;
    ctx.beginPath();
    ctx.arc(cx, ringCenterY, r, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    if (progressFraction > 0) {
      const safeFraction = Math.min(progressFraction, 1.0);
      ctx.strokeStyle = color;
      ctx.lineWidth = ringWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(
        cx,
        ringCenterY,
        r,
        -Math.PI / 2,
        -Math.PI / 2 + safeFraction * Math.PI * 2
      );
      ctx.stroke();
    }
  };

  // Ring 1 (Outer): Calories Burned (Violet)
  const calFraction = state.stepMetrics.caloriesBurned / 500;
  drawRing(78, '#8B5CF6', 'rgba(139, 92, 246, 0.18)', calFraction);

  // Ring 2 (Middle): Steps (Cyan)
  const stepsFraction = state.stepCount / state.stepGoal;
  drawRing(58, '#06B6D4', 'rgba(6, 182, 212, 0.18)', stepsFraction);

  // Ring 3 (Inner): Active Time / Heart Rate (Emerald)
  const activeFraction = state.heartRate / 120;
  drawRing(38, '#10B981', 'rgba(16, 185, 129, 0.18)', activeFraction);

  // Center Ring Icon
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AURA', cx, ringCenterY);

  // Real-time Mini Sparkline ECG
  const sparkY = cy + 105;
  const sparkWidth = 220;
  const sparkHeight = 44;
  const sparkLeft = cx - sparkWidth / 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sparkLeft - 10, sparkY - 14, sparkWidth + 20, sparkHeight + 20, 12);
  ctx.fill();
  ctx.stroke();

  // ECG points
  const points = generateECGWave(45, state.heartRate, (time.getSeconds() % 10) * 0.1);
  ctx.strokeStyle = '#F43F5E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((val, idx) => {
    const px = sparkLeft + (idx / (points.length - 1)) * sparkWidth;
    const py = sparkY + sparkHeight / 2 - val * (sparkHeight / 2) * 0.8;
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Bottom Stats Row
  ctx.fillStyle = '#F43F5E';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`♥ ${state.heartRate} BPM`, cx - 60, cy + 155);

  ctx.fillStyle = '#06B6D4';
  ctx.fillText(`👟 ${state.stepCount.toLocaleString()}`, cx + 55, cy + 155);
}

export function renderWatchFace(
  canvas: HTMLCanvasElement,
  faceId: WatchFaceId,
  time: Date,
  state: WatchSimulatorState
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;

  switch (faceId) {
    case 'minimal':
      drawMinimalFace(ctx, size, time, state);
      break;
    case 'neon':
      drawNeonFace(ctx, size, time, state);
      break;
    case 'chrono':
      drawChronoFace(ctx, size, time, state);
      break;
    case 'health':
      drawHealthFace(ctx, size, time, state);
      break;
    default:
      drawMinimalFace(ctx, size, time, state);
  }
}
