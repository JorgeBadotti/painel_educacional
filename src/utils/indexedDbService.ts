import { EducationResourceProgram } from '../types/radar';
import { INITIAL_RADAR_PROGRAMS } from '../data/radarRecursosData';

const DB_NAME = 'CockpitRadarDB';
const DB_VERSION = 1;
const STORE_NAME = 'programs';

export class RadarIndexedDbService {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  private static getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('eligibilityStatus', 'eligibilityStatus', { unique: false });
          store.createIndex('priority', 'priority', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  // Intentionally does NOT swallow IndexedDB-unavailable errors: callers rely on
  // this rejecting to know the sync status is degraded (see RadarRecursosView's
  // isIndexedDbSynced badge). Callers that just want data with a safe fallback
  // should catch and fall back to INITIAL_RADAR_PROGRAMS themselves.
  static async getAllPrograms(): Promise<EducationResourceProgram[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const res = request.result as EducationResourceProgram[];
        if (!res || res.length === 0) {
          // Seed initial data if empty
          this.saveAllPrograms(INITIAL_RADAR_PROGRAMS).then(() => resolve(INITIAL_RADAR_PROGRAMS)).catch(reject);
        } else {
          resolve(res);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  static async saveAllPrograms(programs: EducationResourceProgram[]): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        programs.forEach((prog) => store.put({ ...prog, lastUpdated: new Date().toISOString() }));

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save to IndexedDB', e);
    }
  }

  static async updateProgram(updated: EducationResourceProgram): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ ...updated, lastUpdated: new Date().toISOString() });

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to update item in IndexedDB', e);
    }
  }
}
