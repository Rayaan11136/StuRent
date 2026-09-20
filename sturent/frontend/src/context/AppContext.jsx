import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultPreferences, properties } from "../data/demoData.js";

const STORAGE_PREFS = "sturent.preferences";
const STORAGE_SAVED = "sturent.saved";
const STORAGE_COMPARE = "sturent.compare";
const STORAGE_NEARBY = "sturent.nearbyProperty";

const AppContext = createContext(null);

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [preferences, setPreferences] = useState(() =>
    loadJson(STORAGE_PREFS, defaultPreferences)
  );
  const [savedIds, setSavedIds] = useState(() => loadJson(STORAGE_SAVED, []));
  const [compareIds, setCompareIds] = useState(() => loadJson(STORAGE_COMPARE, []));
  const [nearbyPropertyId, setNearbyPropertyId] = useState(
    () => localStorage.getItem(STORAGE_NEARBY) || properties[0].id
  );
  const [lastMatchResult, setLastMatchResult] = useState(null);
  const [pendingPrefs, setPendingPrefs] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFS, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_COMPARE, JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    if (nearbyPropertyId) localStorage.setItem(STORAGE_NEARBY, nearbyPropertyId);
  }, [nearbyPropertyId]);

  const value = useMemo(() => {
    const toggleSaved = (id) => {
      setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleCompare = (id) => {
      setCompareIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 3) return prev;
        return [...prev, id];
      });
    };

    return {
      preferences,
      setPreferences,
      savedIds,
      toggleSaved,
      isSaved: (id) => savedIds.includes(id),
      compareIds,
      toggleCompare,
      isCompared: (id) => compareIds.includes(id),
      nearbyPropertyId,
      setNearbyPropertyId,
      lastMatchResult,
      setLastMatchResult,
      pendingPrefs,
      setPendingPrefs,
      mobileNavOpen,
      setMobileNavOpen
    };
  }, [
    preferences,
    savedIds,
    compareIds,
    nearbyPropertyId,
    lastMatchResult,
    pendingPrefs,
    mobileNavOpen
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
