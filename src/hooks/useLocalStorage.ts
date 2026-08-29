import { useState, useEffect } from 'react';
import { secureStorage } from '../utils/secureStorage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return secureStorage.getItem<T>(key, initialValue);
  });

  useEffect(() => {
    secureStorage.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

