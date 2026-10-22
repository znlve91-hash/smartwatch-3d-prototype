import React, { useState } from 'react';
import { ShoppingBag, ArrowLeftRight, Sparkles, Menu, X, Watch } from 'lucide-react';
import { ProductCategory } from '../../types';
import { Badge } from '../common/Badge';

export interface NavbarProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
  compareCount?: number;
  onOpenCompare?: () => void;
  selectedCategory?: ProductCategory | 'all';
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onLogoClick?: () => void;
}

const CATEGORY_LINKS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Devices' },
  { id: 'band', label: 'Fitness Bands' },
  { id: 'watch', label: 'Smart Watches' },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = 0,
  onOpenCart,
  compareCount = 0,
  onOpenCompare,
  selectedCategory = 'all',
  onSelectCategory,
  onLogoClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: ProductCategory | 'all') => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-purple-100/80 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Glowing Studio Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogoClick}
              className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-xl p-1 -m-1"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] text-white shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-200">
                <Watch className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06B6D4] ring-2 ring-white" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-slate-900 group-hover:text-[#7C3AED] transition-colors">
                  HORIZON
                </span>
                <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-400 -mt-1">
                  Wearables
                </span>
              </div>
            </button>

            <div className="hidden sm:inline-flex">
              <Badge variant="softCyan" size="sm" dot pulse>
                <Sparkles className="w-3 h-3 text-[#06B6D4] mr-0.5" />
                3D Studio
              </Badge>
            </div>
          </div>

          {/* Desktop Category Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-purple-50/70 border border-purple-100/60 shadow-inner">
            {CATEGORY_LINKS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCategoryClick(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Trigger Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Trigger Button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all duration-200 shadow-sm active:scale-95"
                aria-label={`Compare ${compareCount} devices`}
              >
                <ArrowLeftRight className="w-4 h-4 text-[#7C3AED]" />
                <span>{`Compare (${compareCount})`}</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full text-slate-700 bg-white hover:bg-purple-50 border border-purple-200/80 shadow-sm hover:shadow-md hover:shadow-purple-500/10 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full shadow-sm ring-2 ring-white animate-bounce-short">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700">
                Cart
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-purple-50 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-100/60 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1.5 px-2">
              <div className="px-3 py-1 mb-1">
                <Badge variant="softCyan" size="sm" dot pulse>
                  <Sparkles className="w-3 h-3 text-[#06B6D4] mr-0.5" />
                  3D Studio Live
                </Badge>
              </div>
              {CATEGORY_LINKS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryClick(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-purple-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
