export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const id = 'a11y-announcer';
  let announcer = document.getElementById(id);
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = id;
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
  }
  
  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
}

export function trapFocus(element: HTMLElement) {
  const focusableEls = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, details, [tabindex]:not([tabindex="-1"])');
  const firstFocusableEl = focusableEls[0] as HTMLElement;
  const lastFocusableEl = focusableEls[focusableEls.length - 1] as HTMLElement;

  return function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  };
}

export function handleKeyboardNavigation(
  e: KeyboardEvent,
  handlers: Record<string, () => void>
) {
  const handler = handlers[e.key];

  if (handler) {
    handler();
    e.preventDefault();
  }
}

export function getAriaSort(direction: 'asc' | 'desc' | 'none'): 'ascending' | 'descending' | 'none' {
  if (direction === 'asc') return 'ascending';
  if (direction === 'desc') return 'descending';
  return 'none';
}
