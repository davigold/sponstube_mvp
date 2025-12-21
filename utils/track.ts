
export const track = (eventName: string, payload?: Record<string, any>) => {
  // Simple console logger for PR-10
  // In production, this would dispatch to Segment/Mixpanel/GA
  console.log(`[Analytics] 📊 ${eventName}`, payload || {});
  
  // Example of saving to local event log for debugging
  try {
    const history = JSON.parse(localStorage.getItem('cm_analytics_log') || '[]');
    
    // Robust circular reference remover
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
          // specific check for DOM elements or Window which cause issues
          if (value instanceof Event || (value.constructor && value.constructor.name === 'SyntheticBaseEvent')) {
             return '[Event]';
          }
          if (value instanceof Node) return '[Node]';
          if (value === value.window) return '[Window]';
          
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      };
    };

    // Deep clone/sanitize payload to be safe for storage
    const safePayload = payload ? JSON.parse(JSON.stringify(payload, getCircularReplacer())) : undefined;

    history.push({ event: eventName, payload: safePayload, timestamp: new Date().toISOString() });
    localStorage.setItem('cm_analytics_log', JSON.stringify(history.slice(-50)));
  } catch (e) {
    // Ignore storage errors or circular structure errors
    console.warn("[Analytics] Failed to save log", e);
  }
};
