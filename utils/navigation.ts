
export const navigateTo = (path: string) => {
  if (typeof path !== 'string') {
    console.error('Navigation error: path must be a string', path);
    return;
  }

  try {
    // 1. Update Browser History
    window.history.pushState({}, '', path);
  } catch (error) {
    console.warn("Navigation: History API restricted, falling back to internal routing.", error);
  }

  // 2. Dispatch Event for React to React
  // Note: We don't need a detail payload because the listener checks window.location.pathname directly
  // But passing it is good practice for debugging.
  const navEvent = new CustomEvent('app-navigate', { detail: { path } });
  window.dispatchEvent(navEvent);
};
