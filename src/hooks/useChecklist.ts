import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "auto_mfg_checklist_v1";
const LEGACY_STORAGE_KEY = "chk";

export function useChecklist() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localStorage errors as per spec
    }
    return {};
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedMap));
    } catch {
      // Ignore write errors as per spec
    }
  }, [checkedMap]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  }, []);

  const setCheckState = useCallback((id: string, value: boolean) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [id]: value };
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore error
    }
    setCheckedMap({});
  }, []);

  const isChecked = useCallback(
    (id: string) => {
      return Boolean(checkedMap[id]);
    },
    [checkedMap]
  );

  return {
    checkedMap,
    isChecked,
    toggleCheck,
    setCheckState,
    resetAll,
  };
}
