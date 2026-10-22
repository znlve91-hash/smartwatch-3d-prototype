import React from 'react';
import { Sparkles, Shield, Cpu, Heart, Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-transparent via-[#F1EFFF]/60 to-[#ECE8FF] border-t border-purple-100/80 pt-16 pb-12 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-200/50">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline">
                <span className="font-extrabold text-xl tracking-wider text-slate-900">
                  AURA
                </span>
                <span className="font-light text-xs tracking-widest text-slate-500 ml-1.5 uppercase">
                  Wearables
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 ml-1" />
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Precision health tracking, expedition-grade durability, and bespoke horological aesthetics. Engineered with real-time 3D interactive preview technology.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200/60">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>5 ATM Water Resistant</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium border border-cyan-200/60">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>WebGL 3D Studio</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Wearable Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#catalog" className="hover:text-purple-700 transition-colors">
                  Aura Band Standard
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-purple-700 transition-colors">
                  Aura Band Pro
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-purple-700 transition-colors">
                  Horizon Watch Standard
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-purple-700 transition-colors">
                  Horizon Watch Pro
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-purple-700 transition-colors">
                  Horizon Watch Pro Max
                </a>
              </li>
            </ul>
          </div>

          {/* Interactive 3D Studio */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              3D Interactive Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#studio" className="hover:text-purple-700 transition-colors">
                  360° Orbit Rotation
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-purple-700 transition-colors">
                  Dynamic Watch Faces
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-purple-700 transition-colors">
                  Simulated Widgets (ECG & Steps)
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-purple-700 transition-colors">
                  Strap & Casing Swatches
                </a>
              </li>
              <li>
                <a href="#compare" className="hover:text-purple-700 transition-colors">
                  Side-by-Side Matrix
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Engineering */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Hardware Architecture
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>Multi-band GNSS / GPS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Clinical-Grade ECG</span>
              </li>
              <li>Grade 5 Aerospace Titanium</li>
              <li>Sapphire Crystal Glass</li>
              <li>Curved Retina AMOLED Displays</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} AURA Wearables Inc. All rights reserved. Interactive 3D E-Commerce Prototype.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-purple-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-purple-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-purple-700 cursor-pointer">Hardware Diagnostics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
