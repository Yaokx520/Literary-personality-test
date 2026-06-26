/* 文学/诗心小测 · 访问与匹配结果上报（需配置 LIT_STATS_CONFIG.apiBase） */
(function (global) {
  const SESSION_KEY = 'lit_stats_sid';

  function getConfig() {
    const c = global.LIT_STATS_CONFIG || {};
    const apiBase = String(c.apiBase || c.api || '').replace(/\/$/, '');
    return {
      apiBase,
      enabled: c.enabled !== false && !!apiBase,
      test: c.test || null
    };
  }

  function getSessionId() {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (_) {
      return 's_anon_' + Date.now().toString(36);
    }
  }

  function post(path, payload) {
    const cfg = getConfig();
    if (!cfg.enabled) return Promise.resolve(null);
    const url = cfg.apiBase + path;
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      try {
        const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
        if (ok) return Promise.resolve({ ok: true, beacon: true });
      } catch (_) { /* fallback fetch */ }
    }

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors'
    }).then(r => r.json().catch(() => ({}))).catch(() => null);
  }

  function trackVisit(testType) {
    const cfg = getConfig();
    const test = testType || cfg.test;
    if (!cfg.enabled || !test) return;
    post('/api/track/visit', { test, sessionId: getSessionId() });
  }

  function trackResult(testType, match) {
    const cfg = getConfig();
    const test = testType || cfg.test;
    if (!cfg.enabled || !test || !match) return;
    const matchId = match.id || match.matchId || '';
    const matchName = match.name || match.matchName || '';
    if (!matchId || !matchName) return;
    post('/api/track/result', {
      test,
      sessionId: getSessionId(),
      matchId,
      matchName
    });
  }

  function init(testType) {
    trackVisit(testType);
  }

  global.LitStats = {
    init,
    trackVisit,
    trackResult,
    getSessionId,
    getConfig
  };
})(window);
