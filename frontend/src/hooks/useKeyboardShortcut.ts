import { useEffect } from 'react';

export function useKeyboardShortcut(keys: string[], callback: () => void, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, enabled]);
}
