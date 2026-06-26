/* 人格匹配洞察：蒙特卡洛概率排行 + 本次 TOP3 柱状图 */
(function (global) {
  const cache = new Map();

  function monteCarloRankings(writers, scoreFn, samples) {
    const n = samples || 1200;
    const cacheKey = writers.length + ':' + n;
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
      prob: Math.round((counts[w.id] / n) * 1000) / 10
    })).sort((a, b) => b.prob - a.prob);

    const result = {
      hot: all.slice(0, 3),
      cold: all.length > 3 ? all.slice(-3).reverse() : [...all].reverse()
    };
    cache.set(cacheKey, result);
    return result;
  }

  function renderBarTop3(container, ranked, pctFn) {
    if (!container) return;
    const top3 = ranked.slice(0, 3);
    if (!top3.length) { container.innerHTML = ''; return; }
    const maxPct = Math.max(...top3.map(r => pctFn(r.sim)), 1);
    container.innerHTML = top3.map((r, i) => {
      const p = pctFn(r.sim);
      const w = Math.round((p / maxPct) * 100);
      return `<div class="match-bar-row">
        <span class="match-bar-rank ${i === 0 ? 'gold' : ''}">${i + 1}</span>
        <span class="match-bar-name">${r.w.name}</span>
        <div class="match-bar-track"><i style="width:${w}%"></i></div>
        <span class="match-bar-pct">${p}%</span>
      </div>`;
    }).join('');
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

  global.PersonalityInsights = { monteCarloRankings, renderBarTop3, renderProbLists };
})(window);
