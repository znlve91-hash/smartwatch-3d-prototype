import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Sparkles, Scale, Cpu, Layers } from 'lucide-react';

export interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onNavigate?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(section);
    } else {
      const element = document.getElementById(section);
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-purple-100/60 shadow-[0_4px_20px_-4px_rgba(124,58,237,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-1.5 cursor-pointer select-none group"
            onClick={() => handleNavClick('hero')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-slate-900 group-hover:text-purple-700 transition-colors">
                AURA
              </span>
              <span className="font-light text-xs sm:text-sm tracking-widest text-slate-500 ml-1.5 uppercase">
                Wearables
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 ml-1 transform group-hover:scale-125 transition-transform" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('catalog')}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 rounded-xl transition-all"
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('studio')}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>3D Studio Preview</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </button>
            <button
              onClick={() => handleNavClick('compare')}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 rounded-xl transition-all"
            >
              Compare
            </button>
            <button
              onClick={() => handleNavClick('technology')}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 rounded-xl transition-all"
            >
              Technology
            </button>
          </nav>

          {/* Actions: Search & Cart & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              data-testid="search-trigger-btn"
              aria-label="Search products"
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-purple-200/50"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
                Search
              </span>
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              data-testid="cart-toggle-btn"
              aria-label="View shopping cart"
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-purple-50/70 text-purple-700 hover:bg-purple-100/90 border border-purple-200/60 transition-all flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              <span className="hidden sm:inline-block text-xs font-semibold text-purple-900">
                Bag
              </span>
              {cartCount > 0 && (
                <span
                  data-testid="cart-count-badge"
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full shadow-sm animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-purple-50 rounded-xl"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Products</span>
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-purple-50 rounded-xl"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>3D Studio Preview</span>
          </button>
          <button
            onClick={() => handleNavClick('compare')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-purple-50 rounded-xl"
          >
            <Scale className="w-4 h-4 text-purple-600" />
            <span>Compare</span>
          </button>
          <button
            onClick={() => handleNavClick('technology')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-purple-50 rounded-xl"
          >
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Technology</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
