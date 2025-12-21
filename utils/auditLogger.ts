
export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
  details?: string;
}

const KEY = 'cm_audit_log';

export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const logAction = (action: string, targetId: string, targetType: string, details?: string): AuditLogEntry[] => {
  const logs = getAuditLogs();
  const newEntry: AuditLogEntry = {
    id: `log_${Date.now()}`,
    actor: 'Staff Admin', // In real app, get from auth context
    action,
    targetId,
    targetType,
    timestamp: new Date().toISOString(),
    details
  };
  const updated = [newEntry, ...logs];
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("AuditLog Error", e);
  }
  return updated;
};
