/**
 * Domain Models and TypeScript Schemas
 * for Smart Watch & Fitness Band 3D Interactive Web Prototype
 */

export type ProductCategory = 'band' | 'watch';
export type Category = ProductCategory;

export type BandTier = 'standard' | 'pro';
export type WatchTier = 'standard' | 'pro' | 'pro_max';
export type ProductTier = BandTier | WatchTier;
export type Tier = ProductTier;

export type DeviceModelType =
  | 'band_standard'
  | 'band_pro'
  | 'watch_standard'
  | 'watch_pro'
  | 'watch_pro_max';

export type WatchFaceId = 'minimal' | 'neon' | 'chrono' | 'health';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSpecs {
  display: string;
  batteryLife: string;
  waterResistance: string;
  connectivity: string;
  sensors: string[];
  weight: string;
  casingMaterial: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: ProductSpecs;
  chassisColors: ColorOption[];
  strapColors: ColorOption[];
  defaultChassisColor: string;
  defaultStrapColor: string;
  defaultFace: WatchFaceId;
  featured: boolean;
  modelType: DeviceModelType;
}

export interface CartItem {
  id: string; // unique item composite key (productId + chassisColor + strapColor + selectedFace)
  productId: string;
  name: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  quantity: number;
  chassisColor: ColorOption;
  strapColor: ColorOption;
  selectedFace: WatchFaceId;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
}

// Viewer 3D and Widget Telemetry Models
export interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  city: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
}

export interface SimulatedWidgets {
  heartRate: number;
  isMeasuringHeartRate: boolean;
  steps: number;
  stepGoal: number;
  isPlayingMusic: boolean;
  currentTrack: MusicTrack;
  weather: WeatherData;
  battery: number;
}

export interface WatchFaceDefinition {
  id: WatchFaceId;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
}

export type CategoryFilter = 'all' | ProductCategory;
