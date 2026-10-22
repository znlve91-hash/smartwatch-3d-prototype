import React from 'react';
import { Watch, ShieldCheck, Zap, RotateCcw, Cpu, HeartHandshake } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/90 border-t border-purple-100/80 pt-16 pb-12 mt-20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-purple-100/60">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/40">
            <div className="p-2.5 rounded-xl bg-purple-100/80 text-[#7C3AED]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Procedural 3D Engine</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero external mesh downloads, instant WebGL hardware-accelerated preview.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100/40">
            <div className="p-2.5 rounded-xl bg-cyan-100/80 text-[#06B6D4]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Live Biosensor Sim</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic ECG waves, step counter rings, and weather telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/40">
            <div className="p-2.5 rounded-xl bg-purple-100/80 text-[#7C3AED]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Grade 5 Titanium</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Up to 100m dive rating and sapphire crystal screens.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100/40">
            <div className="p-2.5 rounded-xl bg-cyan-100/80 text-[#06B6D4]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instant Cart Persistence</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Safe client-side localStorage sync with zero friction checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] text-white shadow-sm">
                <Watch className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-wider text-slate-900">
                HORIZON
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 pr-4">
              Next-generation 3D interactive smart wearables studio. Precision engineering meets ultra-clean digital craftsmanship.
            </p>
            <div className="pt-2">
              <Badge variant="softCyan" size="sm" dot>
                Prototype v0.1.0 Live
              </Badge>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Devices
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <span className="font-medium text-slate-700">PulseBand 2</span>
                <span className="block text-[11px] text-slate-400">Fitness Band Standard</span>
              </li>
              <li>
                <span className="font-medium text-slate-700">PulseBand Pro</span>
                <span className="block text-[11px] text-slate-400">Curved AMOLED & GPS</span>
              </li>
              <li>
                <span className="font-medium text-slate-700">Horizon Watch SE</span>
                <span className="block text-[11px] text-slate-400">Smart Watch Standard</span>
              </li>
              <li>
                <span className="font-medium text-slate-700">Horizon Watch Pro</span>
                <span className="block text-[11px] text-slate-400">Titanium & Rotating Crown</span>
              </li>
              <li>
                <span className="font-medium text-slate-700">Horizon Watch Pro Max</span>
                <span className="block text-[11px] text-slate-400">Expedition 100m Flagship</span>
              </li>
            </ul>
          </div>

          {/* Technology Highlights */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Technology
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="hover:text-slate-800 transition-colors">Three.js Procedural Pipeline</li>
              <li className="hover:text-slate-800 transition-colors">Canvas2D Watch Face Mapping</li>
              <li className="hover:text-slate-800 transition-colors">ACES Filmic Color Grading</li>
              <li className="hover:text-slate-800 transition-colors">Dynamic ECG Algorithm</li>
              <li className="hover:text-slate-800 transition-colors">Client LocalStorage Sync</li>
            </ul>
          </div>

          {/* Experience & Studio */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Studio Experience
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="hover:text-slate-800 transition-colors">360° Free Orbit Rotation</li>
              <li className="hover:text-slate-800 transition-colors">Live Chassis Swatches</li>
              <li className="hover:text-slate-800 transition-colors">Custom Strap Pairings</li>
              <li className="hover:text-slate-800 transition-colors">8-Dimension Spec Compare</li>
              <li className="hover:text-slate-800 transition-colors">Simulated Checkout Flow</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-purple-100/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Horizon Wearables Interactive Studio. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-center sm:text-right">
            <HeartHandshake className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Built with React 19, Three.js, Vite & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
