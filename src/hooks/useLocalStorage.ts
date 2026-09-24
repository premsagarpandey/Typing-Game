import { useState, useCallback } from 'react';
import { secureStorage } from '../utils/secureStorage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return secureStorage.getItem<T>(key, initialValue);
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          secureStorage.setItem(key, valueToStore);
          window.dispatchEvent(
            new CustomEvent('typlix_settings_changed', {
              detail: { key, value: valueToStore },
            })
          );
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

