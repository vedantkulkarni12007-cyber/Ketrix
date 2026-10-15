const STORAGE_KEY = 'ketrix_completed_challenges';

// In-memory fallback if localStorage is disabled, private browsing, or throws
let memoryFallbackStore = {};

/**
 * Checks if localStorage is accessible in the current browser environment.
 */
export const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__ketrix_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Retrieves all completed challenges map from storage.
 * @returns {Record<string, { completed: boolean, completedAt: string, attempts: number }>}
 */
export const getCompletedChallenges = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Ketrix Storage: Unable to read from localStorage, using memory fallback.', err);
  }
  return memoryFallbackStore;
};

/**
 * Checks if a specific challenge ID is completed.
 * @param {string} challengeId
 * @returns {boolean}
 */
export const isChallengeCompleted = (challengeId) => {
  const store = getCompletedChallenges();
  return Boolean(store[challengeId]?.completed);
};

/**
 * Marks a challenge as successfully completed.
 * @param {string} challengeId
 * @param {object} [metadata]
 * @returns {Record<string, object>} Updated completed map
 */
export const markChallengeCompleted = (challengeId, metadata = {}) => {
  const current = getCompletedChallenges();
  const existing = current[challengeId] || {};
  const completedAt = existing.completedAt || new Date().toISOString();
  const attempts = (existing.attempts || 0) + 1;

  const updated = {
    ...current,
    [challengeId]: {
      ...existing,
      completed: true,
      completedAt,
      lastAttemptAt: new Date().toISOString(),
      attempts,
      ...metadata
    }
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Ketrix Storage: Unable to persist to localStorage, using memory fallback.', err);
  }
  memoryFallbackStore = updated;
  return updated;
};

/**
 * Resets a challenge completion status (for retrying).
 * @param {string} challengeId
 * @returns {Record<string, object>} Updated completed map
 */
export const resetChallengeCompletion = (challengeId) => {
  const current = getCompletedChallenges();
  const updated = { ...current };
  delete updated[challengeId];

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Ketrix Storage: Unable to update localStorage on reset.', err);
  }
  memoryFallbackStore = updated;
  return updated;
};

/**
 * Clears all challenge completions (utility for debugging/reset).
 */
export const clearAllChallengeProgress = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Ketrix Storage: Unable to clear localStorage.', err);
  }
  memoryFallbackStore = {};
};
