/**
 * Hero 3D Showcase Section Component
 * Embeds Interactive WatchViewer3D Studio, CTA Badges, Live Specs Highlights & Actions
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  Battery,
  Shield,
  Zap,
  Activity,
  Box,
} from 'lucide-react';
import { WatchViewer3D } from '../3d/WatchViewer3D.jsx';
import { COLORWAYS } from '../3d/ViewerControls.jsx';

export function HeroSection({
  onExploreClick = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
  className = '',
}) {
  const [modelType, setModelType] = useState('watch');
  const [tier, setTier] = useState('pro_max');
  const [color, setColor] = useState(COLORWAYS[0]);
  const [activeFace, setActiveFace] = useState('neon');

  const liveSpecs = [
    {
      icon: Shield,
      title: 'Sapphire Crystal Glass',
      desc: 'Mohs hardness 9 scratch resistance',
    },
    {
      icon: Layers,
      title: 'Grade 5 Aerospace Titanium',
      desc: 'Ultralight, corrosion-proof chassis',
    },
    {
      icon: Battery,
      title: '21-Day Adventure Battery',
      desc: 'Continuous dual-band satellite tracking',
    },
    {
      icon: Activity,
      title: 'Medical-Grade Biometrics',
      desc: 'ECG, SpO2 & live heart rate sensor array',
    },
  ];

  return (
    <section
      className={`relative w-full pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden ${className}`}
      data-testid="hero-section"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-200/40 via-cyan-100/30 to-indigo-100/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Header Typography */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Floating Pill Badges */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-purple-200/80 shadow-xs text-xs font-bold text-purple-700">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Interactive 3D Studio</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-slate-500 font-medium">Real-Time 360° Simulation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            The Future of Vitality <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              On Your Wrist.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience next-generation smart watches and ergonomic bands rendered in procedural
            3D. Test interactive watch faces, simulate real-time biometric sensors, and personalize
            your perfect wearable companion.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/25 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#watch-viewer"
              className="px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 hover:text-purple-600 border border-purple-100 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-purple-500" />
              <span>Customize in 3D</span>
            </a>
          </div>
        </div>

        {/* 3D Interactive Stage Container */}
        <div id="watch-viewer" className="relative w-full max-w-5xl mx-auto shadow-2xl rounded-3xl border border-white/60 bg-white/40 p-2 sm:p-4 backdrop-blur-md">
          <WatchViewer3D
            modelType={modelType}
            tier={tier}
            color={color}
            activeFace={activeFace}
            onModelChange={setModelType}
            onColorChange={setColor}
            onFaceChange={setActiveFace}
            showControls={true}
            className="w-full"
          />
        </div>

        {/* Live Spec Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {liveSpecs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-100/70 hover:border-purple-300 transition-all space-y-1.5"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">{spec.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{spec.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
