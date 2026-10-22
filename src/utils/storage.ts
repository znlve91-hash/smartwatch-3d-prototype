/**
 * Safe localStorage wrapper with fallback handling for SSR and corrupt storage.
 */

const memoryStore = new Map<string, string>();

/**
 * Retrieve and parse JSON item from storage.
 * If key does not exist, or if data is corrupt/unreadable, returns fallback.
 */
export function getItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      const memVal = memoryStore.get(key);
      if (memVal === undefined) return fallback;
      return JSON.parse(memVal) as T;
    }

    const item = window.localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[storage] Error reading key "${key}", returning fallback:`, error);
    return fallback;
  }
}

/**
 * Serialize and save value to storage.
 * Returns true if write succeeded, false if quota/security or serialization error occurs.
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
      return true;
    }

    memoryStore.set(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[storage] Error writing key "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from storage by key.
 */
export function removeItem(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      memoryStore.delete(key);
      return true;
    }

    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[storage] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all storage items or in-memory backup.
 */
export function clearStorage(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      memoryStore.clear();
      return true;
    }

    window.localStorage.clear();
    return true;
  } catch (error) {
    console.warn('[storage] Error clearing storage:', error);
    return false;
  }
}

export const storage = {
  getItem,
  setItem,
  removeItem,
  clear: clearStorage,
};
