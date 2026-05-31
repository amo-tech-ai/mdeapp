/** Bridges send() → thinking indicator before CopilotKit sets inProgress (React 19 batching). */

let _pendingVersion = 0;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((l) => l());
}

export function setConciergePendingSend(pending: boolean) {
  const next = pending ? _pendingVersion + 1 : 0;
  if (next === _pendingVersion) return;
  _pendingVersion = next;
  notify();
}

export function clearConciergePendingSend() {
  setConciergePendingSend(false);
}

export function subscribeConciergePendingSend(listener: () => void) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getConciergePendingSendVersion() {
  return _pendingVersion;
}

export function getConciergePendingSendVersionServer() {
  return 0;
}

export function isConciergePendingSend() {
  return _pendingVersion > 0;
}
