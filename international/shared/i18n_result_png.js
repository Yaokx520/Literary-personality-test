/* International edition · result PNG card (Canvas-only, no external assets required) */
(function (global) {
  let payload = null;
  let cfg = { shareUrl: '', showToast: () => {}, labels: {} };
  let lastUrl = '';

  function L(k, fb) {
    return (cfg.labels && cfg.labels[k]) || fb || k;
  }

  function wrapText(ctx, text, maxW) {
    const chars = [...(text || '')];
    const lines = [];
    let line = '';
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = ch;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function drawLines(ctx, text, x, y, maxW, lh, maxLines, color, font) {
    ctx.font = font;
    ctx.fillStyle = color;
    const lines = wrapText(ctx, text, maxW);
    const use = maxLines ? lines.slice(0, maxLines) : lines;
    use.forEach((ln, i) => ctx.fillText(ln, x, y + i * lh));
    return y + use.length * lh;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawMiniRadar(ctx, cx, cy, R, userScores, writerTraits) {
    const n = 6;
    const maxU = Math.max(...userScores, 1);
    const pt = (vals, max) => vals.map((v, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + (v / max) * R * Math.cos(a), cy + (v / max) * R * Math.sin(a)];
    });
    const poly = pts => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
    };
    [0.25, 0.5, 0.75, 1].forEach(f => {
      const pts = Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n;
        return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
      });
      ctx.strokeStyle = '#e7dccd';
      ctx.lineWidth = 1;
      poly(pts);
      ctx.stroke();
    });
    poly(pt(writerTraits, 10));
    ctx.fillStyle = 'rgba(176,137,104,.18)';
    ctx.fill();
    ctx.strokeStyle = '#b08968';
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    poly(pt(userScores, maxU));
    ctx.fillStyle = 'rgba(139,94,52,.28)';
    ctx.fill();
    ctx.strokeStyle = '#8b5e34';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  async function drawAvatar(ctx, x, y, w, h) {
    const img = document.querySelector('#resultAvatar img');
    if (!img || !img.complete || !img.naturalWidth) return false;
    try {
      const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight, 1);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function buildCanvas() {
    if (!payload) throw new Error('no payload');
    const p = payload;
    const W = 750;
    const pad = 40;
    const H = 1100;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#fffaf1');
    bg.addColorStop(1, '#f3e8d8');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    roundRect(ctx, 24, 24, W - 48, H - 48, 28);
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.fill();
    ctx.strokeStyle = '#e7dccd';
    ctx.lineWidth = 2;
    ctx.stroke();

    let y = 72;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 22px Georgia, "Noto Serif SC", serif';
    ctx.fillText(L('cardTitle', 'Literary Temperament Test · My Result'), W / 2, y);
    y += 52;
    ctx.fillStyle = '#2b241c';
    ctx.font = '700 38px Georgia, "Noto Serif SC", serif';
    ctx.fillText(`${L('matchLike', 'Most like')} 「${p.top.name}」`, W / 2, y);
    y += 34;
    ctx.fillStyle = '#6f6458';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${p.top.region} · ${p.top.kind}`, W / 2, y);
    y += 28;
    ctx.fillStyle = '#2f6f4e';
    ctx.font = '600 14px sans-serif';
    ctx.fillText(p.dims.join(' · '), W / 2, y);
    y += 36;

    const heroY = y;
    const heroH = 200;
    roundRect(ctx, pad, heroY, W - pad * 2, heroH, 16);
    ctx.fillStyle = 'rgba(139,94,52,.06)';
    ctx.fill();
    await drawAvatar(ctx, pad + 20, heroY + 20, 200, heroH - 40);
    drawMiniRadar(ctx, W - pad - 110, heroY + heroH / 2, 72, p.scores, p.top.traits);
    ctx.fillStyle = '#6f6458';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(L('flower', 'Flower') + ': ' + (p.flowerLabel || ''), W / 2, heroY + heroH - 16);
    y = heroY + heroH + 28;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px sans-serif';
    ctx.fillText(L('verdict', 'Verdict'), pad, y);
    y += 28;
    y = drawLines(ctx, p.top.one, pad, y, W - pad * 2, 26, 4, '#4b3d31', '16px sans-serif') + 16;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px sans-serif';
    ctx.fillText(L('writerQuote', 'Writer quote'), pad, y);
    y += 28;
    y = drawLines(ctx, p.top.quote, pad, y, W - pad * 2, 24, 3, '#4b3d31', 'italic 15px sans-serif') + 8;
    ctx.fillStyle = '#6f6458';
    ctx.font = '14px sans-serif';
    ctx.fillText('— ' + p.top.name, pad, y);
    y += 36;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px sans-serif';
    ctx.fillText(L('top5', 'Top 5 matches'), pad, y);
    y += 28;
    ctx.font = '15px sans-serif';
    p.ranked.slice(0, 5).forEach((item, i) => {
      ctx.fillStyle = i === 0 ? '#8b5e34' : '#6f6458';
      ctx.fillText(`${i + 1}. ${item.w.name}  ${p.pct(item.sim)}%`, pad, y);
      y += 22;
    });
    y += 12;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px sans-serif';
    ctx.fillText(L('why', 'Why this match'), pad, y);
    y += 28;
    y = drawLines(ctx, p.why, pad, y, W - pad * 2, 22, 5, '#6f6458', '14px sans-serif') + 20;

    const footY = H - 120;
    roundRect(ctx, pad, footY, W - pad * 2, 72, 14);
    ctx.fillStyle = 'rgba(139,94,52,.08)';
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '600 15px sans-serif';
    ctx.fillText(L('cta', 'Discover your literary temperament too?'), W / 2, footY + 30);
    ctx.fillStyle = '#6f6458';
    ctx.font = '12px sans-serif';
    const urlLines = wrapText(ctx, cfg.shareUrl || '', W - pad * 2 - 20);
    ctx.fillText(urlLines[0] || '', W / 2, footY + 54);

    return canvas;
  }

  async function ensureUrl(force) {
    if (!force && lastUrl) return lastUrl;
    const canvas = await buildCanvas();
    lastUrl = canvas.toDataURL('image/png');
    return lastUrl;
  }

  function showModal(url) {
    const modal = document.getElementById('shareCardModal');
    const img = document.getElementById('shareCardModalImg');
    const tip = document.querySelector('.share-card-modal-tip');
    if (tip) tip.textContent = L('modalTip', 'Long-press the image to save, or take a screenshot');
    if (img) img.src = url;
    if (modal) modal.classList.remove('hidden');
  }

  function hideModal() {
    document.getElementById('shareCardModal')?.classList.add('hidden');
  }

  function showPreview(url) {
    const preview = document.getElementById('shareCardPreview');
    if (preview) {
      preview.src = url;
      preview.classList.add('show');
    }
  }

  async function withBusy(fn) {
    const ids = ['saveShareCardBtn', 'shareImageBtn', 'previewShareCardBtn'];
    const labels = {};
    ids.forEach(id => {
      const b = document.getElementById(id);
      if (b) { labels[id] = b.textContent; b.disabled = true; b.textContent = L('generating', '…'); }
    });
    try {
      cfg.showToast(L('generating', 'Generating…'));
      await fn();
    } catch (e) {
      console.error('i18n png', e);
      cfg.showToast(L('genFail', 'Failed to generate image'));
    } finally {
      ids.forEach(id => {
        const b = document.getElementById(id);
        if (b) { b.disabled = false; b.textContent = labels[id]; }
      });
    }
  }

  async function save() {
    if (!payload) { cfg.showToast(L('needResult', 'Finish the test first')); return; }
    await withBusy(async () => {
      const url = await ensureUrl(true);
      const name = (payload.top.name || 'result').replace(/[\\/:*?"<>|]/g, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `literary-result-${name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showPreview(url);
      cfg.showToast(L('saved', 'Saved'));
    });
  }

  async function share() {
    if (!payload) { cfg.showToast(L('needResult', 'Finish the test first')); return; }
    await withBusy(async () => {
      const url = await ensureUrl(true);
      const title = `${L('matchLike', 'Most like')} ${payload.top.name}`;
      if (navigator.share) {
        try {
          const blob = await (await fetch(url)).blob();
          const file = new File([blob], 'literary-result.png', { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title, files: [file] });
            return;
          }
          await navigator.share({ title, text: title + '\n' + cfg.shareUrl, url: cfg.shareUrl });
          return;
        } catch (e) {
          if (e?.name === 'AbortError') return;
        }
      }
      showModal(url);
      cfg.showToast(L('longPressSave', 'Long-press image to save'));
    });
  }

  async function preview() {
    if (!payload) { cfg.showToast(L('needResult', 'Finish the test first')); return; }
    await withBusy(async () => {
      const url = await ensureUrl(true);
      showPreview(url);
      showModal(url);
    });
  }

  function bindButtons() {
    const closeBtn = document.getElementById('shareCardModalClose');
    if (closeBtn) closeBtn.onclick = hideModal;
    const modal = document.getElementById('shareCardModal');
    if (modal) modal.onclick = e => { if (e.target.id === 'shareCardModal') hideModal(); };
    const saveBtn = document.getElementById('saveShareCardBtn');
    const shareBtn = document.getElementById('shareImageBtn');
    const previewBtn = document.getElementById('previewShareCardBtn');
    if (saveBtn) saveBtn.onclick = () => save();
    if (shareBtn) shareBtn.onclick = () => share();
    if (previewBtn) previewBtn.onclick = () => preview();
  }

  function init(options) {
    cfg = {
      shareUrl: options.shareUrl || '',
      showToast: options.showToast || (() => {}),
      labels: options.labels || {}
    };
    bindButtons();
  }

  function setPayload(p) {
    payload = p;
    lastUrl = '';
  }

  global.I18nResultPng = { init, setPayload, bindButtons, save, share, preview };
})(window);
