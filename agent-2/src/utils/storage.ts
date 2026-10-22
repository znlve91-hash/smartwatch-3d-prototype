/**
 * Safe LocalStorage wrapper with JSON serialization and in-memory fallback.
 * Prevents runtime crashes when localStorage is restricted, disabled, or unavailable.
 */

export const STORAGE_KEYS = {
  CART: 'antigravity_smartwatch_cart_v1',
} as const;

class MemoryStorageFallback {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryFallback = new MemoryStorageFallback();

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely retrieves and deserializes a JSON value from storage.
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    if (isLocalStorageAvailable()) {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } else {
      const item = memoryFallback.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.warn(`[storage] Failed to read key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely serializes and persists a value to storage.
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    memoryFallback.setItem(key, serialized);

    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, serialized);
    }
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to write key "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes a key from storage.
 */
export function removeStorageItem(key: string): boolean {
  try {
    memoryFallback.removeItem(key);

    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to remove key "${key}":`, error);
    return false;
  }
}

/**
 * Safely clears storage.
 */
export function clearStorage(): boolean {
  try {
    memoryFallback.clear();

    if (isLocalStorageAvailable()) {
      window.localStorage.clear();
    }
    return true;
  } catch (error) {
    console.warn('[storage] Failed to clear storage:', error);
    return false;
  }
}

export const safeStorage = {
  getItem: getStorageItem,
  setItem: setStorageItem,
  removeItem: removeStorageItem,
  clear: clearStorage,
};
