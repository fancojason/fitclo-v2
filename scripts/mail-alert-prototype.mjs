// Isolated prototype only. Never imported by a production Function or page.
export function createMockFailureAlert({ enabled = false, sink, now = Date.now } = {}) {
  const recent = new Map();
  return async (input) => {
    if (!enabled) return { state: 'disabled' };
    const stage = ['email', 'crm'].includes(input.stage) ? input.stage : 'unknown';
    const category = ['configuration','authorization','rate_limit','provider_http','missing_provider_id','timeout','provider_response','internal_or_transport','http_failure','transport_failure'].includes(input.category) ? input.category : 'unknown';
    const status = Number.isInteger(input.provider_status) && input.provider_status >= 100 && input.provider_status <= 599 ? input.provider_status : 0;
    const key = `${stage}:${category}:${status}`, time = now();
    if (recent.has(key) && time - recent.get(key) < 300000) return { state: 'suppressed' };
    const event = { event: 'inquiry_failure', stage, category, provider_status: status, timestamp: time };
    try {
      if (typeof sink !== 'function') return { state: 'unconfigured' };
      await sink(event);
      if (recent.size >= 128) recent.delete(recent.keys().next().value);
      recent.set(key, time);
      return { state: 'mock_recorded' };
    } catch { return { state: 'sink_failed' }; }
  };
}
