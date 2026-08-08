// Small shared wrapper around the try/catch-JSON.parse/JSON.stringify pattern
// repeated at every persisted localStorage key in CockpitContext.

export function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (e) {
    console.error(`Failed to load "${key}" from localStorage`, e);
  }
  return fallback;
}

export function saveToLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save "${key}" to localStorage`, e);
  }
}
