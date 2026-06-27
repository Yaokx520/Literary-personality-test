/* International edition · result PNG card (Canvas, repo-root assets) */
(function (global) {
  let payload = null;
  let cfg = { shareUrl: '', showToast: () => {}, labels: {} };
  let lastUrl = '';

  const ASSET_BASE = '../../../assets/';

  const FLOWER_IMG = {
    taohua: ASSET_BASE + 'flowers/taohua.png',
    lihua: ASSET_BASE + 'flowers/lihua.webp',
    meihua: ASSET_BASE + 'flowers/meihua.png',
    juhua: ASSET_BASE + 'flowers/juhua.png',
    mudan: ASSET_BASE + 'flowers/mudan.png'
  };

  function L(k, fb) {
    return (cfg.labels && cfg.labels[k]) || fb || k;
  }

  function songName(flowerKey) {
    const songs = (cfg.labels && cfg.labels.flowerSongs) || {};
    return songs[flowerKey] || '';
  }

  function flowerImgCandidates(flowerKey) {
    const primary = FLOWER_IMG[flowerKey];
    const alts = flowerKey === 'lihua'
      ? [ASSET_BASE + 'flowers/lihua.webp', ASSET_BASE + 'flowers/lihua.png']
      : [];
    return [...new Set([primary, ...alts].filter(Boolean))];
  }

  function loadImage(src, ms) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => reject(new Error('img timeout')), ms || 8000);
      img.onload = () => { clearTimeout(timer); resolve(img); };
      img.onerror = () => { clearTimeout(timer); reject(new Error('img load fail')); };
      img.src = src;
    });
  }

  async function loadFlowerImage(flowerKey) {
    for (const src of flowerImgCandidates(flowerKey)) {
      try {
        return await loadImage(src, 6000);
      } catch (_) {}
    }
    return null;
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

  function fillTextCentered(ctx, text, cx, y, maxW, lh) {
    const lines = wrapText(ctx, text, maxW);
    lines.forEach((ln, i) => ctx.fillText(ln, cx, y + i * lh));
    return y + lines.length * lh;
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

  function heroLayout(W, pad, heroY, heroH) {
    const inner = 14;
    const blockX = pad + inner;
    const blockW = W - pad * 2 - inner * 2;
    const blockH = heroH - inner * 2;
    const avW = Math.floor(blockW * 2 / 3);
    const flW = blockW - avW;
    const blockY = heroY + inner;
    return {
      blockX, blockY, blockW, blockH,
      av: { x: blockX, y: blockY, w: avW, h: blockH },
      fl: { x: blockX + avW, y: blockY, w: flW, h: blockH }
    };
  }

  function fitImageInBox(nw, nh, box) {
    if (!nw || !nh) return { x: box.x, y: box.y, w: box.w, h: box.h };
    const scale = Math.min(box.w / nw, box.h / nh);
    const w = nw * scale;
    const h = nh * scale;
    return {
      x: box.x + (box.w - w) / 2,
      y: box.y + (box.h - h) / 2,
      w, h
    };
  }

  async function drawAvatar(ctx, layout) {
    const img = document.querySelector('#resultAvatar img');
    if (!img || !img.complete || !img.naturalWidth) return false;
    try {
      const fit = fitImageInBox(img.naturalWidth, img.naturalHeight, layout.av);
      ctx.drawImage(img, fit.x, fit.y, fit.w, fit.h);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function drawFlowerPanel(ctx, layout, p) {
    const flSize = Math.min(layout.fl.w - 12, 80);
    const flowerX = layout.fl.x + (layout.fl.w - flSize) / 2;
    const flowerY = layout.fl.y + 20;
    const flTextX = layout.fl.x + layout.fl.w / 2;
    const maxTextW = layout.fl.w - 8;

    const flImg = await loadFlowerImage(p.flowerKey);
    if (flImg) {
      ctx.drawImage(flImg, flowerX, flowerY, flSize, flSize);
    } else {
      ctx.fillStyle = 'rgba(139,94,52,.08)';
      roundRect(ctx, flowerX, flowerY, flSize, flSize, 10);
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 13px sans-serif';
    let ty = flowerY + flSize + 24;
    ty = fillTextCentered(ctx, `${L('flower', 'Flower')}: ${p.flowerLabel || ''}`, flTextX, ty, maxTextW, 16);

    ctx.fillStyle = '#6f6458';
    ctx.font = '12px sans-serif';
    const song = songName(p.flowerKey);
    if (song) {
      fillTextCentered(ctx, `${L('song', 'Song')}: ${song}`, flTextX, ty + 4, maxTextW, 15);
    }

    if (p.avType) {
      ctx.fillStyle = '#2f6f4e';
      ctx.font = '600 11px sans-serif';
      fillTextCentered(ctx, `${L('avatar', 'Figure')} · ${p.avType}`, flTextX, ty + 28, maxTextW, 14);
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
    const heroH = 240;
    roundRect(ctx, pad, heroY, W - pad * 2, heroH, 16);
    ctx.fillStyle = 'rgba(139,94,52,.06)';
    ctx.fill();
    ctx.strokeStyle = '#e7dccd';
    ctx.lineWidth = 1;
    ctx.stroke();

    const layout = heroLayout(W, pad, heroY, heroH);
    ctx.beginPath();
    ctx.moveTo(layout.fl.x, layout.blockY + 8);
    ctx.lineTo(layout.fl.x, layout.blockY + layout.blockH - 8);
    ctx.strokeStyle = '#e7dccd';
    ctx.stroke();

    const hasAvatar = await drawAvatar(ctx, layout);
    if (!hasAvatar && p.avType) {
      ctx.fillStyle = 'rgba(139,94,52,.08)';
      roundRect(ctx, layout.av.x, layout.av.y, layout.av.w, layout.av.h, 12);
      ctx.fill();
      ctx.fillStyle = '#8b5e34';
      ctx.font = '600 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.avType, layout.av.x + layout.av.w / 2, layout.av.y + layout.av.h / 2);
    }

    await drawFlowerPanel(ctx, layout, p);
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
