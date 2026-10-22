/**
 * NOVA WEARABLES - Application Root Component
 * Orchestrating Header, Hero 3D Showcase, Catalog Filtering, Detail 3D Modal, Cart Drawer, Checkout & Toasts
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/common/Header.jsx';
import { Footer } from './components/common/Footer.jsx';
import { HeroSection } from './components/hero/HeroSection.jsx';
import { ProductFilter } from './components/catalog/ProductFilter.jsx';
import { ProductGrid } from './components/catalog/ProductGrid.jsx';
import { ProductDetailModal } from './components/catalog/ProductDetailModal.jsx';
import { CartDrawer } from './components/cart/CartDrawer.jsx';
import { CheckoutModal } from './components/cart/CheckoutModal.jsx';
import { ToastProvider, useToast } from './components/common/Toast.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { useCart } from './hooks/useCart.js';
import { PRODUCTS } from './data/products.js';

function AppContent() {
  const {
    totalCount,
    addItem,
    isCartOpen,
    openCart,
    closeCart,
    isCheckoutOpen,
    closeCheckout,
  } = useCart();
  const { success } = useToast();

  // Catalog Filter & Search States
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTier, setActiveTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('featured');

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalInitialColor, setModalInitialColor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by tier
    if (activeTier !== 'all') {
      result = result.filter((p) => p.tier === activeTier);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(q))) ||
          (p.specs?.casingMaterial && p.specs.casingMaterial.toLowerCase().includes(q))
      );
    }

    // Sort products
    switch (activeSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, activeTier, searchQuery, activeSort]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveTier('all');
    setSearchQuery('');
    setActiveSort('featured');
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === 'band' && activeTier === 'pro_max') {
      setActiveTier('all');
    }
  };

  const handleAddToCart = (product, color, face, quantity = 1) => {
    const chosenColor = color || (product.colors && product.colors[0]);
    const chosenFace = face || product.defaultWatchFace || 'minimal';
    addItem(product, chosenColor, chosenFace, quantity);
    success(
      `Added ${quantity > 1 ? `${quantity}x ` : ''}${product.name} (${chosenColor?.name || 'Standard'}) to cart!`
    );
  };

  const handleTryIn3D = (product, color) => {
    setSelectedProduct(product);
    setModalInitialColor(color || (product.colors && product.colors[0]));
    setIsModalOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setModalInitialColor(product.colors && product.colors[0]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F6FF] flex flex-col font-sans text-slate-900 antialiased selection:bg-purple-200 selection:text-purple-900">
      {/* Global Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        cartCount={totalCount}
        onOpenCart={openCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Showcase & Catalog Area */}
      <main className="flex-1">
        {/* Hero Section with Interactive Procedural 3D Viewer */}
        <HeroSection
          onExploreClick={() => {
            const el = document.getElementById('catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Product Catalog Section */}
        <section
          id="catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8"
        >
          {/* Segmented Filter Bar */}
          <ProductFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategorySelect}
            activeTier={activeTier}
            onTierChange={setActiveTier}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            totalCount={filteredProducts.length}
            onResetFilters={handleResetFilters}
          />

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onTryIn3D={handleTryIn3D}
            onSelectProduct={handleSelectProduct}
            onResetFilters={handleResetFilters}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Deep-Dive Product Detail Modal with 3D Viewer */}
      <ProductDetailModal
        isOpen={isModalOpen}
        product={selectedProduct}
        initialColor={modalInitialColor}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Simulated 2-Step Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
