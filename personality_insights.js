/* 人格匹配洞察：蒙特卡洛概率热门/冷门排行 */
(function (global) {
  const cache = new Map();

  const MIN_PCT = 0.016;

  function formatProb(count, n) {
    const pct = (count / n) * 100;
    if (pct === 0 || pct < MIN_PCT) return String(MIN_PCT);
    if (pct < 1) return String(parseFloat(pct.toPrecision(2)));
    return String(Math.round(pct * 10) / 10);
  }

  function monteCarloRankings(writers, scoreFn, samples, cacheTag) {
    const n = samples || 8000;
    const cacheKey = (cacheTag || '') + writers.length + ':' + n;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const counts = Object.create(null);
    writers.forEach(w => { counts[w.id] = 0; });

    for (let i = 0; i < n; i++) {
      const scores = Array.from({ length: 6 }, () => Math.random() * 11);
      let best = writers[0];
      let bestScore = -Infinity;
      for (const w of writers) {
        const s = scoreFn(scores, w.traits, w.id);
        if (s > bestScore) { bestScore = s; best = w; }
      }
      counts[best.id]++;
    }

    const all = writers.map(w => ({
      id: w.id,
      name: w.name,
      prob: formatProb(counts[w.id], n),
      count: counts[w.id]
    })).sort((a, b) => b.count - a.count);

    const result = {
      hot: all.slice(0, 3),
      cold: all.length > 3 ? all.slice(-3).reverse() : [...all].reverse()
    };
    cache.set(cacheKey, result);
    return result;
  }

  function renderProbLists(hotEl, coldEl, data) {
    const row = (x) => `<li>${x.name} <span class="prob-val">约 ${x.prob}%</span></li>`;
    if (hotEl) {
      hotEl.innerHTML = data.hot.length ? data.hot.map(row).join('') : '<li class="muted">—</li>';
    }
    if (coldEl) {
      coldEl.innerHTML = data.cold.length ? data.cold.map(row).join('') : '<li class="muted">—</li>';
    }
  }

  global.PersonalityInsights = { monteCarloRankings, renderProbLists };
})(window);
