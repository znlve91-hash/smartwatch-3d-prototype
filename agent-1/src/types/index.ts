export type ProductCategory = 'band' | 'watch';
export type ProductTier = 'standard' | 'pro' | 'pro_max';

export type WatchFaceId = 'minimal' | 'neon' | 'chrono' | 'health';
export type ActiveWidgetId = 'heart_rate' | 'steps' | 'weather' | 'music' | 'battery';

export type WatchModelType = 'band_capsule' | 'watch_round' | 'watch_squircle';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  caseHex: string;
  strapHex: string;
}

export interface ProductSpecification {
  display: string;
  caseMaterial: string;
  strapMaterial: string;
  batteryLife: string;
  waterResistance: string;
  sensors: string[];
  connectivity: string[];
  weight: string;
  dimensions: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  featured?: boolean;
  colors: ColorOption[];
  defaultColorId: string;
  defaultFace: WatchFaceId;
  specs: ProductSpecification;
  features: string[];
  description: string;
  // 3D Canvas configuration hints
  modelType: WatchModelType;
  bezelThickness: number;
  caseSizeMm: number;
}

export interface CartItem {
  id: string; // unique item uuid (product.id + color + strap + face)
  productId: string;
  name: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  quantity: number;
  selectedColor: ColorOption;
  selectedFace: WatchFaceId;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;
  taxRate: number; // default 0.08 (8%)
  shippingCost: number; // default $0 (Free shipping prototype)
}
