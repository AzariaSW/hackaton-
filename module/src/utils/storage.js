export class StorageManager {
  constructor(prefix = 'db-signup') {
    this.prefix = prefix;
    this.dbName = `${prefix}-draft-store`;
    this.dbVersion = 2;
    this.db = null;
    this.memoryFallback = new Map();
  }

  async init() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          resolve(null);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('drafts')) {
            const store = db.createObjectStore('drafts', { keyPath: 'id' });
            store.createIndex('flow', 'flow', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
          if (!db.objectStoreNames.contains('pending')) {
            db.createObjectStore('pending', { keyPath: 'submissionId' });
          }
          if (!db.objectStoreNames.contains('support')) {
            db.createObjectStore('support', { keyPath: 'id' });
          }
        };
      } catch {
        resolve(null);
      }
    });
  }

  async save(flow, currentStep, answers) {
    if (!this.db) await this.init();

    const record = {
      id: `draft_${flow}`,
      flow,
      currentStep,
      answers,
      updatedAt: new Date().toISOString()
    };

    if (!this.db) {
      this.memoryFallback.set(record.id, record);
      return record;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['drafts'], 'readwrite');
      const store = tx.objectStore('drafts');
      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async load(flow) {
    if (!this.db) await this.init();

    if (!this.db) {
      return this.memoryFallback.get(`draft_${flow}`) || null;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['drafts'], 'readonly');
      const store = tx.objectStore('drafts');
      const direct = store.get(`draft_${flow}`);
      direct.onsuccess = () => {
        if (direct.result) {
          resolve(direct.result);
          return;
        }
        const index = store.index('flow');
        const allReq = index.getAll(flow);
        allReq.onsuccess = () => {
          const results = allReq.result || [];
          if (results.length === 0) {
            resolve(null);
            return;
          }
          results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          resolve(results[0]);
        };
        allReq.onerror = () => resolve(null);
      };
      direct.onerror = () => resolve(null);
    });
  }

  async clear(flow) {
    if (!this.db) await this.init();
    this.memoryFallback.delete(`draft_${flow}`);

    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction(['drafts'], 'readwrite');
      const store = tx.objectStore('drafts');
      const index = store.index('flow');
      const request = index.openCursor(flow);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => resolve();
    });
  }

  async saveSupportPreferences(preferences) {
    if (!this.db) await this.init();
    const record = {
      id: 'current',
      support: Array.isArray(preferences) ? preferences : [],
      updatedAt: new Date().toISOString()
    };

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('db-signup:support-local', JSON.stringify(record.support));
      }
    } catch {
      // Ignore storage quota errors
    }

    if (!this.db) {
      this.memoryFallback.set('support_current', record);
      return record;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['support'], 'readwrite');
      const store = tx.objectStore('support');
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => resolve(record);
    });
  }

  async queuePendingSubmission(payload) {
    if (!this.db) await this.init();

    if (!this.db) {
      this.memoryFallback.set(`pending_${payload.submissionId}`, payload);
      return payload;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readwrite');
      const store = tx.objectStore('pending');
      const req = store.put(payload);
      req.onsuccess = () => resolve(payload);
      req.onerror = () => resolve(payload);
    });
  }

  async getPendingSubmissions() {
    if (!this.db) await this.init();

    if (!this.db) {
      return [...this.memoryFallback.entries()]
        .filter(([k]) => k.startsWith('pending_'))
        .map(([, v]) => v);
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readonly');
      const store = tx.objectStore('pending');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async removePendingSubmission(submissionId) {
    if (!this.db) await this.init();
    this.memoryFallback.delete(`pending_${submissionId}`);

    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readwrite');
      const store = tx.objectStore('pending');
      const req = store.delete(submissionId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  }

  saveUiPrefs(prefs) {
    const clean = {
      lowLiteracy: Boolean(prefs?.lowLiteracy),
      bigTextContrast: Boolean(prefs?.bigTextContrast),
      noSoundVisual: Boolean(prefs?.noSoundVisual),
      voiceRate: Number(prefs?.voiceRate) || 0.95
    };
    this.memoryFallback.set('ui_prefs', clean);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${this.prefix}:ui-prefs`, JSON.stringify(clean));
      }
    } catch {
      // Ignore storage quota errors
    }
    return clean;
  }

  loadUiPrefs() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(`${this.prefix}:ui-prefs`);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // Ignore parse/storage errors
    }
    return this.memoryFallback.get('ui_prefs') || null;
  }
}

export const storage = new StorageManager();
