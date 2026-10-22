/**
 * Sticky Glassmorphic Navigation Header Component
 * Brand Identity, Category Navigation, Search Trigger, and Animated Cart Drawer Toggle
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Menu, X, Compass } from 'lucide-react';
import { CATEGORIES } from '../../data/products.js';

export function Header({
  activeCategory = 'all',
  onSelectCategory = () => {},
  cartCount = 0,
  onOpenCart = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  onStudioClick = () => {},
  className = '',
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navCategories = [
    { id: 'all', label: 'All Products' },
    { id: 'band', label: 'Smart Bands' },
    { id: 'watch', label: 'Smart Watches' },
  ];

  const handleNavClick = (catId) => {
    onSelectCategory(catId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full glass-header backdrop-blur-md bg-white/85 border-b border-purple-100/70 shadow-xs transition-all ${className}`}
      data-testid="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('all')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              title="NOVA WEARABLES Home"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors">
                  NOVA WEARABLES
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                  Procedural Studio
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-full border border-slate-200/60">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleNavClick(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Cart & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Search Input / Trigger */}
            <div className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center bg-white rounded-full border border-purple-200 shadow-xs px-3 py-1.5 gap-2 transition-all w-48 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search wearables..."
                    className="w-full text-xs text-slate-800 bg-transparent focus:outline-hidden"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchExpanded(false);
                      onSearchChange('');
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                    title="Close Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  aria-label="Search"
                  title="Search wearables"
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50/70 rounded-full transition-all text-xs font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}
            </div>

            {/* Cart Drawer Trigger Button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="relative flex items-center justify-center p-2.5 text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-full transition-all focus:outline-hidden"
              title="View Cart Drawer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-t border-purple-100 px-4 py-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
            Browse Wearables
          </div>
          {navCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleNavClick(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-700 hover:bg-purple-50'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-cyan-300" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Header;
