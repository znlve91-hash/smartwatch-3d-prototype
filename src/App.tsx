import React, { useState } from 'react';
import { products } from './data/products';
import type { Product, ProductCategory, ColorOption, WatchFaceId } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { CompareModal } from './components/catalog/CompareModal';
import { WatchViewer3D } from './components/viewer3d/WatchViewer3D';
import { Button } from './components/common/Button';
import { Badge } from './components/common/Badge';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Shield,
  Activity,
  Compass,
  BatteryCharging,
  Cpu,
  Layers,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

export const App: React.FC = () => {
  // Active product loaded in 3D Interactive Studio
  const [activeProduct, setActiveProduct] = useState<Product>(
    products.find((p) => p.id === 'watch-horizon-max') || products[0]
  );

  // Cart state simulation
  const [cartCount, setCartCount] = useState<number>(0);

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareCategory, setCompareCategory] = useState<ProductCategory | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchModalQuery, setSearchModalQuery] = useState<string>('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreview3D = (product: Product) => {
    setActiveProduct(product);
    scrollToSection('studio');
  };

  const handleAddToCart = (product: Product, color: ColorOption, face: WatchFaceId) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added to your bag! ${product.name} (${color.name}) - $${product.price}`);
  };

  const handleOpenCompare = (category?: ProductCategory) => {
    setCompareCategory(category);
    setIsCompareOpen(true);
  };

  // Quick search results in search modal
  const searchResults = searchModalQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
          p.specs.caseMaterial.toLowerCase().includes(searchModalQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F8F6FF] text-[#0F172A] flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-purple-200 text-slate-800 px-4 py-3 rounded-2xl shadow-xl shadow-purple-500/10 animate-in slide-in-from-top-4 duration-300 max-w-md"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs sm:text-sm font-medium">
            <span className="font-bold text-purple-700 block mb-0.5">Item Added</span>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => {
          if (cartCount === 0) {
            showToast('Your bag is currently empty. Explore our catalog below to add a wearable!');
          } else {
            showToast(`You have ${cartCount} wearable(s) in your bag ready for checkout.`);
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={(section) => {
          if (section === 'compare') {
            setIsCompareOpen(true);
          } else {
            scrollToSection(section);
          }
        }}
      />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SHOWCASE SECTION */}
        {/* ========================================================= */}
        <section
          id="hero"
          className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 border-b border-purple-100/60"
        >
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-200/40 via-cyan-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline, Highlights, & Call to Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    AURA Next-Gen Wearables
                  </span>
                  <Badge variant="cyan" size="sm">
                    2026 Collection
                  </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Next-Gen Biometrics.{' '}
                  <span className="text-gradient-brand">Pure Minimalist Form.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Engineered from Grade 5 aerospace titanium and curved sapphire crystal. Inspect wearable architecture in interactive 360-degree 3D WebGL, switch dynamic watch faces, and simulate live ECG telemetry.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => scrollToSection('studio')}
                    className="w-full sm:w-auto shadow-lg shadow-purple-500/25"
                  >
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                    <span>Explore in 3D Studio</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollToSection('catalog')}
                    className="w-full sm:w-auto"
                  >
                    <span>Shop Wearables</span>
                    <ArrowRight className="w-4 h-4 text-purple-600" />
                  </Button>
                </div>

                {/* Key Spec Badges */}
                <div className="pt-6 border-t border-purple-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">14 Days</p>
                    <p className="text-xs text-slate-500 font-medium">Battery Endurance</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">5 ATM</p>
                    <p className="text-xs text-slate-500 font-medium">Water Resistance</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">2000 Nit</p>
                    <p className="text-xs text-slate-500 font-medium">Sapphire Retina</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero 3D Stage Preview */}
              <div className="lg:col-span-6 relative">
                <div className="glass-card rounded-3xl p-3 sm:p-5 shadow-2xl border border-purple-100/80 relative overflow-hidden group">
                  {/* Floating Hero Status Pill */}
                  <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Live 3D Hardware Canvas
                    </span>
                    <span className="text-[11px] text-slate-500">| Orbit Drag Enabled</span>
                  </div>

                  {/* 3D Preview Canvas */}
                  <WatchViewer3D
                    product={activeProduct}
                    showControls={false}
                    autoRotate={true}
                    heightClass="h-[380px] sm:h-[460px]"
                    className="w-full rounded-2xl overflow-hidden"
                  />

                  {/* Quick Active Label and Studio Button below preview */}
                  <div className="mt-3 px-3 py-2 flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Featured Prototype
                      </span>
                      <span className="font-bold text-slate-800">{activeProduct.name}</span>
                    </div>
                    <Button
                      variant="pill"
                      size="sm"
                      onClick={() => scrollToSection('studio')}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Customize in Studio</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3D INTERACTIVE STUDIO SECTION */}
        {/* ========================================================= */}
        <section id="studio" className="w-full py-16 scroll-mt-16 bg-[#F1EFFF]/40 border-b border-purple-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider border border-purple-200/50">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Three.js WebGL Interactive Studio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                3D Interactive Studio
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Rotate 360° with mouse or touch, select casing and strap materials, switch between 4 dynamic watch faces, and interact with live simulated biometric widgets.
              </p>

              {/* Device Selector Pills in Studio Header */}
              <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 mr-2">Select Device:</span>
                {products.map((item) => {
                  const isSelected = activeProduct.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveProduct(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm scale-105'
                          : 'bg-white/80 text-slate-600 hover:text-purple-700 hover:bg-purple-50 border border-slate-200/70'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {/* Active Studio Device Status Indicator */}
              <div className="pt-1">
                <span
                  data-testid="studio-active-title"
                  className="text-xs font-bold text-purple-800 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200"
                >
                  Active Studio Device: {activeProduct.name} (${activeProduct.price})
                </span>
              </div>
            </div>

            {/* 3D Interactive Viewer Component with full Studio Controls */}
            <div className="max-w-5xl mx-auto">
              <WatchViewer3D
                key={activeProduct.id}
                product={activeProduct}
                showControls={true}
                autoRotate={false}
                heightClass="h-[480px] sm:h-[540px]"
                className="shadow-2xl rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRODUCT CATALOG & FILTERS SECTION */}
        {/* ========================================================= */}
        <ProductCatalog
          products={products}
          onPreview3D={handlePreview3D}
          onAddToCart={handleAddToCart}
          onOpenCompare={handleOpenCompare}
        />

        {/* ========================================================= */}
        {/* HARDWARE ARCHITECTURE & TECHNOLOGY SECTION */}
        {/* ========================================================= */}
        <section id="technology" className="w-full py-20 scroll-mt-16 border-t border-purple-100/60 bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold uppercase tracking-wider border border-cyan-200/60">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>Next-Gen Engineering</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Crafted Without Compromise
              </h2>
              <p className="text-base text-slate-600">
                Precision metallurgical finishes, medical-grade sensor arrays, and instant client-side WebGL rendering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-100/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Procedural 3D WebGL</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time 60 FPS Three.js geometry synthesis eliminating heavy asset loading and enabling instant material modifications.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-100/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Dynamic Watch Faces</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  512x512 CanvasTexture rendering engine drawing live analog dials, pulsing ECG sparklines, and activity rings onto the 3D watch face.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-100/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Grade 5 Titanium</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Aerospace titanium casing and scratch-resistant sapphire crystal glass built for 100m water resistance and deep diving.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card rounded-2xl p-6 border border-purple-100/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Dual-Frequency GPS</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  L1 and L5 dual-satellite positioning with continuous SpO2 oxygen telemetry and skin temperature monitoring.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        initialCategory={compareCategory}
        onClose={() => setIsCompareOpen(false)}
        onSelectProduct={(product) => {
          setActiveProduct(product);
          scrollToSection('studio');
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Quick Search Dialog Modal */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Modal"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSearchOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Search className="w-4 h-4" />
                <span>Search AURA Wearables</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchModalQuery}
                onChange={(e) => setSearchModalQuery(e.target.value)}
                placeholder="Search models (e.g., Titanium, ECG, Pro Max)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-purple-50/50 border border-purple-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 placeholder-slate-400"
              />
            </div>

            {searchModalQuery && (
              <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setActiveProduct(product);
                        setIsSearchOpen(false);
                        scrollToSection('studio');
                      }}
                      className="p-3 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-purple-200 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.tagline}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-purple-700">
                          ${product.price}
                        </span>
                        <span className="text-[10px] text-cyan-600 block font-semibold">
                          View in 3D &rarr;
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    No matching devices found for &quot;{searchModalQuery}&quot;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
