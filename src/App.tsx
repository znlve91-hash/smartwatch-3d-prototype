import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Palette,
  Check,
  Watch,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ViewerProvider, useViewer } from './context/ViewerContext';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS, WATCH_FACES } from './data/products';
import { ColorOption, ProductCategory, WatchFaceId } from './types';
import { formatCurrency, formatTierName } from './utils/formatters';

// Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WatchViewer3D } from './components/viewer3d/WatchViewer3D';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { Button } from './components/common/Button';
import { Badge } from './components/common/Badge';

export const AppContent: React.FC = () => {
  const {
    selectedProductId,
    selectedProduct,
    setSelectedProductId,
    selectedChassisColor,
    setSelectedChassisColor,
    selectedStrapColor,
    setSelectedStrapColor,
    selectedWatchFace,
    setSelectedWatchFace,
  } = useViewer();

  const {
    totalItemsCount,
    openCart,
    addItem,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const handleAddCustomizedToCart = () => {
    addItem({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      category: selectedProduct.category,
      tier: selectedProduct.tier,
      price: selectedProduct.price,
      chassisColor: selectedChassisColor,
      strapColor: selectedStrapColor,
      selectedFace: selectedWatchFace,
    });
    openCart();
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FF] text-slate-900 selection:bg-purple-200 selection:text-purple-900">
      {/* 1. Header Navigation */}
      <Navbar
        cartItemCount={totalItemsCount}
        onOpenCart={openCart}
        selectedCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleScrollToCatalog();
        }}
        onLogoClick={() => {
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <main className="flex-1">
        {/* 2. Hero 3D Interactive Studio Section */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="softCyan" size="md" dot pulse>
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4] mr-0.5" />
                3D Interactive Studio
              </Badge>
              <Badge variant="violet" size="md">
                Procedural Three.js Engine
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Personalize Your Wearable in Real Time.
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Explore 360° orbit rotation, test dynamic watch face layouts, customize titanium chassis finishes and strap colors, and simulate smart biosensor widgets.
            </p>
          </div>

          {/* 3D Viewport Stage */}
          <div className="mb-6">
            <WatchViewer3D />
          </div>

          {/* Hardware Customizer Dock / Customizer Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-purple-100 shadow-xl shadow-purple-500/5 space-y-6">
            {/* Quick Model Selector Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-purple-100/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-[#7C3AED]" />
                <span>Select Hardware Model:</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {PRODUCTS.map((prod) => {
                  const isSelected = prod.id === selectedProductId;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-500/20'
                          : 'bg-purple-50/70 text-slate-600 hover:text-slate-900 hover:bg-purple-100'
                      }`}
                    >
                      <span>{prod.name}</span>
                      <span className="ml-1.5 opacity-80 text-[10px]">
                        {formatCurrency(prod.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Options Grid: Chassis Finishes, Strap Colors, Watch Faces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Chassis Finish Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Chassis Finish:</span>
                  <span className="font-semibold text-[#7C3AED]">{selectedChassisColor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.chassisColors.map((color) => {
                    const isSelected = color.id === selectedChassisColor.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedChassisColor(color)}
                        title={color.name}
                        className={`group relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          isSelected
                            ? 'border-[#7C3AED] ring-2 ring-purple-400/30 scale-105'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <span
                          className="w-full h-full rounded-full shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        {isSelected && (
                          <Check className="absolute w-3.5 h-3.5 text-white stroke-[3] drop-shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 2: Strap Color Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Strap Color:</span>
                  <span className="font-semibold text-[#06B6D4]">{selectedStrapColor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.strapColors.map((color) => {
                    const isSelected = color.id === selectedStrapColor.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedStrapColor(color)}
                        title={color.name}
                        className={`group relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          isSelected
                            ? 'border-[#06B6D4] ring-2 ring-cyan-400/30 scale-105'
                            : 'border-slate-200 hover:border-cyan-300'
                        }`}
                      >
                        <span
                          className="w-full h-full rounded-full shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        {isSelected && (
                          <Check className="absolute w-3.5 h-3.5 text-white stroke-[3] drop-shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 3: Dynamic Watch Face Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Watch Face:</span>
                  <span className="font-semibold text-slate-900 capitalize">{selectedWatchFace}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {WATCH_FACES.map((face) => {
                    const isSelected = face.id === selectedWatchFace;
                    return (
                      <button
                        key={face.id}
                        type="button"
                        onClick={() => setSelectedWatchFace(face.id)}
                        className={`px-2 py-1.5 rounded-xl text-xs font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white shadow-sm'
                            : 'bg-purple-50/60 hover:bg-purple-100 text-slate-600'
                        }`}
                      >
                        {face.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Customizer Bar: Price & Add Customized to Cart Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-purple-100/80">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm font-semibold line-through text-slate-400">
                    {formatCurrency(selectedProduct.originalPrice)}
                  </span>
                )}
                <Badge variant="violet" size="sm">
                  {formatTierName(selectedProduct.tier)}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleScrollToCatalog}
                  variant="outline"
                  size="md"
                  icon={<Layers className="w-4 h-4 text-[#7C3AED]" />}
                >
                  Browse Catalog
                </Button>

                <Button
                  onClick={handleAddCustomizedToCart}
                  variant="primary"
                  size="md"
                  icon={<ShoppingBag className="w-4 h-4" />}
                  className="shadow-lg shadow-purple-500/25 active:scale-95 px-6"
                >
                  Add Customized to Cart
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Product Catalog Section */}
        <ProductCatalog
          initialCategory={activeCategory}
          onAddToCart={(product) => {
            addItem({
              productId: product.id,
              name: product.name,
              category: product.category,
              tier: product.tier,
              price: product.price,
              chassisColor: product.chassisColors[0],
              strapColor: product.strapColors[0],
              selectedFace: product.defaultFace,
            });
            openCart();
          }}
        />
      </main>

      {/* 4. Slide-over Shopping Cart Drawer */}
      <CartDrawer />

      {/* 5. Two-Step Simulated Checkout Modal */}
      <CheckoutModal />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ViewerProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ViewerProvider>
  );
};

export default App;
