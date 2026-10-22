import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Badge } from '../src/components/common/Badge';
import { Button } from '../src/components/common/Button';

const h = React.createElement;

describe('Common Components: Badge & Button', () => {
  describe('Badge', () => {
    it('should render children text correctly', () => {
      const html = renderToString(h(Badge, null, 'Test Badge'));
      expect(html).toContain('Test Badge');
      expect(html).toContain('inline-flex');
    });

    it('should support color variants', () => {
      const violetHtml = renderToString(h(Badge, { variant: 'violet' }, 'Violet'));
      expect(violetHtml).toContain('text-[#7C3AED]');

      const cyanHtml = renderToString(h(Badge, { variant: 'cyan' }, 'Cyan'));
      expect(cyanHtml).toContain('text-[#06B6D4]');

      const softCyanHtml = renderToString(h(Badge, { variant: 'softCyan' }, 'Soft Cyan'));
      expect(softCyanHtml).toContain('bg-[#E0F7FA]');

      const saleHtml = renderToString(h(Badge, { variant: 'sale' }, 'Sale'));
      expect(saleHtml).toContain('text-rose');
    });

    it('should render a glowing dot when dot=true', () => {
      const html = renderToString(h(Badge, { dot: true, pulse: true }, 'Live'));
      expect(html).toContain('animate-ping');
      expect(html).toContain('rounded-full');
    });

    it('should support custom sizes', () => {
      const smHtml = renderToString(h(Badge, { size: 'sm' }, 'Small'));
      expect(smHtml).toContain('text-[11px]');

      const lgHtml = renderToString(h(Badge, { size: 'lg' }, 'Large'));
      expect(lgHtml).toContain('text-sm');
    });
  });

  describe('Button', () => {
    it('should render button text and default primary styling', () => {
      const html = renderToString(h(Button, null, 'Click Me'));
      expect(html).toContain('Click Me');
      expect(html).toContain('bg-[#7C3AED]');
    });

    it('should support different variants', () => {
      const secondaryHtml = renderToString(h(Button, { variant: 'secondary' }, 'Secondary'));
      expect(secondaryHtml).toContain('bg-slate-900');

      const cyanHtml = renderToString(h(Button, { variant: 'cyan' }, 'Cyan'));
      expect(cyanHtml).toContain('bg-[#06B6D4]');

      const outlineHtml = renderToString(h(Button, { variant: 'outline' }, 'Outline'));
      expect(outlineHtml).toContain('border-purple');

      const ghostHtml = renderToString(h(Button, { variant: 'ghost' }, 'Ghost'));
      expect(ghostHtml).toContain('hover:bg-purple-50');
    });

    it('should render disabled state and opacity classes', () => {
      const html = renderToString(h(Button, { disabled: true }, 'Disabled'));
      expect(html).toContain('disabled');
      expect(html).toContain('opacity-50');
    });

    it('should render loading spinner when isLoading is true', () => {
      const html = renderToString(h(Button, { isLoading: true }, 'Loading'));
      expect(html).toContain('animate-spin');
    });

    it('should support icon placement', () => {
      const icon = h('span', { 'data-testid': 'test-icon' }, '★');
      const htmlLeft = renderToString(h(Button, { icon, iconPosition: 'left' }, 'Star'));
      expect(htmlLeft).toContain('★');
      expect(htmlLeft).toContain('Star');

      const htmlRight = renderToString(h(Button, { icon, iconPosition: 'right' }, 'Star'));
      expect(htmlRight).toContain('★');
    });
  });
});

describe('Layout Components: Navbar & Footer', () => {
  describe('Navbar', () => {
    it('should render brand logo, glowing badge, and category links', async () => {
      const { Navbar } = await import('../src/components/layout/Navbar');
      const html = renderToString(
        h(Navbar, {
          cartItemCount: 0,
          compareCount: 0,
          selectedCategory: 'all',
        })
      );

      expect(html).toContain('HORIZON');
      expect(html).toContain('All Devices');
      expect(html).toContain('Fitness Bands');
      expect(html).toContain('Smart Watches');
      expect(html).toContain('3D Studio');
    });

    it('should render cart badge counter when cartItemCount > 0', async () => {
      const { Navbar } = await import('../src/components/layout/Navbar');
      const html = renderToString(
        h(Navbar, {
          cartItemCount: 3,
        })
      );

      expect(html).toContain('3');
      expect(html).toContain('Cart');
    });

    it('should render comparison button with count when compareCount > 0', async () => {
      const { Navbar } = await import('../src/components/layout/Navbar');
      const html = renderToString(
        h(Navbar, {
          compareCount: 2,
        })
      );

      expect(html).toContain('Compare (2)');
    });

    it('should highlight active category', async () => {
      const { Navbar } = await import('../src/components/layout/Navbar');
      const html = renderToString(
        h(Navbar, {
          selectedCategory: 'band',
        })
      );

      expect(html).toContain('Fitness Bands');
      expect(html).toContain('bg-[#7C3AED]');
    });
  });

  describe('Footer', () => {
    it('should render footer branding, product links, and tech badges', async () => {
      const { Footer } = await import('../src/components/layout/Footer');
      const html = renderToString(h(Footer, null));

      expect(html).toContain('HORIZON');
      expect(html).toContain('PulseBand');
      expect(html).toContain('Horizon Watch');
      expect(html).toContain('Procedural 3D Engine');
      expect(html).toContain('All rights reserved');
    });
  });
});

describe('Catalog Components: FilterTabs & Filtering Logic', () => {
  it('should export pure filterProducts utility that filters accurately', async () => {
    const { filterProducts } = await import('../src/components/catalog/FilterTabs');
    const { PRODUCTS } = await import('../src/data/products');

    // All / All
    expect(filterProducts(PRODUCTS, 'all', 'all').length).toBe(5);

    // By category
    const bands = filterProducts(PRODUCTS, 'band', 'all');
    expect(bands.length).toBe(2);
    expect(bands.every((p) => p.category === 'band')).toBe(true);

    const watches = filterProducts(PRODUCTS, 'watch', 'all');
    expect(watches.length).toBe(3);
    expect(watches.every((p) => p.category === 'watch')).toBe(true);

    // By tier
    const standardAll = filterProducts(PRODUCTS, 'all', 'standard');
    expect(standardAll.length).toBe(2);

    const proAll = filterProducts(PRODUCTS, 'all', 'pro');
    expect(proAll.length).toBe(2);

    const proMaxAll = filterProducts(PRODUCTS, 'all', 'pro_max');
    expect(proMaxAll.length).toBe(1);
    expect(proMaxAll[0].id).toBe('horizon-watch-pro-max');

    // By category AND tier
    const bandPro = filterProducts(PRODUCTS, 'band', 'pro');
    expect(bandPro.length).toBe(1);
    expect(bandPro[0].id).toBe('pulseband-pro');

    const bandProMax = filterProducts(PRODUCTS, 'band', 'pro_max');
    expect(bandProMax.length).toBe(0);

    const watchPro = filterProducts(PRODUCTS, 'watch', 'pro');
    expect(watchPro.length).toBe(1);
    expect(watchPro[0].id).toBe('horizon-watch-pro');
  });

  it('should return available tiers per category correctly', async () => {
    const { getAvailableTiersForCategory } = await import(
      '../src/components/catalog/FilterTabs'
    );

    expect(getAvailableTiersForCategory('all')).toEqual([
      'all',
      'standard',
      'pro',
      'pro_max',
    ]);
    expect(getAvailableTiersForCategory('band')).toEqual(['all', 'standard', 'pro']);
    expect(getAvailableTiersForCategory('watch')).toEqual([
      'all',
      'standard',
      'pro',
      'pro_max',
    ]);
  });

  it('should render category tabs and tier filter buttons', async () => {
    const { FilterTabs } = await import('../src/components/catalog/FilterTabs');
    const html = renderToString(
      h(FilterTabs, {
        selectedCategory: 'all',
        onCategoryChange: () => {},
        selectedTier: 'all',
        onTierChange: () => {},
        counts: {
          total: 5,
          band: 2,
          watch: 3,
        },
      })
    );

    expect(html).toContain('All Devices');
    expect(html).toContain('Fitness Bands');
    expect(html).toContain('Smart Watches');
    expect(html).toContain('All Tiers');
    expect(html).toContain('Standard');
    expect(html).toContain('Pro');
    expect(html).toContain('Pro Max');
  });

  it('should omit Pro Max tier when category is band', async () => {
    const { FilterTabs } = await import('../src/components/catalog/FilterTabs');
    const html = renderToString(
      h(FilterTabs, {
        selectedCategory: 'band',
        onCategoryChange: () => {},
        selectedTier: 'all',
        onTierChange: () => {},
      })
    );

    expect(html).toContain('Standard');
    expect(html).toContain('Pro');
    expect(html).not.toContain('Pro Max');
  });
});

describe('Catalog Components: ProductCard', () => {
  it('should render device details, pricing, tier badge, and spec pills', async () => {
    const { ProductCard } = await import('../src/components/catalog/ProductCard');
    const { PRODUCTS } = await import('../src/data/products');
    const product = PRODUCTS[1]; // PulseBand Pro ($89, sale from $109)

    const html = renderToString(
      h(ProductCard, {
        product,
        isCompared: false,
        onToggleCompare: () => {},
      })
    );

    expect(html).toContain('PulseBand Pro');
    expect(html).toContain('Curved AMOLED with standalone GPS');
    expect(html).toContain('$89');
    expect(html).toContain('$109');
    expect(html).toContain('Best Value');
    expect(html).toContain('Pro');
    expect(html).toContain('Curved AMOLED');
    expect(html).toContain('Up to 10 days');
    expect(html).toContain('5 ATM (50m)');
    // Action trigger
    expect(html).toContain('Preview in 3D');
  });

  it('should render color swatches for chassis and straps', async () => {
    const { ProductCard } = await import('../src/components/catalog/ProductCard');
    const { PRODUCTS } = await import('../src/data/products');
    const product = PRODUCTS[0]; // PulseBand 2

    const html = renderToString(
      h(ProductCard, {
        product,
        isCompared: false,
        onToggleCompare: () => {},
      })
    );

    expect(html).toContain('Chassis');
    expect(html).toContain('Straps');
    expect(html).toContain('Obsidian Black');
    expect(html).toContain('Frost Silver');
  });

  it('should reflect comparison state and disable when cap reached', async () => {
    const { ProductCard } = await import('../src/components/catalog/ProductCard');
    const { PRODUCTS } = await import('../src/data/products');
    const product = PRODUCTS[2];

    const uncomparedHtml = renderToString(
      h(ProductCard, {
        product,
        isCompared: false,
        onToggleCompare: () => {},
      })
    );
    expect(uncomparedHtml).toContain('Compare');

    const comparedHtml = renderToString(
      h(ProductCard, {
        product,
        isCompared: true,
        onToggleCompare: () => {},
      })
    );
    expect(comparedHtml).toContain('Compared');

    const disabledHtml = renderToString(
      h(ProductCard, {
        product,
        isCompared: false,
        disableCompare: true,
        onToggleCompare: () => {},
      })
    );
    expect(disabledHtml).toContain('disabled');
  });
});

describe('Catalog Components: ComparisonModal', () => {
  it('should export all 8 technical comparison dimensions', async () => {
    const { COMPARISON_DIMENSIONS } = await import(
      '../src/components/catalog/ComparisonModal'
    );

    expect(COMPARISON_DIMENSIONS.length).toBe(8);
    const ids = COMPARISON_DIMENSIONS.map((d) => d.id);
    expect(ids).toContain('display');
    expect(ids).toContain('battery');
    expect(ids).toContain('waterResistance');
    expect(ids).toContain('sensors');
    expect(ids).toContain('weight');
    expect(ids).toContain('casing');
    expect(ids).toContain('connectivity');
    expect(ids).toContain('price');
  });

  it('should render side-by-side comparison for up to 3 devices', async () => {
    const { ComparisonModal } = await import(
      '../src/components/catalog/ComparisonModal'
    );
    const { PRODUCTS } = await import('../src/data/products');
    const compared = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[4]]; // 3 devices

    const html = renderToString(
      h(ComparisonModal, {
        isOpen: true,
        onClose: () => {},
        products: compared,
      })
    );

    expect(html).toContain('Device Specification Comparison');
    expect(html).toContain('PulseBand 2');
    expect(html).toContain('Horizon Watch SE');
    expect(html).toContain('Horizon Watch Pro Max');

    // Check all 8 dimension labels in modal
    expect(html).toContain('Display');
    expect(html).toContain('Battery Life');
    expect(html).toContain('Water Resistance');
    expect(html).toContain('Sensors');
    expect(html).toContain('Weight');
    expect(html).toContain('Casing Material');
    expect(html).toContain('Connectivity');
    expect(html).toContain('Price');

    // Values
    expect(html).toContain('$49');
    expect(html).toContain('$179');
    expect(html).toContain('$449');
  });

  it('should render empty state when no products are passed', async () => {
    const { ComparisonModal } = await import(
      '../src/components/catalog/ComparisonModal'
    );

    const html = renderToString(
      h(ComparisonModal, {
        isOpen: true,
        onClose: () => {},
        products: [],
      })
    );

    expect(html).toContain('No devices selected for comparison');
  });

  it('should not render anything when isOpen is false', async () => {
    const { ComparisonModal } = await import(
      '../src/components/catalog/ComparisonModal'
    );
    const { PRODUCTS } = await import('../src/data/products');

    const html = renderToString(
      h(ComparisonModal, {
        isOpen: false,
        onClose: () => {},
        products: [PRODUCTS[0]],
      })
    );

    expect(html).toBe('');
  });
});

describe('Catalog Components: ProductCatalog Integration', () => {
  it('should render all 5 devices with FilterTabs and grid layout', async () => {
    const { ProductCatalog } = await import(
      '../src/components/catalog/ProductCatalog'
    );
    const { ViewerProvider } = await import('../src/context/ViewerContext');

    const html = renderToString(
      h(ViewerProvider, null, h(ProductCatalog, null))
    );

    expect(html).toContain('PulseBand 2');
    expect(html).toContain('PulseBand Pro');
    expect(html).toContain('Horizon Watch SE');
    expect(html).toContain('Horizon Watch Pro');
    expect(html).toContain('Horizon Watch Pro Max');
    expect(html).toContain('All Devices');
  });

  it('should support initialCategory and initialTier props', async () => {
    const { ProductCatalog } = await import(
      '../src/components/catalog/ProductCatalog'
    );
    const { ViewerProvider } = await import('../src/context/ViewerContext');

    const html = renderToString(
      h(ViewerProvider, null, h(ProductCatalog, {
        initialCategory: 'band',
        initialTier: 'standard',
      }))
    );

    expect(html).toContain('PulseBand 2');
    expect(html).not.toContain('PulseBand Pro');
    expect(html).not.toContain('Horizon Watch SE');
  });
});

describe('Catalog Interactive Handlers and Callbacks', () => {
  it('should invoke onToggleCompare and onAddToCart on ProductCard', async () => {
    const { ProductCard } = await import('../src/components/catalog/ProductCard');
    const { PRODUCTS } = await import('../src/data/products');

    const onToggle = vi.fn();
    const onAdd = vi.fn();
    const onPreview = vi.fn();

    const element = h(ProductCard, {
      product: PRODUCTS[0],
      onToggleCompare: onToggle,
      onAddToCart: onAdd,
      onPreviewIn3D: onPreview,
    });

    const html = renderToString(element);
    expect(html).toContain('PulseBand 2');

    element.props.onToggleCompare(PRODUCTS[0]);
    expect(onToggle).toHaveBeenCalledWith(PRODUCTS[0]);

    element.props.onAddToCart(PRODUCTS[0]);
    expect(onAdd).toHaveBeenCalledWith(PRODUCTS[0]);

    element.props.onPreviewIn3D(PRODUCTS[0]);
    expect(onPreview).toHaveBeenCalledWith(PRODUCTS[0]);
  });

  it('should invoke onRemoveProduct and onClearAll on ComparisonModal', async () => {
    const { ComparisonModal } = await import('../src/components/catalog/ComparisonModal');
    const { PRODUCTS } = await import('../src/data/products');

    const onRemove = vi.fn();
    const onClear = vi.fn();
    const onClose = vi.fn();
    const onPreview = vi.fn();

    const element = h(ComparisonModal, {
      isOpen: true,
      products: [PRODUCTS[0], PRODUCTS[1]],
      onRemoveProduct: onRemove,
      onClearAll: onClear,
      onClose: onClose,
      onPreviewIn3D: onPreview,
    });

    element.props.onRemoveProduct('pulseband-2');
    expect(onRemove).toHaveBeenCalledWith('pulseband-2');

    element.props.onClearAll();
    expect(onClear).toHaveBeenCalled();

    element.props.onClose();
    expect(onClose).toHaveBeenCalled();

    element.props.onPreviewIn3D('pulseband-pro');
    expect(onPreview).toHaveBeenCalledWith('pulseband-pro');
  });

  it('should invoke onSelectCategory, onOpenCart, and onOpenCompare on Navbar', async () => {
    const { Navbar } = await import('../src/components/layout/Navbar');

    const onSelectCategory = vi.fn();
    const onOpenCart = vi.fn();
    const onOpenCompare = vi.fn();

    const element = h(Navbar, {
      cartItemCount: 2,
      compareCount: 3,
      onSelectCategory,
      onOpenCart,
      onOpenCompare,
    });

    element.props.onSelectCategory('band');
    expect(onSelectCategory).toHaveBeenCalledWith('band');

    element.props.onOpenCart();
    expect(onOpenCart).toHaveBeenCalled();

    element.props.onOpenCompare();
    expect(onOpenCompare).toHaveBeenCalled();
  });
});




