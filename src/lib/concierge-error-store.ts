/** Module-level store for concierge RUN_ERROR signals.
 *
 * CopilotKit's ToastProvider suppresses bannerError in production (enabled=false when
 * not localhost). Wiring onError at <CopilotKit> level is the only reliable cross-env
 * way to detect stream failures. This tiny store bridges that callback to UI subscribers
 * via useSyncExternalStore, avoiding setState-in-effect and ref-read-in-render rules.
 */

let _errorVersion = 0;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((l) => l());
}

export function reportConciergeError() {
  _errorVersion++;
  notify();
}

export function clearConciergeError() {
  if (_errorVersion !== 0) {
    _errorVersion = 0;
    notify();
  }
}

export function subscribeConciergeError(listener: () => void) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getConciergeErrorVersion() {
  return _errorVersion;
}

export function getConciergeErrorVersionServer() {
  return 0;
}
