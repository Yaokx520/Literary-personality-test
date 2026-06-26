/* 文学气质测试：分支抽题 + 花信进度条 */
(function () {
  const DIMS = ['现实批判', '抒情浪漫', '哲思抽象', '都市孤独', '人文悲悯', '先锋实验'];
  const MIN_Q = 10, MAX_Q = 16, BRANCH_ADD = 3;
  const SHARE_URL = 'https://yaokx520.github.io/Literary-personality-test/';
  const Q1_TRACK = ['13', '46', '79', '10'];
  const MILESTONE_TRACKS = { '13': [3], '46': [4, 6], '79': [7, 9], '10': [10] };
  const BRANCH_FLOWERS = ['taohua', 'lihua', 'meihua', 'juhua', 'mudan'];
  const EXTEND_OPTS = new Set([1, 3]);
  const FLOWER_LABELS = {
    taohua: '灼灼桃华', lihua: '梨花胜雪', meihua: '梅寒傲骨',
    juhua: '东篱秋菊', mudan: '牡丹国色'
  };

  const FLOWER_AUDIO = {
    taohua: 'assets/music/妖扬「桃花树下桃花仙」桃花.mp3',
    lihua: 'assets/music/等什么君《春庭雪》梨花.mp3',
    meihua: 'assets/music/蒋雪儿《落了白》梅花.mp3',
    juhua: 'assets/music/李鑫一《一花一剑》菊花.mp3',
    mudan: 'assets/music/指尖笑《人间惊鸿宴》牡丹.mp3'
  };

  const music = { audio: null, muted: false, flower: null };

  function stopMusic() {
    if (music.audio) {
      music.audio.pause();
      music.audio.currentTime = 0;
      music.audio = null;
    }
    music.flower = null;
  }

  function playFlowerMusic(flowerKey) {
    if (music.flower === flowerKey && music.audio) {
      if (!music.muted) music.audio.play().catch(() => {});
      return;
    }
    if (music.audio) {
      music.audio.pause();
      music.audio = null;
    }
    music.flower = flowerKey;
    if (music.muted) return;
    const src = FLOWER_AUDIO[flowerKey];
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.55;
    music.audio = audio;
    audio.play().catch(() => {});
  }

  function updateMuteBtn() {
    const icon = document.getElementById('muteIcon');
    const label = document.getElementById('muteLabel');
    const btn = document.getElementById('muteBtn');
    if (!btn) return;
    if (music.muted) {
      icon.textContent = '🔇';
      label.textContent = '取消静音';
      btn.setAttribute('aria-label', '取消静音');
    } else {
      icon.textContent = '🔊';
      label.textContent = '静音';
      btn.setAttribute('aria-label', '静音');
    }
  }

  function showMuteBtn(show) {
    document.getElementById('muteBtn')?.classList.toggle('show', show);
  }

  function toggleMute() {
    music.muted = !music.muted;
    if (music.muted) music.audio?.pause();
    else if (music.audio) music.audio.play().catch(() => {});
    else if (music.flower) playFlowerMusic(music.flower);
    updateMuteBtn();
  }

  const state = {
    path: [], answers: {}, currentId: LIT_START, targetCount: MIN_Q,
    track: null, activeMilestones: [], milestones: {}, scores: [0, 0, 0, 0, 0, 0]
  };

  function totalFlowerSlots() { return 1 + state.activeMilestones.length; }
  function flowerSlotPosition(branchIndex) {
    const total = totalFlowerSlots();
    if (total <= 2) return [100 / 3, 200 / 3][Math.min(branchIndex, 1)];
    return (100 / 4) * (branchIndex + 1);
  }
  function branchOptionMeta(optIndex, branchIndex) {
    return {
      flower: BRANCH_FLOWERS[(optIndex + branchIndex) % BRANCH_FLOWERS.length],
      add: EXTEND_OPTS.has(optIndex) ? BRANCH_ADD : 0
    };
  }

  function flowerSvg(key) {
    const svgs = {
      taohua: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(24,24)">${[0, 72, 144, 216, 288].map(a => `<path transform="rotate(${a})" d="M0,-2 C2,-12 6,-15 11,-12 C16,-9 15,-2 11,2 C7,6 1,4 0,-2 Z" fill="#ffc9d6" stroke="#f48fb1" stroke-width=".7"/>`).join('')}</g><circle cx="24" cy="24" r="4.5" fill="#fff176" stroke="#f9a825" stroke-width=".6"/></svg>`,
      lihua: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; const x = 24 + 13 * Math.sin(r), y = 24 - 13 * Math.cos(r); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="10" fill="#ffffff" stroke="#e0dcd4" stroke-width=".8"/>`; }).join('')}<circle cx="24" cy="24" r="5" fill="#fff9c4" stroke="#f0e68c" stroke-width=".6"/></svg>`,
      meihua: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; const x = 24 + 11 * Math.sin(r), y = 24 - 11 * Math.cos(r); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2" fill="#f8d7da" stroke="#e8b4b8" stroke-width=".7"/>`; }).join('')}<circle cx="24" cy="24" r="3.5" fill="#ffcdd2" stroke="#ef9a9a" stroke-width=".5"/></svg>`,
      juhua: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="3.8" fill="#ffb300" stroke="#d4a000" stroke-width=".5"/>${Array.from({ length: 22 }, (_, i) => `<ellipse cx="24" cy="24" rx="1.5" ry="13.5" transform="rotate(${i * (360 / 22)} 24 24)" fill="#ffc107" stroke="#e6a800" stroke-width=".35" opacity=".96"/>`).join('')}${Array.from({ length: 22 }, (_, i) => `<ellipse cx="24" cy="24" rx="1.3" ry="11.5" transform="rotate(${i * (360 / 22) + 360 / 44} 24 24)" fill="#ffd54f" stroke="#ffb300" stroke-width=".3" opacity=".9"/>`).join('')}</svg>`,
      mudan: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${[[18, '#7b1fa2'], [14, '#ad1457'], [10, '#c2185b']].map(([r, c], layer) => [0, 60, 120, 180, 240, 300].map(a => { const rad = a * Math.PI / 180; const x = 24 + r * 0.55 * Math.sin(rad), y = 24 - r * 0.55 * Math.cos(rad); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r / 2.2}" ry="${r / 2.5}" fill="${c}" opacity="${0.55 + layer * 0.15}" stroke="#6a1b9a" stroke-width=".4"/>`; }).join('')).join('')}<circle cx="24" cy="24" r="5" fill="#880e4f" stroke="#4a148c" stroke-width=".5"/></svg>`
    };
    return svgs[key] || svgs.meihua;
  }

  function resultFlowerKey() {
    const keys = Object.keys(state.milestones).sort((a, b) => Number(a) - Number(b));
    if (!keys.length) return 'meihua';
    const counts = {};
    let lastFlower = state.milestones[keys[keys.length - 1]].flower;
    keys.forEach(k => { const f = state.milestones[k].flower; counts[f] = (counts[f] || 0) + 1; });
    const max = Math.max(...Object.values(counts));
    const top = Object.entries(counts).filter(([, c]) => c === max).map(([f]) => f);
    return top.length === 1 ? top[0] : lastFlower;
  }

  function isTerminalId(id) { return id && LIT_Q[id]?.end === true; }
  function currentQuestion() { return LIT_Q[state.currentId]; }
  function pathLength() { return state.path.length; }

  function clearFlowers() {
    document.getElementById('bambooTrack')?.querySelectorAll('.bamboo-flower').forEach(el => el.remove());
  }
  function recalcTargetCount() {
    let total = MIN_Q;
    Object.values(state.milestones).forEach(m => { if (m) total += m.add; });
    state.targetCount = Math.min(MAX_Q, total);
  }
  function renderMilestoneFlower(milestone, flowerKey, branchIndex) {
    const track = document.getElementById('bambooTrack');
    track.querySelector(`[data-milestone="${milestone}"]`)?.remove();
    const pct = flowerSlotPosition(branchIndex);
    const div = document.createElement('div');
    div.className = 'bamboo-flower';
    div.dataset.milestone = String(milestone);
    div.dataset.flower = flowerKey;
    div.style.left = pct + '%';
    div.innerHTML = `<span class="flower-label">${FLOWER_LABELS[flowerKey] || ''}</span><div class="flower-icon">${flowerSvg(flowerKey)}</div>`;
    track.appendChild(div);
    requestAnimationFrame(() => div.classList.add('bloom'));
  }
  function applyMilestone(milestone, optIndex, branchIndex) {
    const meta = branchOptionMeta(optIndex, branchIndex);
    state.milestones[milestone] = { optIndex, add: meta.add, flower: meta.flower, branchIndex };
    recalcTargetCount();
    renderMilestoneFlower(milestone, meta.flower, branchIndex);
  }
  function clearMilestonesAfter(pathLen) {
    [1, ...state.activeMilestones].forEach(m => {
      if (pathLen < m && state.milestones[m]) {
        delete state.milestones[m];
        document.querySelector(`[data-milestone="${m}"]`)?.remove();
      }
    });
    if (pathLen === 0) { state.track = null; state.activeMilestones = []; }
    recalcTargetCount();
  }

  function terminalIds() { return ['q34', 'q35', 'q36']; }
  function pickTerminal() { return terminalIds().find(id => !state.path.includes(id)) || 'q34'; }
  function pickContinueHub() {
    const prefer = ['q22', 'q23', 'q24', 'q25', 'q18', 'q19', 'q20', 'q26', 'q27', 'q28', 'q29',
      'q14', 'q15', 'q16', 'q17', 'q21', 'q10', 'q11', 'q12', 'q13', 'q06', 'q07', 'q08', 'q09'];
    const id = prefer.find(h => LIT_Q[h] && !isTerminalId(h) && !state.path.includes(h));
    return id || Object.keys(LIT_Q).find(h => !isTerminalId(h) && !state.path.includes(h));
  }
  function shouldBlockTerminal(pl) { return pl < MIN_Q - 1 || pl < state.targetCount - 1; }

  function resolveNext(opt, q) {
    const pl = pathLength();
    if (pl >= state.targetCount - 1) return pickTerminal();
    function pickFirstValid(ids) {
      const seen = new Set();
      for (const id of ids) {
        if (!id || seen.has(id) || !LIT_Q[id]) continue;
        seen.add(id);
        if (isTerminalId(id)) { if (!shouldBlockTerminal(pl)) return id; continue; }
        if (!state.path.includes(id)) return id;
      }
      return null;
    }
    const id = pickFirstValid([opt.next, ...q.opts.map(o => o.next).filter(Boolean)]);
    if (id) return id;
    return pickContinueHub() || pickTerminal();
  }

  const els = {
    body: document.body, progressFill: document.getElementById('progressFill'),
    qCount: document.getElementById('qCount'), typePill: document.getElementById('typePill'),
    questionText: document.getElementById('questionText'), optionsBox: document.getElementById('optionsBox'),
    prevBtn: document.getElementById('prevBtn'), nextBtn: document.getElementById('nextBtn'),
    resetBtn: document.getElementById('resetBtn'), hintText: document.getElementById('hintText'),
    libraryBox: document.getElementById('libraryBox'), resultBox: document.getElementById('resultBox'),
    resultTitle: document.getElementById('resultTitle'), resultAvatar: document.getElementById('resultAvatar'),
    resultIntro: document.getElementById('resultIntro'),
    resultOneLiner: document.getElementById('resultOneLiner'), resultWhy: document.getElementById('resultWhy'),
    resultQuote: document.getElementById('resultQuote'), resultQuoteAuthor: document.getElementById('resultQuoteAuthor'),
    personalityTags: document.getElementById('personalityTags'), top5List: document.getElementById('top5List'),
    top5Quotes: document.getElementById('top5Quotes'),
    shareText: document.getElementById('shareText'), radarChart: document.getElementById('radarChart')
  };

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._tid);
    showToast._tid = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function norm(v) {
    const s = Math.sqrt(v.reduce((a, b) => a + b * b, 0)) || 1;
    return v.map(x => x / s);
  }
  function similarity(user, traits) {
    const u = norm(user), t = norm(traits);
    return u.reduce((s, x, i) => s + x * t[i], 0);
  }

  function renderLibrary() {
    const groups = {};
    WRITERS.forEach(w => { (groups[w.region] ||= []).push(w); });
    els.libraryBox.innerHTML = Object.entries(groups).map(([region, list]) => `
      <div class="region-block">
        <div class="region-title">${region}（${list.length}）</div>
        ${list.map(w => `
          <article class="writer">
            <div class="writer-top"><h3>${w.name}</h3><span class="kind">${w.kind}</span></div>
            <p>${w.intro}</p>
            <div class="quote">${w.quote}</div>
          </article>`).join('')}
      </div>`).join('');
  }

  function setView(v) {
    els.body.className = 'view-' + v;
    if (v === 'browse') { els.body.className = 'view-welcome'; document.querySelector('.library-aside').scrollIntoView({ behavior: 'smooth' }); }
  }

  function questionProgressPct() {
    return ((pathLength()) / state.targetCount) * 100;
  }
  function updateBambooProgress() {
    els.progressFill.style.width = Math.min(100, Math.max(0, questionProgressPct())) + '%';
  }

  function selectOption(i) {
    state.answers[state.currentId] = i;
    [...els.optionsBox.children].forEach((btn, j) => btn.classList.toggle('active', j === i));
    els.hintText.textContent = '选好了就点下一题。';
  }

  function updateQuestion() {
    const q = currentQuestion();
    if (!q) return;
    els.questionText.textContent = q.q;
    els.typePill.textContent = q.type;
    const n = pathLength() + 1;
    els.qCount.textContent = `第 ${n} 题`;
    updateBambooProgress();
    els.prevBtn.disabled = pathLength() === 0;
    const atEnd = n >= state.targetCount;
    els.nextBtn.textContent = atEnd ? '查看结果' : '下一题';
    syncMobileBar();
    els.optionsBox.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt' + (state.answers[state.currentId] === i ? ' active' : '');
      btn.textContent = opt.t;
      btn.onclick = (e) => { e.preventDefault(); selectOption(i); };
      els.optionsBox.appendChild(btn);
    });
    els.hintText.textContent = state.answers[state.currentId] !== undefined
      ? '选好了就点下一题。' : '凭直觉选一项，不必想太久。';
  }

  function recalcScores() {
    const scores = [0, 0, 0, 0, 0, 0];
    state.path.forEach(id => {
      const q = LIT_Q[id];
      const ci = state.answers[id];
      if (ci === undefined) return;
      q.opts[ci].d.forEach((v, i) => scores[i] += v);
    });
    state.scores = scores;
  }

  function dominantDims(scores, n = 3) {
    return scores.map((v, i) => ({ i, v })).sort((a, b) => b.v - a.v).slice(0, n).map(x => DIMS[x.i]);
  }

  function buildWhy(top, dims) {
    const whispers = {
      '现实批判': '你惯于撕开表象，对空话与伪饰格外警觉',
      '抒情浪漫': '你的感受浓烈而真诚，字句里常有余温',
      '哲思抽象': '你爱追问本质，在隐喻与悖论里找答案',
      '都市孤独': '你与人群保持距离，内心却自有秩序',
      '人文悲悯': '你对他人处境敏感，笔下总有温度',
      '先锋实验': '你不肯按常理叙述，总想换一种写法'
    };
    return `你的气质里，「${dims[0]}」最为醒目——${whispers[dims[0]]}。读${top.name}的文字，常有照见自己的瞬间。`;
  }

  function drawRadar(userScores, writerTraits) {
    const cx = 160, cy = 160, R = 110, n = DIMS.length;
    const maxU = Math.max(...userScores, 1), maxT = 10;
    const pt = (vals, max, r = R) => vals.map((v, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + (v / max) * r * Math.cos(a), cy + (v / max) * r * Math.sin(a)];
    });
    const poly = pts => pts.map(p => p.join(',')).join(' ');
    const grid = [0.25, 0.5, 0.75, 1].map(f => {
      const pts = DIMS.map((_, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n;
        return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
      });
      return `<polygon points="${poly(pts)}" fill="none" stroke="#e7dccd" stroke-width="1"/>`;
    }).join('');
    const axes = DIMS.map((d, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      const x = cx + (R + 22) * Math.cos(a), y = cy + (R + 22) * Math.sin(a);
      return `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(a)}" y2="${cy + R * Math.sin(a)}" stroke="#e7dccd"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#6f6458">${d}</text>`;
    }).join('');
    const uPts = pt(userScores, maxU), wPts = pt(writerTraits, maxT);
    els.radarChart.innerHTML = `${grid}${axes}
      <polygon points="${poly(wPts)}" fill="rgba(176,137,104,.15)" stroke="#b08968" stroke-width="2" stroke-dasharray="6 4"/>
      <polygon points="${poly(uPts)}" fill="rgba(139,94,52,.25)" stroke="#8b5e34" stroke-width="2"/>`;
  }

  function showResult() {
    recalcScores();
    const ranked = WRITERS.map(w => ({ w, sim: similarity(state.scores, w.traits) })).sort((a, b) => b.sim - a.sim);
    const top = ranked[0].w;
    const pct = v => Math.round(v * 100);
    const dims = dominantDims(state.scores);
    const flowerKey = resultFlowerKey();
    const flowerLabel = FLOWER_LABELS[flowerKey];
    const avKey = typeof litAvatarKey === 'function' ? litAvatarKey(state.scores) : '';
    const why = buildWhy(top, dims);

    els.resultTitle.textContent = top.name;
    if (els.resultAvatar && typeof litAvatarHtml === 'function') {
      const avType = LIT_AVATAR_TYPE[avKey] || '';
      const avLabel = LIT_AVATAR_PAIRS[avKey] || '';
      els.resultAvatar.innerHTML = litAvatarHtml(avKey);
      els.resultAvatar.title = avType ? `${avType} · ${avLabel}` : '气质小人';
    }
    els.resultIntro.textContent = top.intro;
    els.resultOneLiner.textContent = top.one;
    els.resultWhy.textContent = why;
    els.resultQuote.textContent = top.quote;
    els.resultQuoteAuthor.textContent = `—— ${top.name}（${top.region} · ${top.kind}）`;
    els.personalityTags.innerHTML = dims.map(d => `<span>${d}</span>`).join('');

    const iconEl = document.getElementById('resultFlowerIcon');
    const descEl = document.getElementById('resultFlowerDesc');
    if (iconEl) iconEl.innerHTML = flowerSvg(flowerKey);
    if (descEl) descEl.innerHTML = `气质倾向：<strong>${dims[0]}</strong> · 花信意象 <strong>${flowerLabel}</strong>（依分支花信而定）`;

    playFlowerMusic(flowerKey);
    showMuteBtn(true);
    updateMuteBtn();

    els.top5List.innerHTML = ranked.slice(0, 5).map((r, i) => `
      <div class="top5-item">
        <div class="top5-rank ${i === 0 ? 'gold' : ''}">${i + 1}</div>
        <div>
          <div class="top5-name">${r.w.name}</div>
          <div class="top5-meta">${r.w.region} · ${r.w.kind}</div>
          <div class="meter"><i style="width:${pct(r.sim)}%"></i></div>
        </div>
        <strong>${pct(r.sim)}%</strong>
      </div>`).join('');

    els.top5Quotes.innerHTML = ranked.slice(0, 5).map((r, i) => `
      <div class="top5-quote-item"><strong>${i + 1}. ${r.w.name}</strong><br>${r.w.quote}</div>`).join('');

    drawRadar(state.scores, top.traits);

    if (typeof PersonalityInsights !== 'undefined') {
      const maxSim = ranked[0].sim || 1;
      const pctRel = v => Math.round((v / maxSim) * 100);
      PersonalityInsights.renderBarTop3(document.getElementById('matchBarTop3'), ranked, r => pctRel(r.sim));
      const prob = PersonalityInsights.monteCarloRankings(WRITERS, (u, t) => similarity(u, t));
      PersonalityInsights.renderProbLists(document.getElementById('probHotList'), document.getElementById('probColdList'), prob);
    }

    if (typeof LiteraryShareCard !== 'undefined') {
      LiteraryShareCard.setResult({
        top, ranked, dims, scores: state.scores.slice(),
        flowerKey, flowerLabel,
        avKey,
        avType: typeof LIT_AVATAR_TYPE !== 'undefined' ? (LIT_AVATAR_TYPE[avKey] || '') : '',
        why,
        pct
      });
    }

    if (typeof LitStats !== 'undefined') {
      LitStats.trackResult('literary', { id: top.id, name: top.name });
    }

    els.shareText.value = `我测出来更像「${top.name}」。\n${top.one}\n气质：${dims.join(' · ')}\n近邻：${ranked.slice(1, 5).map(r => r.w.name).join('、')}\n${top.quote}\n——你也来测一测？\n文学气质小测：${SHARE_URL}`;
    els.resultBox.classList.add('show');
    setView('result');
    els.resultBox.scrollIntoView({ behavior: 'smooth' });
  }

  function startTest() {
    stopMusic();
    showMuteBtn(false);
    state.path = [];
    state.answers = {};
    state.currentId = LIT_START;
    state.scores = [0, 0, 0, 0, 0, 0];
    state.milestones = {};
    state.track = null;
    state.activeMilestones = [];
    state.targetCount = MIN_Q;
    clearFlowers();
    els.resultBox.classList.remove('show');
    setView('test');
    updateQuestion();
    requestAnimationFrame(() => {
      document.getElementById('testArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function resetAll() { startTest(); }

  function next(e) {
    if (e) e.preventDefault();
    const q = currentQuestion();
    const ci = state.answers[state.currentId];
    if (ci === undefined) { showToast('先选一项吧'); return; }
    if (document.activeElement) document.activeElement.blur();

    if (!state.path.includes(state.currentId)) state.path.push(state.currentId);

    if (state.path.length === 1) {
      state.track = Q1_TRACK[Math.min(ci, Q1_TRACK.length - 1)] || '13';
      state.activeMilestones = [...MILESTONE_TRACKS[state.track]];
      applyMilestone(1, ci, 0);
    } else if (state.activeMilestones.includes(state.path.length)) {
      const branchIndex = 1 + state.activeMilestones.indexOf(state.path.length);
      applyMilestone(state.path.length, ci, branchIndex);
    }

    if (state.path.length >= state.targetCount) {
      els.progressFill.style.width = '100%';
      showResult();
      return;
    }

    const opt = q.opts[ci];
    let nextId = q.end ? pickContinueHub() : resolveNext(opt, q);
    if (!nextId || !LIT_Q[nextId]) nextId = pickContinueHub();
    if (nextId === state.currentId) nextId = pickContinueHub() || pickTerminal();
    if (!nextId || !LIT_Q[nextId]) {
      els.progressFill.style.width = '100%';
      showResult();
      return;
    }
    state.currentId = nextId;
    updateQuestion();
  }

  function prev(e) {
    if (e) e.preventDefault();
    if (state.path.length === 0) return;
    if (document.activeElement) document.activeElement.blur();
    state.currentId = state.path.pop();
    clearMilestonesAfter(state.path.length);
    updateQuestion();
  }

  function syncMobileBar() {
    const n = pathLength() + 1;
    const atEnd = n >= state.targetCount;
    const mb = document.getElementById('mobileNextBtn');
    if (mb) mb.textContent = atEnd ? '查看结果' : '下一题';
    const mp = document.getElementById('mobilePrevBtn');
    if (mp) mp.disabled = pathLength() === 0;
  }

  function copyShareText() {
    const ta = els.shareText;
    ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
    const ok = () => {
      document.getElementById('copyBtn').textContent = '已复制';
      showToast('文案已复制');
      setTimeout(() => document.getElementById('copyBtn').textContent = '复制分享文案', 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(ta.value).then(ok).catch(() => { try { document.execCommand('copy'); ok(); } catch (err) { showToast('请长按文案全选复制'); } });
    } else {
      try { document.execCommand('copy'); ok(); } catch (err) { showToast('请长按文案全选复制'); }
    }
  }

  document.getElementById('startBtn').onclick = startTest;
  document.getElementById('browseBtn').onclick = () => setView('browse');
  document.getElementById('showLibBtn').onclick = () => { setView('welcome'); document.querySelector('.library-aside').scrollIntoView({ behavior: 'smooth' }); };
  document.getElementById('nextBtn').onclick = next;
  document.getElementById('prevBtn').onclick = prev;
  document.getElementById('resetBtn').onclick = resetAll;
  document.getElementById('againBtn').onclick = () => {
    stopMusic();
    showMuteBtn(false);
    state.path = []; state.answers = {}; state.currentId = LIT_START;
    state.scores = [0, 0, 0, 0, 0, 0]; state.milestones = {};
    state.track = null; state.activeMilestones = []; state.targetCount = MIN_Q;
    els.resultBox.classList.remove('show');
    setView('welcome');
    els.progressFill.style.width = '0%';
    clearFlowers();
  };
  document.getElementById('mobileNextBtn').onclick = next;
  document.getElementById('mobilePrevBtn').onclick = prev;
  document.getElementById('copyBtn').onclick = copyShareText;
  document.getElementById('muteBtn').onclick = toggleMute;

  if (typeof LiteraryShareCard !== 'undefined') {
    LiteraryShareCard.init({ shareUrl: SHARE_URL, showToast });
  }

  if (typeof LitStats !== 'undefined') {
    LitStats.init('literary');
  }

  renderLibrary();
})();
