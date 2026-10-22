/**
 * Dynamic Watch Face Canvas Texture Generator
 * Renders 2D watch faces (Minimal, Neon, Chrono, Health) and simulated smart widgets
 * onto an offscreen canvas mapped as a Three.js CanvasTexture.
 */

import { MusicTrack, SimulatedWidgets, WatchFaceId, WeatherData } from '../../types';

export interface WatchFaceTheme {
  id: WatchFaceId;
  name: string;
  tagline: string;
  bgColor: string;
  bgGradientEnd: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  mutedColor: string;
  isDark: boolean;
}

export const WATCH_FACE_THEMES: Record<WatchFaceId, WatchFaceTheme> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean Analog & Typographic',
    bgColor: '#0A0A0E',
    bgGradientEnd: '#13131A',
    primaryColor: '#F8FAFC',
    accentColor: '#7C3AED',
    secondaryColor: '#06B6D4',
    textColor: '#FFFFFF',
    mutedColor: '#94A3B8',
    isDark: true,
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    tagline: 'Cyberpunk Glowing Rings',
    bgColor: '#04040A',
    bgGradientEnd: '#0D0820',
    primaryColor: '#06B6D4',
    accentColor: '#7C3AED',
    secondaryColor: '#EC4899',
    textColor: '#F0FDFA',
    mutedColor: '#67E8F9',
    isDark: true,
  },
  chrono: {
    id: 'chrono',
    name: 'Chrono',
    tagline: 'Precision Racing Sub-dials',
    bgColor: '#0F172A',
    bgGradientEnd: '#1E293B',
    primaryColor: '#E2E8F0',
    accentColor: '#F59E0B',
    secondaryColor: '#EF4444',
    textColor: '#F8FAFC',
    mutedColor: '#64748B',
    isDark: true,
  },
  health: {
    id: 'health',
    name: 'Health',
    tagline: 'Live Telemetry Dashboard',
    bgColor: '#070D18',
    bgGradientEnd: '#0F1E36',
    primaryColor: '#EF4444',
    accentColor: '#10B981',
    secondaryColor: '#06B6D4',
    textColor: '#F8FAFC',
    mutedColor: '#64748B',
    isDark: true,
  },
};

export const WEATHER_PRESETS: WeatherData[] = [
  { temp: 24, condition: 'sunny', city: 'Tokyo, JP' },
  { temp: 19, condition: 'cloudy', city: 'San Francisco' },
  { temp: 16, condition: 'rainy', city: 'London, UK' },
];

export const DEFAULT_PLAYLIST: MusicTrack[] = [
  { title: 'Neon Midnight', artist: 'Synthwave' },
  { title: 'Cyber Pulse', artist: 'Aura Glow' },
  { title: 'Electro Horizon', artist: 'Starlight Drive' },
];

/**
 * Returns theme configuration for given watch face identifier.
 */
export function getWatchFaceTheme(faceId: WatchFaceId): WatchFaceTheme {
  return WATCH_FACE_THEMES[faceId] || WATCH_FACE_THEMES.minimal;
}

/**
 * Formats a Date object into a readable smartwatch date string: "DAY DD MON" (e.g. "WED 22 OCT")
 */
export function formatWatchDate(date: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName} ${dayNum} ${monthName}`;
}

export interface FormattedWatchTime {
  hours: string;
  minutes: string;
  seconds: string;
  timeString: string;
  period?: 'AM' | 'PM';
}

/**
 * Formats a Date object into zero-padded time components.
 */
export function formatWatchTime(
  date: Date,
  options: { use12Hour?: boolean } = {}
): FormattedWatchTime {
  let rawHours = date.getHours();
  let period: 'AM' | 'PM' | undefined;

  if (options.use12Hour) {
    period = rawHours >= 12 ? 'PM' : 'AM';
    rawHours = rawHours % 12 || 12;
  }

  const hours = String(rawHours).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    timeString: `${hours}:${minutes}`,
    period,
  };
}

/**
 * Calculates step completion percentage, clamped between 0 and 100%.
 */
export function calculateStepPercentage(steps: number, goal = 10000): number {
  if (goal <= 0) return 0;
  const pct = (steps / goal) * 100;
  return Math.min(Math.max(pct, 0), 100);
}

/**
 * Generates a realistic simulated heart rate diagnostic reading between 68 and 125 BPM.
 */
export function simulateHeartRateMeasurement(options: { min?: number; max?: number } = {}): number {
  const min = options.min ?? 68;
  const max = options.max ?? 125;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cycles to the next weather preset.
 */
export function getNextWeather(current: WeatherData): WeatherData {
  const currentIndex = WEATHER_PRESETS.findIndex((w) => w.condition === current.condition);
  const nextIndex = (currentIndex + 1) % WEATHER_PRESETS.length;
  return WEATHER_PRESETS[nextIndex];
}

/**
 * Cycles to the next track in the playlist.
 */
export function getNextTrack(current: MusicTrack, playlist: MusicTrack[] = DEFAULT_PLAYLIST): MusicTrack {
  const currentIndex = playlist.findIndex((t) => t.title === current.title);
  const nextIndex = (currentIndex + 1) % playlist.length;
  return playlist[nextIndex];
}

/**
 * Computes the ECG waveform Y-offset based on relative horizontal coordinate and animation phase.
 * Produces standard P-Q-R-S-T cardiac cycle morphology.
 */
export function calculateEcgPoint(x: number, width: number, phase = 0): number {
  // Normalize position within cycle (0 to 1)
  const cyclePos = ((x / width) * 2 + phase) % 1;

  // Baseline
  if (cyclePos < 0.2) return 0;
  // P-wave (at 0.25)
  if (cyclePos >= 0.2 && cyclePos < 0.35) {
    const p = (cyclePos - 0.2) / 0.15;
    return -Math.sin(p * Math.PI) * 4;
  }
  // PR segment
  if (cyclePos >= 0.35 && cyclePos < 0.42) return 0;
  // Q-dip (at 0.44)
  if (cyclePos >= 0.42 && cyclePos < 0.46) {
    const q = (cyclePos - 0.42) / 0.04;
    return Math.sin(q * Math.PI) * 5;
  }
  // R-peak (at 0.50, tall positive spike)
  if (cyclePos >= 0.46 && cyclePos < 0.54) {
    const r = (cyclePos - 0.46) / 0.08;
    return -Math.sin(r * Math.PI) * 28;
  }
  // S-dip (at 0.56)
  if (cyclePos >= 0.54 && cyclePos < 0.60) {
    const s = (cyclePos - 0.54) / 0.06;
    return Math.sin(s * Math.PI) * 8;
  }
  // ST segment
  if (cyclePos >= 0.60 && cyclePos < 0.68) return 0;
  // T-wave (at 0.76)
  if (cyclePos >= 0.68 && cyclePos < 0.88) {
    const t = (cyclePos - 0.68) / 0.20;
    return -Math.sin(t * Math.PI) * 7;
  }

  return 0;
}

export interface ChronoHandAngles {
  secondAngle: number;
  minuteAngle: number;
  hourAngle: number;
  subSecondsAngle: number;
  subMinutesAngle: number;
  subHoursAngle: number;
}

/**
 * Computes radian angles for chronograph main and sub-dial hands.
 */
export function calculateChronoHandAngles(date: Date, stopwatchMs = 0): ChronoHandAngles {
  const ms = date.getMilliseconds();
  const sec = date.getSeconds() + ms / 1000;
  const min = date.getMinutes() + sec / 60;
  const hour = (date.getHours() % 12) + min / 60;

  // Main hands
  const secondAngle = (sec / 60) * Math.PI * 2 - Math.PI / 2;
  const minuteAngle = (min / 60) * Math.PI * 2 - Math.PI / 2;
  const hourAngle = (hour / 12) * Math.PI * 2 - Math.PI / 2;

  // Sub-dials:
  // Sub 1: Running seconds (or stopwatch fraction)
  const subSec = (stopwatchMs / 1000) % 60;
  const subSecondsAngle = (subSec / 60) * Math.PI * 2 - Math.PI / 2;

  // Sub 2: 30-minute accumulator
  const subMin = (stopwatchMs / (1000 * 60)) % 30;
  const subMinutesAngle = (subMin / 30) * Math.PI * 2 - Math.PI / 2;

  // Sub 3: 24-hour dial
  const dayHours = date.getHours() + date.getMinutes() / 60;
  const subHoursAngle = (dayHours / 24) * Math.PI * 2 - Math.PI / 2;

  return {
    secondAngle,
    minuteAngle,
    hourAngle,
    subSecondsAngle,
    subMinutesAngle,
    subHoursAngle,
  };
}

export interface DrawWatchFaceOptions {
  faceId: WatchFaceId;
  widgets: SimulatedWidgets;
  time?: Date;
  size?: number;
  animationTimeMs?: number;
  isBand?: boolean;
}

/**
 * Draws the selected watch face and simulated telemetry onto a 2D canvas context.
 */
export function drawWatchFace(ctx: CanvasRenderingContext2D, options: DrawWatchFaceOptions): void {
  const {
    faceId,
    widgets,
    time = new Date(),
    size = 512,
    animationTimeMs = performance.now ? performance.now() : 0,
    isBand = false,
  } = options;

  const theme = getWatchFaceTheme(faceId);
  const cx = size / 2;
  const cy = size / 2;

  // 1. Draw base background
  ctx.save();
  ctx.clearRect(0, 0, size, size);

  // Background Gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, size * 0.7);
  bgGrad.addColorStop(0, theme.bgGradientEnd);
  bgGrad.addColorStop(1, theme.bgColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Draw face-specific content
  switch (faceId) {
    case 'neon':
      drawNeonFace(ctx, size, cx, cy, theme, widgets, time, animationTimeMs, isBand);
      break;
    case 'chrono':
      drawChronoFace(ctx, size, cx, cy, theme, widgets, time, animationTimeMs, isBand);
      break;
    case 'health':
      drawHealthFace(ctx, size, cx, cy, theme, widgets, time, animationTimeMs, isBand);
      break;
    case 'minimal':
    default:
      drawMinimalFace(ctx, size, cx, cy, theme, widgets, time, animationTimeMs, isBand);
      break;
  }

  ctx.restore();
}

/**
 * 1. Minimal Watch Face:
 * Elegant typography, refined second ticks, subtle battery pill, clean date and time.
 */
function drawMinimalFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  cx: number,
  cy: number,
  theme: WatchFaceTheme,
  widgets: SimulatedWidgets,
  time: Date,
  _animTime: number,
  isBand: boolean
): void {
  const dateStr = formatWatchDate(time);
  const { hours, minutes, seconds } = formatWatchTime(time);

  // Minute/second tick ring (only on watch or wide display)
  if (!isBand) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isMajor = i % 5 === 0;
      const rInner = size * (isMajor ? 0.42 : 0.45);
      const rOuter = size * 0.47;
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.strokeStyle = isMajor ? theme.accentColor : 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Top Date Pill
  ctx.save();
  ctx.fillStyle = theme.accentColor;
  ctx.font = `600 ${isBand ? '16px' : '20px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const topY = isBand ? cy - 140 : cy - 110;
  ctx.fillText(dateStr, cx, topY);
  ctx.restore();

  // Central Clock
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `300 ${isBand ? '58px' : '78px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, isBand ? cy - 40 : cy - 10);

  // Seconds indicator
  ctx.fillStyle = theme.mutedColor;
  ctx.font = `400 ${isBand ? '20px' : '26px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(`:${seconds}`, cx + (isBand ? 95 : 125), isBand ? cy - 40 : cy - 10);
  ctx.restore();

  // Bottom Telemetry: Battery Pill & Heart Rate / Steps
  const bottomY = isBand ? cy + 60 : cy + 85;

  // Battery Pill
  drawBatteryPill(ctx, cx - (isBand ? 0 : 70), bottomY, widgets.battery, theme.accentColor);

  // Secondary Widget Info (Steps or Heart Rate)
  ctx.save();
  ctx.fillStyle = theme.primaryColor;
  ctx.font = `500 ${isBand ? '16px' : '18px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const infoY = isBand ? cy + 120 : bottomY + (isBand ? 0 : 45);
  ctx.fillText(`♥ ${widgets.heartRate} BPM   •   ${widgets.steps.toLocaleString()} STEPS`, cx, infoY);
  ctx.restore();
}

/**
 * 2. Neon Watch Face:
 * Cyberpunk dual-gradient typography (cyan & violet), glowing rings, concentric progress arcs.
 */
function drawNeonFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  cx: number,
  cy: number,
  theme: WatchFaceTheme,
  widgets: SimulatedWidgets,
  time: Date,
  animTime: number,
  isBand: boolean
): void {
  const { hours, minutes } = formatWatchTime(time);
  const stepPct = calculateStepPercentage(widgets.steps, widgets.stepGoal) / 100;
  const batteryPct = Math.min(Math.max(widgets.battery / 100, 0), 1);

  // Concentric Progress Arcs (Steps & Battery)
  const ringRadius1 = isBand ? size * 0.36 : size * 0.42;
  const ringRadius2 = isBand ? size * 0.30 : size * 0.36;

  // Background Ring Track
  ctx.save();
  ctx.lineWidth = isBand ? 8 : 12;
  ctx.lineCap = 'round';

  // Step Track
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius1, 0, Math.PI * 2);
  ctx.stroke();

  // Active Step Arc (Cyan glow)
  ctx.strokeStyle = theme.primaryColor;
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius1, -Math.PI / 2, -Math.PI / 2 + stepPct * Math.PI * 2);
  ctx.stroke();

  // Battery Track
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius2, 0, Math.PI * 2);
  ctx.stroke();

  // Active Battery Arc (Violet glow)
  ctx.strokeStyle = theme.accentColor;
  ctx.shadowColor = theme.accentColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius2, -Math.PI / 2, -Math.PI / 2 + batteryPct * Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Cyberpunk Time Gradient Text
  ctx.save();
  const textGrad = ctx.createLinearGradient(cx - 100, cy - 30, cx + 100, cy + 30);
  textGrad.addColorStop(0, theme.primaryColor);
  textGrad.addColorStop(1, theme.accentColor);

  ctx.fillStyle = textGrad;
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 15;
  ctx.font = `800 ${isBand ? '56px' : '82px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, isBand ? cy - 20 : cy - 15);
  ctx.restore();

  // Pulsing Live Heart Rate Badge
  const heartScale = widgets.isMeasuringHeartRate
    ? 1 + Math.sin(animTime / 120) * 0.25
    : 1 + Math.sin(animTime / 300) * 0.1;

  ctx.save();
  ctx.translate(cx, isBand ? cy + 45 : cy + 55);
  ctx.scale(heartScale, heartScale);
  ctx.fillStyle = '#EF4444';
  ctx.font = '700 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const hrText = widgets.isMeasuringHeartRate ? 'MEASURING...' : `♥ ${widgets.heartRate} BPM`;
  ctx.fillText(hrText, 0, 0);
  ctx.restore();

  // Bottom Weather & Track info
  ctx.save();
  ctx.fillStyle = '#94A3B8';
  ctx.font = `500 ${isBand ? '14px' : '16px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const bottomText = `${widgets.weather.city.split(',')[0]} ${widgets.weather.temp}°C  •  ${widgets.steps} STEPS`;
  ctx.fillText(bottomText, cx, isBand ? cy + 105 : cy + 115);
  ctx.restore();
}

/**
 * 3. Chrono Watch Face:
 * Racing chronograph with three distinct sub-dials, tachymeter ring, brushed slate background.
 */
function drawChronoFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  cx: number,
  cy: number,
  theme: WatchFaceTheme,
  widgets: SimulatedWidgets,
  time: Date,
  animTime: number,
  isBand: boolean
): void {
  const angles = calculateChronoHandAngles(time, animTime);

  // Outer Tachymeter Ring
  if (!isBand) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tachymeterNumbers = [
      { num: '60', deg: 0 },
      { num: '75', deg: 45 },
      { num: '100', deg: 90 },
      { num: '150', deg: 150 },
      { num: '200', deg: 210 },
      { num: '300', deg: 270 },
      { num: '500', deg: 320 },
    ];

    tachymeterNumbers.forEach((t) => {
      const rad = (t.deg * Math.PI) / 180 - Math.PI / 2;
      const x = cx + Math.cos(rad) * (size * 0.44);
      const y = cy + Math.sin(rad) * (size * 0.44);
      ctx.fillText(t.num, x, y);
    });

    // 12 Major Hour Markers
    for (let i = 0; i < 12; i++) {
      const rad = (i / 12) * Math.PI * 2;
      ctx.lineWidth = i % 3 === 0 ? 4 : 2;
      ctx.strokeStyle = i % 3 === 0 ? theme.accentColor : '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * (size * 0.38), cy + Math.sin(rad) * (size * 0.38));
      ctx.lineTo(cx + Math.cos(rad) * (size * 0.42), cy + Math.sin(rad) * (size * 0.42));
      ctx.stroke();
    }
    ctx.restore();
  }

  // Three Distinct Circular Sub-Dials
  // Sub-dial 1: 30-Minute Accumulator (Top or Center-Left)
  const sub1X = isBand ? cx : cx - (size * 0.18);
  const sub1Y = isBand ? cy - (size * 0.22) : cy - (size * 0.05);
  drawSubDial(ctx, sub1X, sub1Y, isBand ? 38 : 46, '30M', angles.subMinutesAngle, theme.accentColor);

  // Sub-dial 2: 24-Hour Dial (Center-Right)
  if (!isBand) {
    const sub2X = cx + (size * 0.18);
    const sub2Y = cy - (size * 0.05);
    drawSubDial(ctx, sub2X, sub2Y, 46, '24H', angles.subHoursAngle, '#38BDF8');
  }

  // Sub-dial 3: Running Seconds Dial (Bottom)
  const sub3X = cx;
  const sub3Y = isBand ? cy + (size * 0.22) : cy + (size * 0.18);
  drawSubDial(ctx, sub3X, sub3Y, isBand ? 40 : 50, 'SEC', angles.subSecondsAngle, '#EF4444');

  // Date Box at 4 o'clock or top
  ctx.save();
  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  const dateBoxX = isBand ? cx - 35 : cx + (size * 0.16);
  const dateBoxY = isBand ? cy - (size * 0.38) : cy + (size * 0.14);
  ctx.fillRect(dateBoxX, dateBoxY, 70, 24);
  ctx.strokeRect(dateBoxX, dateBoxY, 70, 24);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(time.getDate().toString().padStart(2, '0') + ' OCT', dateBoxX + 35, dateBoxY + 12);
  ctx.restore();

  // Luminescent Main Hour & Minute Hands
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineCap = 'round';

  // Hour Hand
  ctx.save();
  ctx.rotate(angles.hourAngle + Math.PI / 2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -(size * 0.24));
  ctx.stroke();
  ctx.restore();

  // Minute Hand
  ctx.save();
  ctx.rotate(angles.minuteAngle + Math.PI / 2);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -(size * 0.34));
  ctx.stroke();
  ctx.restore();

  // Chrono Orange Second Hand (Fine needle)
  ctx.save();
  ctx.rotate(angles.secondAngle + Math.PI / 2);
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.08);
  ctx.lineTo(0, -(size * 0.38));
  ctx.stroke();
  ctx.restore();

  // Center Pivot Hub
  ctx.fillStyle = theme.accentColor;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Helper to draw a circular chronograph sub-dial with tick marks and indicator hand.
 */
function drawSubDial(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  label: string,
  handAngle: number,
  accentColor: string
): void {
  ctx.save();
  // Background circle
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sub-dial ticks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rIn = radius * 0.8;
    const rOut = radius * 0.95;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * rIn, y + Math.sin(a) * rIn);
    ctx.lineTo(x + Math.cos(a) * rOut, y + Math.sin(a) * rOut);
    ctx.stroke();
  }

  // Sub-dial label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '600 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y - radius * 0.45);

  // Hand
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(handAngle) * (radius * 0.75), y + Math.sin(handAngle) * (radius * 0.75));
  ctx.stroke();

  // Center pin
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 4. Health Watch Face:
 * Real-time telemetry dashboard featuring dynamic animated ECG wave, BPM counter,
 * circular step goal arc, and hydration/calorie metrics.
 */
function drawHealthFace(
  ctx: CanvasRenderingContext2D,
  size: number,
  cx: number,
  cy: number,
  theme: WatchFaceTheme,
  widgets: SimulatedWidgets,
  time: Date,
  animTime: number,
  isBand: boolean
): void {
  const { hours, minutes } = formatWatchTime(time);

  // Digital Time at Top
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${isBand ? '40px' : '52px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, isBand ? cy - 145 : cy - 125);
  ctx.restore();

  // ECG Waveform Card Area
  const ecgWidth = isBand ? size * 0.75 : size * 0.8;
  const ecgHeight = isBand ? 70 : 85;
  const ecgX = cx - ecgWidth / 2;
  const ecgY = isBand ? cy - 85 : cy - 65;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.fillRect(ecgX, ecgY, ecgWidth, ecgHeight);
  ctx.strokeRect(ecgX, ecgY, ecgWidth, ecgHeight);

  // ECG Grid lines
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.lineWidth = 1;
  const gridStep = 20;
  for (let gx = ecgX; gx <= ecgX + ecgWidth; gx += gridStep) {
    ctx.beginPath();
    ctx.moveTo(gx, ecgY);
    ctx.lineTo(gx, ecgY + ecgHeight);
    ctx.stroke();
  }
  for (let gy = ecgY; gy <= ecgY + ecgHeight; gy += gridStep) {
    ctx.beginPath();
    ctx.moveTo(ecgX, gy);
    ctx.lineTo(ecgX + ecgWidth, gy);
    ctx.stroke();
  }

  // Draw Animated ECG Trace Line
  const phase = (animTime / 1200) % 1;
  ctx.strokeStyle = theme.primaryColor;
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 8;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  const baselineY = ecgY + ecgHeight / 2;
  for (let x = 0; x <= ecgWidth; x += 4) {
    const waveY = calculateEcgPoint(x, ecgWidth, phase);
    const plotY = baselineY + waveY;
    if (x === 0) {
      ctx.moveTo(ecgX + x, plotY);
    } else {
      ctx.lineTo(ecgX + x, plotY);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Heart Rate BPM readout
  ctx.save();
  const heartScale = widgets.isMeasuringHeartRate
    ? 1 + Math.sin(animTime / 100) * 0.3
    : 1 + Math.sin(animTime / 350) * 0.1;

  ctx.fillStyle = theme.primaryColor;
  ctx.font = `800 ${isBand ? '26px' : '34px'} sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const hrY = isBand ? cy + 20 : cy + 50;

  if (widgets.isMeasuringHeartRate) {
    ctx.fillText('DIAGNOSTIC...', cx, hrY);
  } else {
    ctx.fillText(`♥ ${widgets.heartRate} BPM`, cx, hrY);
  }
  ctx.restore();

  // Circular Step Goal Arc or Progress Meter
  const stepPct = calculateStepPercentage(widgets.steps, widgets.stepGoal);
  const arcY = isBand ? cy + 90 : cy + 120;

  ctx.save();
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${isBand ? '16px' : '20px'} -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${widgets.steps.toLocaleString()} / ${widgets.stepGoal.toLocaleString()} STEPS`, cx, arcY);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 13px sans-serif';
  ctx.fillText(`${stepPct.toFixed(0)}% OF DAILY GOAL  •  ${widgets.battery}% BATTERY`, cx, arcY + 24);
  ctx.restore();
}

/**
 * Draws a clean battery status pill with fill level.
 */
function drawBatteryPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  percentage: number,
  accentColor: string
): void {
  ctx.save();
  const pillWidth = 44;
  const pillHeight = 20;
  const pillRadius = 4;
  const px = x - pillWidth / 2;
  const py = y - pillHeight / 2;

  // Battery body border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(px, py, pillWidth, pillHeight, pillRadius);
    ctx.stroke();
  } else {
    ctx.strokeRect(px, py, pillWidth, pillHeight);
  }

  // Battery positive terminal
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(px + pillWidth + 2, py + 5, 3, pillHeight - 10);

  // Fill level
  const clampedPct = Math.min(Math.max(percentage / 100, 0), 1);
  const fillWidth = Math.max(0, (pillWidth - 6) * clampedPct);
  ctx.fillStyle = clampedPct < 0.2 ? '#EF4444' : accentColor;
  ctx.fillRect(px + 3, py + 3, fillWidth, pillHeight - 6);

  // Percentage text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${percentage}%`, px + pillWidth + 12, y);

  ctx.restore();
}

/**
 * Factory creating an offscreen HTMLCanvasElement configured for high-res watch face textures.
 */
export function createWatchFaceCanvas(size = 512): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
} {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}
