// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

const h = React.createElement;

// Mock Three.js to keep headless tests fast and stable
vi.mock('three', () => {
  return {
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      domElement: document.createElement('canvas'),
    })),
    Scene: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      traverse: vi.fn(),
    })),
    PerspectiveCamera: vi.fn().mockImplementation(() => ({
      position: { set: vi.fn(), copy: vi.fn(), distanceTo: vi.fn().mockReturnValue(5) },
      lookAt: vi.fn(),
      aspect: 1,
      updateProjectionMatrix: vi.fn(),
    })),
    Group: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
      traverse: vi.fn(),
    })),
    AmbientLight: vi.fn().mockImplementation(() => ({})),
    DirectionalLight: vi.fn().mockImplementation(() => ({
      position: { set: vi.fn() },
    })),
    PointLight: vi.fn().mockImplementation(() => ({
      position: { set: vi.fn() },
    })),
    Color: vi.fn(),
    MeshPhysicalMaterial: vi.fn().mockImplementation(() => ({
      color: { set: vi.fn() },
      dispose: vi.fn(),
    })),
    MeshStandardMaterial: vi.fn().mockImplementation(() => ({
      color: { set: vi.fn() },
      dispose: vi.fn(),
    })),
    MeshBasicMaterial: vi.fn().mockImplementation(() => ({
      dispose: vi.fn(),
    })),
    CanvasTexture: vi.fn().mockImplementation(() => ({
      needsUpdate: false,
      dispose: vi.fn(),
    })),
    CylinderGeometry: vi.fn().mockImplementation(() => ({ dispose: vi.fn() })),
    BoxGeometry: vi.fn().mockImplementation(() => ({ dispose: vi.fn() })),
    TorusGeometry: vi.fn().mockImplementation(() => ({ dispose: vi.fn() })),
    SphereGeometry: vi.fn().mockImplementation(() => ({ dispose: vi.fn() })),
    Mesh: vi.fn().mockImplementation(() => ({
      position: { set: vi.fn() },
      rotation: { set: vi.fn() },
    })),
  };
});

import { Button } from '../src/components/common/Button';
import { Badge } from '../src/components/common/Badge';
import { Navbar } from '../src/components/layout/Navbar';
import { Footer } from '../src/components/layout/Footer';
import { TierFilter } from '../src/components/catalog/TierFilter';
import { ProductCard } from '../src/components/catalog/ProductCard';
import { ProductCatalog } from '../src/components/catalog/ProductCatalog';
import { CompareModal } from '../src/components/catalog/CompareModal';
import App from '../src/App';
import { products } from '../src/data/products';
import type { Product } from '../src/types';

describe('UI Primitives: Button and Badge', () => {
  describe('Button', () => {
    it('renders button with children text', () => {
      render(h(Button, null, 'Click Me'));
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeDefined();
    });

    it('handles click callback', () => {
      const handleClick = vi.fn();
      render(h(Button, { onClick: handleClick }, 'Submit'));
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire click when disabled', () => {
      const handleClick = vi.fn();
      render(h(Button, { disabled: true, onClick: handleClick }, 'Disabled Action'));
      const button = screen.getByRole('button', { name: /disabled action/i });
      expect((button as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies variant classes properly', () => {
      const { rerender } = render(h(Button, { variant: 'primary' }, 'Primary'));
      let button = screen.getByRole('button', { name: /primary/i });
      expect(button.className).toContain('bg-gradient-to-r');

      rerender(h(Button, { variant: 'outline' }, 'Outline'));
      button = screen.getByRole('button', { name: /outline/i });
      expect(button.className).toContain('border');

      rerender(h(Button, { variant: 'ghost' }, 'Ghost'));
      button = screen.getByRole('button', { name: /ghost/i });
      expect(button.className).toContain('hover:bg-purple-50');

      rerender(h(Button, { variant: 'pill' }, 'Pill'));
      button = screen.getByRole('button', { name: /pill/i });
      expect(button.className).toContain('rounded-full');
    });
  });

  describe('Badge', () => {
    it('renders badge content with correct styles', () => {
      render(h(Badge, { variant: 'purple' }, 'Pro Tier'));
      const badge = screen.getByText('Pro Tier');
      expect(badge).toBeDefined();
      expect(badge.className).toContain('text-purple-700');
    });

    it('supports cyan, neutral, and success variants', () => {
      const { rerender } = render(h(Badge, { variant: 'cyan' }, 'New'));
      expect(screen.getByText('New').className).toContain('text-cyan-700');

      rerender(h(Badge, { variant: 'neutral' }, 'Standard'));
      expect(screen.getByText('Standard').className).toContain('text-slate-700');

      rerender(h(Badge, { variant: 'success' }, 'In Stock'));
      expect(screen.getByText('In Stock').className).toContain('text-emerald-700');
    });
  });
});

describe('Navbar Component', () => {
  it('renders brand logo "AURA WEARABLES"', () => {
    render(h(Navbar, { cartCount: 0 }));
    expect(screen.getByText(/AURA/i)).toBeDefined();
    expect(screen.getByText(/WEARABLES/i)).toBeDefined();
  });

  it('renders primary navigation links', () => {
    render(h(Navbar, { cartCount: 0 }));
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('3D Studio Preview')).toBeDefined();
    expect(screen.getByText('Compare')).toBeDefined();
    expect(screen.getByText('Technology')).toBeDefined();
  });

  it('calls onNavigate when nav link is clicked', () => {
    const handleNavigate = vi.fn();
    render(h(Navbar, { cartCount: 0, onNavigate: handleNavigate }));
    fireEvent.click(screen.getByText('Products'));
    expect(handleNavigate).toHaveBeenCalledWith('catalog');

    fireEvent.click(screen.getByText('3D Studio Preview'));
    expect(handleNavigate).toHaveBeenCalledWith('studio');

    fireEvent.click(screen.getByText('Compare'));
    expect(handleNavigate).toHaveBeenCalledWith('compare');
  });

  it('renders cart count badge when cartCount > 0 and triggers onOpenCart', () => {
    const handleOpenCart = vi.fn();
    const { rerender } = render(h(Navbar, { cartCount: 0, onOpenCart: handleOpenCart }));
    expect(screen.queryByTestId('cart-count-badge')).toBeNull();

    rerender(h(Navbar, { cartCount: 3, onOpenCart: handleOpenCart }));
    const badge = screen.getByTestId('cart-count-badge');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('3');

    const cartBtn = screen.getByTestId('cart-toggle-btn');
    fireEvent.click(cartBtn);
    expect(handleOpenCart).toHaveBeenCalledTimes(1);
  });

  it('triggers search callback on search button click', () => {
    const handleSearch = vi.fn();
    render(h(Navbar, { cartCount: 0, onOpenSearch: handleSearch }));
    const searchBtn = screen.getByTestId('search-trigger-btn');
    fireEvent.click(searchBtn);
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });
});

describe('TierFilter Component', () => {
  it('renders tier options and highlights active tier', () => {
    const handleSelectTier = vi.fn();
    render(h(TierFilter, { activeTier: 'all', onSelectTier: handleSelectTier }));

    expect(screen.getByText('All Tiers')).toBeDefined();
    expect(screen.getByText('Standard')).toBeDefined();
    expect(screen.getByText('Pro')).toBeDefined();
    expect(screen.getByText('Pro Max')).toBeDefined();

    fireEvent.click(screen.getByText('Pro Max'));
    expect(handleSelectTier).toHaveBeenCalledWith('pro_max');
  });
});

describe('ProductCard Component', () => {
  const sampleProduct: Product = products[0]; // Aura Band Standard ($49, original $59)

  it('renders product card details', () => {
    render(h(ProductCard, { product: sampleProduct }));
    expect(screen.getByText(sampleProduct.name)).toBeDefined();
    expect(screen.getByText(sampleProduct.tagline)).toBeDefined();
    expect(screen.getByText('$49')).toBeDefined();
    expect(screen.getByText('$59')).toBeDefined(); // Original slashed price
  });

  it('renders color swatches and allows changing active color', () => {
    render(h(ProductCard, { product: sampleProduct }));
    const swatches = screen.getAllByRole('button', { name: /select color/i });
    expect(swatches.length).toBeGreaterThanOrEqual(2);

    // Click the second swatch
    fireEvent.click(swatches[1]);
    expect(swatches[1].getAttribute('aria-selected')).toBe('true');
  });

  it('triggers onPreview3D when "3D Studio" button is clicked', () => {
    const handlePreview = vi.fn();
    render(h(ProductCard, { product: sampleProduct, onPreview3D: handlePreview }));
    const previewBtn = screen.getByRole('button', { name: /3d studio/i });
    fireEvent.click(previewBtn);
    expect(handlePreview).toHaveBeenCalledWith(sampleProduct);
  });

  it('triggers onAddToCart when "Add to Bag" button is clicked', () => {
    const handleAdd = vi.fn();
    render(h(ProductCard, { product: sampleProduct, onAddToCart: handleAdd }));
    const addBtn = screen.getByRole('button', { name: /add to bag/i });
    fireEvent.click(addBtn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(
      sampleProduct,
      expect.objectContaining({ id: sampleProduct.colors[0].id }),
      sampleProduct.defaultFace
    );
  });

  it('displays key specifications', () => {
    render(h(ProductCard, { product: sampleProduct }));
    expect(screen.getByText(sampleProduct.specs.batteryLife)).toBeDefined();
    expect(screen.getByText(sampleProduct.specs.waterResistance)).toBeDefined();
  });
});

describe('ProductCatalog Component', () => {
  it('renders all 5 products initially', () => {
    render(h(ProductCatalog, { products }));
    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Aura Band Pro')).toBeDefined();
    expect(screen.getByText('Horizon Watch Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();
  });

  it('filters by category tabs (Smart Bands vs Smart Watches)', () => {
    render(h(ProductCatalog, { products }));

    // Click Smart Bands tab
    const bandsTab = screen.getByRole('tab', { name: /smart bands/i });
    fireEvent.click(bandsTab);

    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Aura Band Pro')).toBeDefined();
    expect(screen.queryByText('Horizon Watch Standard')).toBeNull();
    expect(screen.queryByText('Horizon Watch Pro Max')).toBeNull();

    // Click Smart Watches tab
    const watchesTab = screen.getByRole('tab', { name: /smart watches/i });
    fireEvent.click(watchesTab);

    expect(screen.queryByText('Aura Band Standard')).toBeNull();
    expect(screen.getByText('Horizon Watch Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();

    // Click All tab
    const allTab = screen.getByRole('tab', { name: /all/i });
    fireEvent.click(allTab);
    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();
  });

  it('filters by tier pills', () => {
    render(h(ProductCatalog, { products }));

    // Filter by Pro Max tier
    const proMaxPill = screen.getByRole('button', { name: /^pro max$/i });
    fireEvent.click(proMaxPill);

    expect(screen.queryByText('Aura Band Standard')).toBeNull();
    expect(screen.queryByText('Horizon Watch Pro')).toBeNull();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();

    // Filter by Standard tier
    const stdPill = screen.getByRole('button', { name: /^standard$/i });
    fireEvent.click(stdPill);

    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Standard')).toBeDefined();
    expect(screen.queryByText('Horizon Watch Pro Max')).toBeNull();
  });

  it('filters by search input', () => {
    render(h(ProductCatalog, { products }));
    const searchInput = screen.getByPlaceholderText(/search wearables/i);

    // Search for "Titanium"
    fireEvent.change(searchInput, { target: { value: 'Titanium' } });
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();
    expect(screen.queryByText('Aura Band Standard')).toBeNull();

    // Search for non-existent keyword
    fireEvent.change(searchInput, { target: { value: 'NonexistentGadget123' } });
    expect(screen.getByText(/no matching wearables/i)).toBeDefined();

    // Reset filters
    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();
  });

  it('sorts products by price and rating', () => {
    render(h(ProductCatalog, { products }));
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });

    // Sort by price ascending
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
    const cardsAsc = screen.getAllByRole('article');
    expect(within(cardsAsc[0]).getByText('Aura Band Standard')).toBeDefined(); // $49
    expect(within(cardsAsc[cardsAsc.length - 1]).getByText('Horizon Watch Pro Max')).toBeDefined(); // $399

    // Sort by price descending
    fireEvent.change(sortSelect, { target: { value: 'price_desc' } });
    const cardsDesc = screen.getAllByRole('article');
    expect(within(cardsDesc[0]).getByText('Horizon Watch Pro Max')).toBeDefined(); // $399
    expect(within(cardsDesc[cardsDesc.length - 1]).getByText('Aura Band Standard')).toBeDefined(); // $49
  });

  it('invokes onOpenCompare when compare button is clicked', () => {
    const handleOpenCompare = vi.fn();
    render(h(ProductCatalog, { products, onOpenCompare: handleOpenCompare }));
    const compareBtn = screen.getByRole('button', { name: /compare all models/i });
    fireEvent.click(compareBtn);
    expect(handleOpenCompare).toHaveBeenCalledTimes(1);
  });
});

describe('CompareModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(h(CompareModal, { isOpen: false, onClose: vi.fn() }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders side-by-side comparison matrix when isOpen is true', () => {
    render(h(CompareModal, { isOpen: true, onClose: vi.fn() }));
    const modal = screen.getByRole('dialog');
    expect(modal).toBeDefined();

    expect(screen.getByText('Wearable Hardware Comparison')).toBeDefined();
    // Default or watch category specs
    expect(screen.getByText('Display')).toBeDefined();
    expect(screen.getByText('Case Material')).toBeDefined();
    expect(screen.getByText('Battery Life')).toBeDefined();
    expect(screen.getByText('Water Resistance')).toBeDefined();
  });

  it('switches between Smart Bands and Smart Watches comparison tables', () => {
    render(h(CompareModal, { isOpen: true, onClose: vi.fn() }));

    // Switch to Smart Bands
    const bandTab = screen.getByRole('button', { name: /smart bands/i });
    fireEvent.click(bandTab);

    expect(screen.getByText('Aura Band Standard')).toBeDefined();
    expect(screen.getByText('Aura Band Pro')).toBeDefined();
    expect(screen.queryByText('Horizon Watch Pro Max')).toBeNull();

    // Switch back to Smart Watches
    const watchTab = screen.getByRole('button', { name: /smart watches/i });
    fireEvent.click(watchTab);

    expect(screen.getByText('Horizon Watch Standard')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro')).toBeDefined();
    expect(screen.getByText('Horizon Watch Pro Max')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(h(CompareModal, { isOpen: true, onClose: handleClose }));
    const closeBtn = screen.getByRole('button', { name: /close comparison/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onSelectProduct when "Configure in 3D" is clicked', () => {
    const handleSelectProduct = vi.fn();
    render(h(CompareModal, { isOpen: true, onClose: vi.fn(), onSelectProduct: handleSelectProduct }));
    const configureBtns = screen.getAllByRole('button', { name: /configure in 3d/i });
    expect(configureBtns.length).toBeGreaterThan(0);
    fireEvent.click(configureBtns[0]);
    expect(handleSelectProduct).toHaveBeenCalledTimes(1);
  });
});

describe('App Integration', () => {
  it('renders application shell with all primary sections', () => {
    render(h(App));

    // Navbar
    expect(screen.getAllByText(/AURA/i).length).toBeGreaterThan(0);

    // Hero Section
    expect(screen.getByText(/Next-Gen Biometrics/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /explore in 3d studio/i })).toBeDefined();

    // 3D Studio Section
    expect(screen.getAllByText(/3D Interactive Studio/i).length).toBeGreaterThan(0);

    // Catalog Section
    expect(screen.getAllByText('Aura Band Standard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Horizon Watch Pro Max').length).toBeGreaterThan(0);

    // Footer
    expect(screen.getByText(/AURA Wearables Inc/i)).toBeDefined();
  });

  it('clicking "3D Studio" on a product card updates active studio product', () => {
    render(h(App));

    // Find 3D Studio button for Aura Band Standard
    const previewButtons = screen.getAllByRole('button', { name: /3d studio/i });
    fireEvent.click(previewButtons[0]);

    // Studio active product indicator updates
    expect(screen.getByTestId('studio-active-title')).toBeDefined();
  });

  it('clicking "Add to Bag" updates cart count and shows notification', () => {
    render(h(App));
    const addButtons = screen.getAllByRole('button', { name: /add to bag/i });
    fireEvent.click(addButtons[0]);

    // Cart badge appears in navbar
    const cartBadge = screen.getByTestId('cart-count-badge');
    expect(cartBadge.textContent).toBe('1');
    // Toast notification appears
    expect(screen.getByText(/Added to your bag!/i)).toBeDefined();
  });

  it('opens and closes comparison modal from navbar and catalog trigger', () => {
    render(h(App));

    // Open from compare button in catalog
    const compareTrigger = screen.getByRole('button', { name: /compare all models/i });
    fireEvent.click(compareTrigger);

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Wearable Hardware Comparison')).toBeDefined();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /close comparison/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
