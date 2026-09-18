/**
 * HaqDaar User Storage Service
 * Manages user-isolated persistent storage for:
 * - Search history
 * - Bookmarked / Saved hospitals
 * - Document checklist progress
 * - Auditable execution records
 */

const SEARCHES_KEY = 'haqdaar_searches_v1';
const SAVED_HOSPITALS_KEY = 'haqdaar_saved_hospitals_v1';
const CHECKLIST_KEY = 'haqdaar_checklist_v1';

export const storageService = {
  // Searches
  getSearches(userId = 'guest') {
    try {
      const raw = localStorage.getItem(`${SEARCHES_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveSearch(userId = 'guest', searchRecord) {
    const list = this.getSearches(userId);
    const newEntry = {
      id: 'search_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ...searchRecord
    };
    // Keep last 30 searches
    const updated = [newEntry, ...list.filter(s => s.query !== searchRecord.query)].slice(0, 30);
    localStorage.setItem(`${SEARCHES_KEY}_${userId}`, JSON.stringify(updated));
    return newEntry;
  },

  clearSearches(userId = 'guest') {
    localStorage.removeItem(`${SEARCHES_KEY}_${userId}`);
  },

  // Saved Hospitals (Bookmarks)
  getSavedHospitals(userId = 'guest') {
    try {
      const raw = localStorage.getItem(`${SAVED_HOSPITALS_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleSaveHospital(userId = 'guest', hospital) {
    const list = this.getSavedHospitals(userId);
    const exists = list.some(h => h.id === hospital.id);
    let updated;
    if (exists) {
      updated = list.filter(h => h.id !== hospital.id);
    } else {
      updated = [{ ...hospital, savedAt: new Date().toISOString() }, ...list];
    }
    localStorage.setItem(`${SAVED_HOSPITALS_KEY}_${userId}`, JSON.stringify(updated));
    return !exists;
  },

  isHospitalSaved(userId = 'guest', hospitalId) {
    const list = this.getSavedHospitals(userId);
    return list.some(h => h.id === hospitalId);
  },

  // Checklist Items State
  getChecklistState(userId = 'guest', condition = 'default') {
    try {
      const raw = localStorage.getItem(`${CHECKLIST_KEY}_${userId}_${condition}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveChecklistState(userId = 'guest', condition = 'default', checkedMap) {
    localStorage.setItem(`${CHECKLIST_KEY}_${userId}_${condition}`, JSON.stringify(checkedMap));
  }
};
