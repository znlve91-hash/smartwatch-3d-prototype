/**
 * Minimalist Brand Footer Component
 * Guarantees, Value Pillars, Navigation Links, and Copyright
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import { Sparkles, ShieldCheck, RotateCcw, Truck, Headphones, Heart } from 'lucide-react';

export function Footer({ className = '' }) {
  const guarantees = [
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Hassle-free 100% money-back guarantee with prepaid return labels.',
    },
    {
      icon: ShieldCheck,
      title: '2-Year Official Warranty',
      description: 'Comprehensive hardware protection covering materials & craftsmanship.',
    },
    {
      icon: Truck,
      title: 'Worldwide Fast Dispatch',
      description: 'Expedited carbon-neutral delivery straight from our procedural facility.',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      description: 'Wearable tech specialists standing by for real-time customer care.',
    },
  ];

  return (
    <footer
      className={`bg-white border-t border-purple-100/80 pt-16 pb-12 transition-all ${className}`}
      data-testid="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-100">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                NOVA WEARABLES
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Engineering the next frontier of intelligent biometric wearables. Powered by
              procedural 3D simulation, medical-grade sensor precision, and sustainable artisan
              craftsmanship.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Procedural 3D Engine v2.4 Live</span>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Wearable Models
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#catalog" className="hover:text-purple-600 transition-colors">NovaBand Flow</a></li>
              <li><a href="#catalog" className="hover:text-purple-600 transition-colors">NovaBand Pro Elite</a></li>
              <li><a href="#catalog" className="hover:text-purple-600 transition-colors">NovaWatch Core</a></li>
              <li><a href="#catalog" className="hover:text-purple-600 transition-colors">NovaWatch Pro</a></li>
              <li><a href="#catalog" className="hover:text-purple-600 transition-colors">NovaWatch Pro Max Ultra</a></li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Technology
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Procedural WebGL</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Dynamic Canvas Face</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Biometric Widgets</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Sapphire Crystal</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Grade 5 Titanium</span></li>
            </ul>
          </div>

          {/* Quick Links Column 3 */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Support & Care
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Product Documentation</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Warranty Verification</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Shipping & Dispatch FAQ</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Privacy & Data Security</span></li>
              <li><span className="hover:text-purple-600 transition-colors cursor-pointer">Contact Specialists</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 NOVA WEARABLES Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
            <span>for wearable enthusiasts worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
