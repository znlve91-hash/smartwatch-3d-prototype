/**
 * Dynamic 512x512 Canvas Watch Face & Simulated Widget Generator
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import * as THREE from 'three';
import { WATCH_FACES, getWatchFaceById } from '../../data/watchFaces.js';

export const CANVAS_SIZE = 512;

/**
 * Creates an in-memory 512x512 canvas element or uses custom canvas.
 */
export function createFaceCanvas(customCanvas = null) {
  if (customCanvas) return customCanvas;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    return canvas;
  }
  // Fallback for non-DOM / test environments
  return {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    getContext: () => null,
  };
}

/**
 * Helper to draw a rounded rectangle
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
  }
}

/**
 * Main rendering router: renders the specified watch face and active widget.
 */
export function renderWatchFace(canvas, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    faceId = 'minimal',
    widgetId = 'heartRate',
    widgetState = {},
    time = new Date(),
    customTheme = {},
  } = options;

  const faceConfig = getWatchFaceById(faceId) || WATCH_FACES[0];
  const theme = { ...faceConfig.theme, ...customTheme };
  const cx = CANVAS_SIZE / 2;
  const cy = CANVAS_SIZE / 2;

  ctx.save();

  // Reset shadow & styles
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.globalAlpha = 1.0;

  // Clear & background
  ctx.fillStyle = theme.background || '#0F172A';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  switch (faceId) {
    case 'neon':
      renderNeonFace(ctx, cx, cy, time, theme, widgetId, widgetState);
      break;
    case 'chrono':
      renderChronoFace(ctx, cx, cy, time, theme, widgetId, widgetState);
      break;
    case 'health':
      renderHealthFace(ctx, cx, cy, time, theme, widgetId, widgetState);
      break;
    case 'minimal':
    default:
      renderMinimalFace(ctx, cx, cy, time, theme, widgetId, widgetState);
      break;
  }

  // Draw simulated widget overlay / tray
  renderActiveWidget(ctx, cx, cy, widgetId, widgetState, faceId);

  ctx.restore();
}

/**
 * 1. Minimal Watch Face
 * Clean typography, sleek hour/minute hands, minimal date, high-contrast indices
 */
function renderMinimalFace(ctx, cx, cy, time, theme, widgetId, widgetState) {
  const radius = 230;

  // Subtle dial border
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = theme.dial || '#334155';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Geometric Hour Indices (12 hours)
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const isCardinal = i % 3 === 0;
    const innerR = isCardinal ? radius - 24 : radius - 14;
    const outerR = radius - 6;

    const x1 = cx + Math.sin(angle) * innerR;
    const y1 = cy - Math.cos(angle) * innerR;
    const x2 = cx + Math.sin(angle) * outerR;
    const y2 = cy - Math.cos(angle) * outerR;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isCardinal ? (theme.hands || '#FFFFFF') : (theme.dial || '#64748B');
    ctx.lineWidth = isCardinal ? 4 : 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Brand Name
  ctx.fillStyle = theme.accent || '#7C3AED';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NOVA', cx, cy - 85);

  // Date aperture window at 3 o'clock (x: cx + 110, y: cy)
  const day = time.getDate();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[time.getMonth()];

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  drawRoundedRect(ctx, cx + 75, cy - 14, 52, 28, 6);
  ctx.fill();
  ctx.strokeStyle = theme.dial || '#475569';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = theme.text || '#FFFFFF';
  ctx.font = '700 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${month} ${day}`, cx + 101, cy);

  // Analog Hands
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourAngle = (hours + minutes / 60) * (Math.PI / 6);
  const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30);
  const secondAngle = seconds * (Math.PI / 30);

  // Hour Hand
  drawHand(ctx, cx, cy, hourAngle, radius * 0.52, 6, theme.hands || '#FFFFFF');
  // Minute Hand
  drawHand(ctx, cx, cy, minuteAngle, radius * 0.78, 4, theme.hands || '#FFFFFF');

  // Second Hand (accent colored)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - Math.sin(secondAngle) * 20, cy + Math.cos(secondAngle) * 20);
  ctx.lineTo(cx + Math.sin(secondAngle) * (radius * 0.85), cy - Math.cos(secondAngle) * (radius * 0.85));
  ctx.strokeStyle = theme.secondHand || '#A78BFA';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Center Pivot Cap
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = theme.secondHand || '#A78BFA';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
}

/**
 * 2. Neon Watch Face
 * Cyberpunk inspired glowing cyan/purple digital clock, pulsating second ring
 */
function renderNeonFace(ctx, cx, cy, time, theme, widgetId, widgetState) {
  const radius = 230;
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  // Pulsating Outer Second Ring
  const pulseScale = 0.95 + 0.05 * Math.sin(seconds * 3);
  ctx.save();
  ctx.shadowColor = theme.accent || '#06B6D4';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * pulseScale, 0, Math.PI * 2);
  ctx.strokeStyle = theme.accent || '#06B6D4';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Orbit arc progress (seconds)
  const secAngle = (seconds / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.9, -Math.PI / 2, secAngle);
  ctx.strokeStyle = theme.secondaryAccent || '#A855F7';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();

  // Cyber Grid decorative lines
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = 1;
  for (let offset = -120; offset <= 120; offset += 40) {
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy + offset);
    ctx.lineTo(cx + 150, cy + offset);
    ctx.stroke();
  }
  ctx.restore();

  // Glowing Digital Time (24h)
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const secStr = String(Math.floor(seconds)).padStart(2, '0');

  ctx.save();
  ctx.shadowColor = theme.accent || '#06B6D4';
  ctx.shadowBlur = 24;
  ctx.fillStyle = theme.text || '#00F0FF';
  ctx.font = '700 76px monospace, system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, cy - 35);
  ctx.restore();

  // Seconds Tag
  ctx.save();
  ctx.shadowColor = theme.secondaryAccent || '#A855F7';
  ctx.shadowBlur = 12;
  ctx.fillStyle = theme.subText || '#C084FC';
  ctx.font = '600 24px monospace, system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`:${secStr}`, cx + 130, cy - 35);
  ctx.restore();

  // Date Tag
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateStr = `${dayNames[time.getDay()]} ${time.getDate()}`;
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(dateStr, cx, cy + 25);
}

/**
 * 3. Chrono Watch Face
 * Classic luxury chronograph dial with 3 sub-dials, tachymeter scale, metallic indices
 */
function renderChronoFace(ctx, cx, cy, time, theme, widgetId, widgetState) {
  const radius = 235;

  // Outer Tachymeter Scale Ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 26;
  ctx.stroke();

  // Tachymeter Label & Numbers
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '700 9px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TACHYMETRE', cx, cy - radius + 13);

  const tachyMarkers = [
    { num: '400', a: 0.35 },
    { num: '300', a: 0.75 },
    { num: '240', a: 1.15 },
    { num: '200', a: 1.55 },
    { num: '160', a: 2.1 },
    { num: '120', a: 2.8 },
    { num: '90', a: 3.6 },
    { num: '60', a: 4.8 },
  ];
  tachyMarkers.forEach(({ num, a }) => {
    const tx = cx + Math.cos(a) * (radius - 2);
    const ty = cy + Math.sin(a) * (radius - 2);
    ctx.fillText(num, tx, ty);
  });
  ctx.restore();

  // Dial Inner Ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.strokeStyle = '#4B5563';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Metallic Hour Indices (Faceted rectangles)
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const innerR = radius - 45;
    const outerR = radius - 20;

    const x1 = cx + Math.sin(angle) * innerR;
    const y1 = cy - Math.cos(angle) * innerR;
    const x2 = cx + Math.sin(angle) * outerR;
    const y2 = cy - Math.cos(angle) * outerR;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i % 3 === 0 ? '#F8FAFC' : '#CBD5E1';
    ctx.lineWidth = i % 3 === 0 ? 6 : 4;
    ctx.lineCap = 'butt';
    ctx.stroke();
  }

  // 3 Sub-Dials:
  // 1. Top Subdial (30-Minute Chrono accumulator at y: cy - 70)
  drawSubDial(ctx, cx, cy - 70, 42, '30 MIN', 0.6);
  // 2. Left Subdial (Small Running Seconds at x: cx - 75, y: cy + 15)
  drawSubDial(ctx, cx - 75, cy + 15, 42, 'SEC', (time.getSeconds() / 60) * Math.PI * 2);
  // 3. Bottom Subdial (24-Hour Dial at y: cy + 85)
  drawSubDial(ctx, cx, cy + 85, 42, '24H', ((time.getHours() % 24) / 24) * Math.PI * 2);

  // Main Mechanical Hands
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourAngle = (hours + minutes / 60) * (Math.PI / 6);
  const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30);
  const chronoSecAngle = seconds * (Math.PI / 30);

  // Hour Hand (Metallic bevel look)
  drawHand(ctx, cx, cy, hourAngle, 110, 7, '#CBD5E1');
  // Minute Hand
  drawHand(ctx, cx, cy, minuteAngle, 160, 5, '#E2E8F0');

  // Red Chronograph Accent Second Hand
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - Math.sin(chronoSecAngle) * 30, cy + Math.cos(chronoSecAngle) * 30);
  ctx.lineTo(cx + Math.sin(chronoSecAngle) * (radius - 20), cy - Math.cos(chronoSecAngle) * (radius - 20));
  ctx.strokeStyle = theme.accentHand || '#EF4444';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Chrono needle counterbalance
  ctx.beginPath();
  ctx.arc(cx - Math.sin(chronoSecAngle) * 20, cy + Math.cos(chronoSecAngle) * 20, 4, 0, Math.PI * 2);
  ctx.fillStyle = theme.accentHand || '#EF4444';
  ctx.fill();
  ctx.restore();

  // Center Pivot
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#111827';
  ctx.fill();
}

/**
 * Helper to draw a single chronograph subdial
 */
function drawSubDial(ctx, x, y, r, label, handAngle = 0) {
  ctx.save();
  // Dial plate
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1F2937';
  ctx.fill();
  ctx.strokeStyle = '#4B5563';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tick marks
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(a) * (r - 8), y - Math.cos(a) * (r - 8));
    ctx.lineTo(x + Math.sin(a) * (r - 2), y - Math.cos(a) * (r - 2));
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Label
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 8px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + r - 14);

  // Subdial hand
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.sin(handAngle) * (r - 10), y - Math.cos(handAngle) * (r - 10));
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center pip
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#E5E7EB';
  ctx.fill();
  ctx.restore();
}

/**
 * 4. Health Watch Face
 * Tri-color concentric activity rings (Move, Exercise, Stand) and live metric readouts
 */
function renderHealthFace(ctx, cx, cy, time, theme, widgetId, widgetState) {
  // Activity Rings specs
  // Move: Outer ring (radius: 180, width: 22, color: #FA114F)
  // Exercise: Middle ring (radius: 148, width: 22, color: #92E82A)
  // Stand: Inner ring (radius: 116, width: 22, color: #00D8F6)

  const rings = [
    { radius: 180, width: 20, color: theme.moveRing || '#FA114F', progress: 0.82 },
    { radius: 148, width: 20, color: theme.exerciseRing || '#92E82A', progress: 0.65 },
    { radius: 116, width: 20, color: theme.standRing || '#00D8F6', progress: 0.75 },
  ];

  rings.forEach((ring) => {
    // Background Track (Dark version)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy - 20, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = ring.width;
    ctx.stroke();
    ctx.restore();

    // Progress Arc with rounded cap
    ctx.save();
    ctx.beginPath();
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + ring.progress * Math.PI * 2;
    ctx.arc(cx, cy - 20, ring.radius, startAngle, endAngle);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  });

  // Digital Time at Top
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hours}:${minutes}`, cx, cy - 20);

  // Health Metrics in center / bottom
  const bpm = widgetState?.bpm ?? 78;
  ctx.fillStyle = theme.bpmText || '#FF3B30';
  ctx.font = '700 28px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`♥ ${bpm} BPM`, cx, cy + 30);

  // Calorie & Move readout
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 14px system-ui';
  ctx.fillText('540 CAL • 82% MOVE', cx, cy + 65);
}

/**
 * Renders dedicated simulated widget overlay onto canvas
 */
function renderActiveWidget(ctx, cx, cy, widgetId, widgetState, faceId) {
  // Widget tray position (centered at bottom of dial)
  const trayY = CANVAS_SIZE - 90;

  switch (widgetId) {
    case 'heartRate': {
      const bpm = widgetState?.bpm ?? 78;
      const status = widgetState?.status || 'Normal';

      // Pulse wave line
      ctx.save();
      ctx.beginPath();
      const waveY = trayY - 12;
      ctx.moveTo(cx - 70, waveY);
      ctx.lineTo(cx - 30, waveY);
      ctx.lineTo(cx - 20, waveY - 18);
      ctx.lineTo(cx - 10, waveY + 16);
      ctx.lineTo(cx, waveY - 24);
      ctx.lineTo(cx + 10, waveY + 8);
      ctx.lineTo(cx + 20, waveY);
      ctx.lineTo(cx + 70, waveY);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Readout
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 20px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${bpm} BPM`, cx, trayY + 22);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 12px system-ui';
      ctx.fillText(status, cx, trayY + 42);
      ctx.restore();
      break;
    }

    case 'steps': {
      const current = widgetState?.current ?? 7420;
      const goal = widgetState?.goal ?? 10000;
      const distance = widgetState?.distanceKm ?? 5.4;
      const formattedCurrent = current.toLocaleString();

      ctx.save();
      // Step bar
      const barW = 140;
      const barH = 8;
      const barX = cx - barW / 2;
      const barY = trayY - 8;

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      drawRoundedRect(ctx, barX, barY, barW, barH, 4);
      ctx.fill();

      const progress = Math.min(1, current / goal);
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      drawRoundedRect(ctx, barX, barY, barW * progress, barH, 4);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 18px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${formattedCurrent} STEPS`, cx, trayY + 18);

      ctx.fillStyle = '#06B6D4';
      ctx.font = '600 12px system-ui';
      ctx.fillText(`${distance} KM • ${Math.round(progress * 100)}%`, cx, trayY + 38);
      ctx.restore();
      break;
    }

    case 'weather': {
      const tempC = widgetState?.tempC ?? 24;
      const condition = widgetState?.condition || 'Partly Sunny';

      ctx.save();
      // Sun/Cloud icon simulation
      ctx.beginPath();
      ctx.arc(cx - 30, trayY + 8, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 22px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tempC}°C`, cx - 8, trayY + 8);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(condition.toUpperCase(), cx, trayY + 34);
      ctx.restore();
      break;
    }

    case 'music': {
      const track = widgetState?.track || 'Echoes of Tomorrow';
      const artist = widgetState?.artist || 'Nova Beats';
      const isPlaying = widgetState?.isPlaying ?? false;

      ctx.save();
      // Mini play bar
      const barW = 120;
      const barH = 5;
      const barX = cx - barW / 2;
      const barY = trayY - 14;

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      drawRoundedRect(ctx, barX, barY, barW, barH, 2);
      ctx.fill();

      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      drawRoundedRect(ctx, barX, barY, barW * 0.45, barH, 2);
      ctx.fill();

      // Track info
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(track, cx, trayY + 8);

      ctx.fillStyle = '#C084FC';
      ctx.font = '600 12px system-ui';
      ctx.fillText(`${artist} • ${isPlaying ? 'Playing' : 'Paused'}`, cx, trayY + 28);
      ctx.restore();
      break;
    }

    case 'battery': {
      const level = widgetState?.level ?? 88;
      const lowPower = widgetState?.lowPowerMode ?? false;

      ctx.save();
      // Battery Capsule Icon
      const bW = 44;
      const bH = 20;
      const bX = cx - bW / 2 - 25;
      const bY = trayY + 2;

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      drawRoundedRect(ctx, bX, bY, bW, bH, 4);
      ctx.stroke();

      // Battery terminal
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(bX + bW + 1, bY + 5, 3, 10);

      // Battery level fill
      const fillW = Math.max(0, (bW - 4) * (level / 100));
      ctx.fillStyle = level > 20 ? (lowPower ? '#F59E0B' : '#10B981') : '#EF4444';
      ctx.fillRect(bX + 2, bY + 2, fillW, bH - 4);

      // Percentage text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 20px system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${level}%`, bX + bW + 10, bY + 10);

      if (lowPower) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '600 11px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('LOW POWER MODE', cx, trayY + 36);
      }
      ctx.restore();
      break;
    }

    default:
      break;
  }
}

/**
 * Draws an analog clock hand
 */
function drawHand(ctx, cx, cy, angle, length, width, color) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - Math.sin(angle) * (length * 0.15), cy + Math.cos(angle) * (length * 0.15));
  ctx.lineTo(cx + Math.sin(angle) * length, cy - Math.cos(angle) * length);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

/**
 * Creates a Three.js CanvasTexture wrapper with real-time update and disposal capabilities.
 */
export function createWatchCanvasTexture(options = {}) {
  const canvas = createFaceCanvas(options.customCanvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  let currentOptions = { ...options };

  // Initial draw
  renderWatchFace(canvas, currentOptions);
  texture.needsUpdate = true;

  return {
    canvas,
    texture,
    update(newOptions = {}) {
      currentOptions = { ...currentOptions, ...newOptions };
      renderWatchFace(canvas, currentOptions);
      texture.needsUpdate = true;
    },
    dispose() {
      if (texture) {
        texture.dispose();
      }
    },
  };
}
