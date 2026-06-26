/* 文学气质小测 · 结果分享卡（Canvas + SVG 降级） */
(function (global) {
  const FLOWER_IMG = {
    taohua: 'assets/flowers/taohua.png',
    lihua: 'assets/flowers/lihua.webp',
    meihua: 'assets/flowers/meihua.png',
    juhua: 'assets/flowers/juhua.png',
    mudan: 'assets/flowers/mudan.png'
  };

  const FLOWER_IMG_ALT = {
    lihua: ['assets/flowers/lihua.webp', 'assets/flowers/梨花.webp', 'assets/flowers/lihua.png']
  };

  const FLOWER_SONG = {
    taohua: '妖扬《桃花树下桃花仙》',
    lihua: '等什么君《春庭雪》',
    meihua: '蒋雪儿《落了白》',
    juhua: '李鑫一《一花一剑》',
    mudan: '指尖笑《人间惊鸿宴》'
  };

  const shareAssetCache = {};
  let config = { shareUrl: '', showToast: () => {} };
  let lastResult = null;
  let lastShareCanvas = null;
  let lastShareExportUrl = '';
  let lastSharePreviewUrl = '';

  function showToast(msg) {
    config.showToast(msg);
  }

  function revokeSharePreviewUrl() {
    if (lastSharePreviewUrl && lastSharePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(lastSharePreviewUrl);
    }
    lastSharePreviewUrl = '';
    lastShareExportUrl = '';
  }

  function svgEsc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function wrapSvgLines(text, maxLen, maxLines) {
    const chars = [...(text || '')];
    const lines = [];
    let line = '';
    for (const ch of chars) {
      if (line.length >= maxLen) { lines.push(line); line = ch; }
      else line += ch;
      if (maxLines && lines.length >= maxLines) break;
    }
    if (line && (!maxLines || lines.length < maxLines)) lines.push(line);
    if (maxLines && chars.length > lines.join('').length && lines.length) {
      const last = lines[lines.length - 1];
      lines[lines.length - 1] = last.length > 1 ? last.slice(0, -1) + '…' : last + '…';
    }
    return lines.length ? lines : [''];
  }

  function flowerImgCandidates(flowerKey) {
    const primary = FLOWER_IMG[flowerKey];
    const alts = FLOWER_IMG_ALT[flowerKey] || [];
    return [...new Set([primary, ...alts].filter(Boolean))];
  }

  function waitForImg(img, ms = 8000) {
    if (img.complete && img.naturalWidth) return Promise.resolve(img);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('img timeout')), ms);
      const done = () => {
        clearTimeout(timer);
        img.naturalWidth ? resolve(img) : reject(new Error('img empty'));
      };
      img.onload = done;
      img.onerror = () => { clearTimeout(timer); reject(new Error('img error')); };
    });
  }

  function imgToCompressedDataUrl(img, maxW, maxH, mime, quality) {
    if (!img || !img.naturalWidth) return '';
    let w = img.naturalWidth, h = img.naturalHeight;
    const scale = Math.min(1, maxW / w, maxH > 0 ? maxH / h : Infinity);
    w = Math.max(1, Math.round(w * scale));
    h = Math.max(1, Math.round(h * scale));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    try { return c.toDataURL(mime || 'image/jpeg', quality == null ? 0.88 : quality); }
    catch (_) { return ''; }
  }

  function xhrAsDataUrl(url) {
    return new Promise(resolve => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status !== 200 || !xhr.response) { resolve(''); return; }
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => resolve('');
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => resolve('');
        xhr.send();
      } catch (_) { resolve(''); }
    });
  }

  function loadImageElement(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => reject(new Error('timeout')), 8000);
      img.onload = () => { clearTimeout(timer); resolve(img); };
      img.onerror = () => { clearTimeout(timer); reject(new Error('load failed')); };
      img.src = url;
    });
  }

  function resolveAssetSrc(src) {
    if (!src) return '';
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    try { return new URL(src, document.baseURI || location.href).href; }
    catch (_) { return src; }
  }

  async function resolveAssetDataUrl(src, maxW, maxH) {
    if (!src) return '';
    if (shareAssetCache[src]) return shareAssetCache[src];

    const url = resolveAssetSrc(src);
    const tail = src.split('/').pop();
    for (const img of document.querySelectorAll('#resultAvatar img, .result-avatar img')) {
      if (!img.complete || !img.naturalWidth) continue;
      const s = img.currentSrc || img.src;
      if (s === url || (tail && s.includes(tail))) {
        const data = imgToCompressedDataUrl(img, maxW, maxH, 'image/jpeg', 0.88);
        if (data) { shareAssetCache[src] = data; return data; }
      }
    }

    let raw = '';
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const blob = await resp.blob();
        raw = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (_) { /* fetch 不可用则尝试 XHR */ }

    if (!raw) raw = await xhrAsDataUrl(url);

    if (!raw) {
      try {
        const img = await loadImageElement(url);
        raw = imgToCompressedDataUrl(img, maxW, maxH, 'image/jpeg', 0.88);
      } catch (_) { raw = ''; }
    }

    if (!raw) return '';

    if (raw.startsWith('data:image/') && (raw.length > 420000 || maxW)) {
      try {
        const img = await loadImageFromDataUrl(raw);
        const limitW = maxW || 520;
        const limitH = maxH > 0 ? maxH : img.naturalHeight;
        const compressed = imgToCompressedDataUrl(img, limitW, limitH, 'image/jpeg', 0.85);
        if (compressed) raw = compressed;
      } catch (_) { /* 保持原图 */ }
    }

    shareAssetCache[src] = raw;
    return raw;
  }

  async function resolveFlowerDataUrl(flowerKey) {
    const cacheKey = 'flower:' + flowerKey;
    if (shareAssetCache[cacheKey]) return shareAssetCache[cacheKey];
    for (const src of flowerImgCandidates(flowerKey)) {
      const data = await resolveAssetDataUrl(src, 216, 216);
      if (data) {
        shareAssetCache[cacheKey] = data;
        return data;
      }
    }
    return '';
  }

  async function resolveAvatarDataUrl(avKey) {
    const src = typeof LIT_AVATAR_IMG !== 'undefined' ? LIT_AVATAR_IMG[avKey] : '';
    if (!src) return '';
    const cacheKey = 'avatar:' + avKey;
    if (shareAssetCache[cacheKey]) return shareAssetCache[cacheKey];
    const data = await resolveAssetDataUrl(src, 520, 0);
    if (data) shareAssetCache[cacheKey] = data;
    return data;
  }

  async function preloadShareAssetData(avKey, flowerKey) {
    Object.keys(shareAssetCache).forEach(k => delete shareAssetCache[k]);
    const avSrc = typeof LIT_AVATAR_IMG !== 'undefined' ? LIT_AVATAR_IMG[avKey] : '';
    const domImg = document.querySelector('#resultAvatar img');
    if (domImg && avSrc) {
      try {
        await waitForImg(domImg);
        const data = imgToCompressedDataUrl(domImg, 520, 0, 'image/jpeg', 0.88);
        if (data) shareAssetCache[avSrc] = shareAssetCache['avatar:' + avKey] = data;
      } catch (_) { /* DOM 立绘未就绪 */ }
    }
    if (avSrc && !shareAssetCache[avSrc]) await resolveAvatarDataUrl(avKey);
    await resolveFlowerDataUrl(flowerKey);
  }

  function svgHrefAttr(dataUrl) {
    if (!dataUrl) return '';
    return dataUrl.replace(/&/g, '&amp;').replace(/#/g, '%23');
  }

  function shareCardHeroLayout(W, pad, heroY, heroH) {
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

  function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      if (!dataUrl) { reject(new Error('no data url')); return; }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('decode failed'));
      img.src = dataUrl;
    });
  }

  async function loadCanvasImage(src) {
    const dataUrl = await resolveAssetDataUrl(src, 480, 568);
    if (!dataUrl) throw new Error('asset fetch failed: ' + src);
    return loadImageFromDataUrl(dataUrl);
  }

  function imageLoadWithTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error((label || 'image') + ' timeout')), ms))
    ]);
  }

  async function loadFlowerImage(flowerKey) {
    const dataUrl = await resolveFlowerDataUrl(flowerKey);
    if (!dataUrl) throw new Error('no flower img');
    return loadImageFromDataUrl(dataUrl);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      if (!canvas) { reject(new Error('no canvas')); return; }
      try {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob null')), 'image/png');
      } catch (e) { reject(e); }
    });
  }

  async function tryCanvasExportUrl(canvas) {
    try {
      const blob = await canvasToBlob(canvas);
      return URL.createObjectURL(blob);
    } catch (_) {
      try {
        return canvas.toDataURL('image/png');
      } catch (e2) {
        return '';
      }
    }
  }

  function showShareCardModal(url) {
    const modal = document.getElementById('shareCardModal');
    const img = document.getElementById('shareCardModalImg');
    img.src = url;
    modal.classList.remove('hidden');
  }

  function hideShareCardModal() {
    document.getElementById('shareCardModal').classList.add('hidden');
  }

  function showSharePreview(url) {
    if (lastSharePreviewUrl && lastSharePreviewUrl !== url && lastSharePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(lastSharePreviewUrl);
    }
    lastShareExportUrl = url;
    lastSharePreviewUrl = url.startsWith('blob:') ? url : '';
    const preview = document.getElementById('shareCardPreview');
    preview.src = url;
    preview.classList.add('show');
    showShareCardModal(url);
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function dataUrlImageSize(dataUrl) {
    if (!dataUrl) return { w: 0, h: 0 };
    try {
      const img = await loadImageFromDataUrl(dataUrl);
      return { w: img.naturalWidth, h: img.naturalHeight };
    } catch (_) {
      return { w: 0, h: 0 };
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function canvasWrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const chars = [...(text || '')];
    let line = '', ly = y, lines = 0;
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, ly);
        line = ch;
        ly += lineHeight;
        lines++;
        if (maxLines && lines >= maxLines) return ly;
      } else line = test;
    }
    if (line) { ctx.fillText(line, x, ly); ly += lineHeight; }
    return ly;
  }

  function canvasFillTextCentered(ctx, text, cx, y, maxWidth) {
    const chars = [...(text || '')];
    let line = '';
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, cx, y);
        line = ch;
        y += 20;
      } else line = test;
    }
    if (line) ctx.fillText(line, cx, y);
    return y;
  }

  async function buildShareCardSvgDataUrl() {
    const r = lastResult;
    if (!r) throw new Error('no result');
    const shareUrl = config.shareUrl || '';
    const W = 750, pad = 40, heroH = 360, contentStartY = 200 + heroH;
    const avData = await resolveAvatarDataUrl(r.avKey);
    const flData = await resolveFlowerDataUrl(r.flowerKey);
    const songName = FLOWER_SONG[r.flowerKey] || '';

    let y = contentStartY + 28 + 36;
    y += 28 + wrapSvgLines(r.top.one, 22, 3).length * 26 + 12;
    y += 28 + wrapSvgLines(r.top.quote, 22, 4).length * 26 + 8 + 14 + 36;
    y += 28 + 5 * 24 + 8;
    y += 28 + wrapSvgLines(r.why, 24, 4).length * 24 + 16;
    const footerY = y + 20;
    const H = footerY + 96;
    const heroY = 188;
    const layout = shareCardHeroLayout(W, pad, heroY, heroH);
    const avSize = await dataUrlImageSize(avData);
    const avFit = fitImageInBox(avSize.w, avSize.h, layout.av);
    const flImageSize = Math.min(layout.fl.w - 12, 80);
    const flowerX = layout.fl.x + (layout.fl.w - flImageSize) / 2;
    const flowerY = layout.fl.y + 28;
    const flTextX = layout.fl.x + layout.fl.w / 2;

    const textBlock = (title, lines, startY, italic) => {
      let out = `<text x="${pad}" y="${startY}" fill="#8b5e34" font-size="18" font-weight="700" font-family="'Noto Serif SC', serif">${svgEsc(title)}</text>`;
      lines.forEach((line, i) => {
        out += `<text x="${pad}" y="${startY + 28 + i * 26}" fill="#4b3d31" font-size="16" ${italic ? 'font-style="italic"' : ''} font-family="'Noto Serif SC', serif">${svgEsc(line)}</text>`;
      });
      return out;
    };

    let bodyY = contentStartY;
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fffaf1"/><stop offset="100%" stop-color="#f3e8d8"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="28" fill="rgba(255,255,255,0.88)" stroke="#e7dccd" stroke-width="2"/>
<text x="${W / 2}" y="72" text-anchor="middle" fill="#8b5e34" font-size="22" font-weight="700" font-family="'Noto Serif SC', serif">文学气质小测 · 我的文学气质结果</text>
<text x="${W / 2}" y="130" text-anchor="middle" fill="#2b241c" font-size="42" font-weight="700" font-family="'Noto Serif SC', serif">更像「${svgEsc(r.top.name)}」</text>
<text x="${W / 2}" y="162" text-anchor="middle" fill="#6f6458" font-size="16" font-family="'Noto Serif SC', serif">${svgEsc(r.top.region)} · ${svgEsc(r.top.kind)}</text>
<rect x="${pad}" y="${heroY}" width="${W - pad * 2}" height="${heroH}" rx="18" fill="rgba(139,94,52,0.05)" stroke="#e7dccd"/>
<line x1="${layout.fl.x}" y1="${layout.blockY + 8}" x2="${layout.fl.x}" y2="${layout.blockY + layout.blockH - 8}" stroke="#e7dccd" stroke-width="1"/>
${avData ? `<image xlink:href="${svgHrefAttr(avData)}" href="${svgHrefAttr(avData)}" x="${avFit.x}" y="${avFit.y}" width="${avFit.w}" height="${avFit.h}" preserveAspectRatio="xMidYMid meet"/>` : `<rect x="${layout.av.x}" y="${layout.av.y}" width="${layout.av.w}" height="${layout.av.h}" rx="12" fill="rgba(139,94,52,0.08)"/><text x="${layout.av.x + layout.av.w / 2}" y="${layout.av.y + layout.av.h / 2}" text-anchor="middle" fill="#8b5e34" font-size="16" font-family="'Noto Serif SC', serif">${svgEsc(r.avType || '气质小人')}</text>`}
${flData ? `<image xlink:href="${svgHrefAttr(flData)}" href="${svgHrefAttr(flData)}" x="${flowerX}" y="${flowerY}" width="${flImageSize}" height="${flImageSize}" preserveAspectRatio="xMidYMid meet"/>` : ''}
<text x="${flTextX}" y="${flowerY + flImageSize + 28}" text-anchor="middle" fill="#8b5e34" font-size="14" font-weight="700" font-family="'Noto Serif SC', serif">花信：${svgEsc(r.flowerLabel)}</text>
<text x="${flTextX}" y="${flowerY + flImageSize + 50}" text-anchor="middle" fill="#6f6458" font-size="12" font-family="'Noto Serif SC', serif">歌曲：${svgEsc(songName)}</text>
${r.avType ? `<text x="${flTextX}" y="${flowerY + flImageSize + 72}" text-anchor="middle" fill="#2f6f4e" font-size="12" font-weight="600" font-family="'Noto Serif SC', serif">气质小人 · ${svgEsc(r.avType)}</text>` : ''}
<text x="${W / 2}" y="${bodyY}" text-anchor="middle" fill="#2f6f4e" font-size="14" font-weight="600" font-family="'Noto Serif SC', serif">${svgEsc(r.dims.join(' · '))}</text>
<text x="${W / 2}" y="${bodyY + 28}" text-anchor="middle" fill="#6f6458" font-size="14" font-family="'Noto Serif SC', serif">文学气质倾向 · ${svgEsc(r.dims[0])}</text>`;

    bodyY += 64;
    svg += textBlock('判语', wrapSvgLines(r.top.one, 22, 3), bodyY, false);
    bodyY += 28 + wrapSvgLines(r.top.one, 22, 3).length * 26 + 12;
    svg += textBlock('文学家名言', wrapSvgLines(r.top.quote, 22, 4), bodyY, true);
    bodyY += 28 + wrapSvgLines(r.top.quote, 22, 4).length * 26 + 8;
    svg += `<text x="${pad}" y="${bodyY}" fill="#6f6458" font-size="14" font-family="'Noto Serif SC', serif">—— ${svgEsc(r.top.name)}</text>`;
    bodyY += 36;
    svg += `<text x="${pad}" y="${bodyY}" fill="#8b5e34" font-size="18" font-weight="700" font-family="'Noto Serif SC', serif">Top 5 匹配</text>`;
    r.ranked.slice(0, 5).forEach((item, i) => {
      bodyY += 24;
      svg += `<text x="${pad}" y="${bodyY}" fill="${i === 0 ? '#8b5e34' : '#6f6458'}" font-size="15" font-family="'Noto Serif SC', serif">${i + 1}. ${svgEsc(item.w.name)}  ${r.pct(item.sim)}%</text>`;
    });
    bodyY += 32;
    svg += textBlock('几分缘由', wrapSvgLines(r.why, 24, 4), bodyY, false);
    svg += `<rect x="${pad}" y="${footerY}" width="${W - pad * 2}" height="72" rx="14" fill="rgba(139,94,52,0.08)"/>
<text x="${W / 2}" y="${footerY + 32}" text-anchor="middle" fill="#8b5e34" font-size="15" font-weight="600" font-family="'Noto Serif SC', serif">你也来测一测你的文学气质？</text>
<text x="${W / 2}" y="${footerY + 56}" text-anchor="middle" fill="#6f6458" font-size="13" font-family="'Noto Serif SC', serif">${svgEsc(shareUrl)}</text>
</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  async function buildShareCardCanvas() {
    if (!lastResult) throw new Error('no result');
    const shareUrl = config.shareUrl || '';
    const W = 750, pad = 40;
    const r = lastResult;
    const meas = document.createElement('canvas').getContext('2d');
    const heroH = 360;
    const contentStartY = 200 + heroH;

    function textHeight(text, font, maxWidth, lineHeight, maxLines) {
      meas.font = font;
      const chars = [...(text || '')];
      let line = '', lines = 1;
      for (const ch of chars) {
        const test = line + ch;
        if (meas.measureText(test).width > maxWidth && line) {
          line = ch;
          lines++;
          if (maxLines && lines >= maxLines) return lineHeight * maxLines;
        } else line = test;
      }
      return lineHeight * Math.max(lines, 1);
    }

    let y = contentStartY + 28 + 36;
    y += 28 + textHeight(r.top.one, '16px "Noto Serif SC", serif', W - pad * 2, 26, 3) + 12;
    y += 28 + textHeight(r.top.quote, 'italic 16px "Noto Serif SC", serif', W - pad * 2, 26, 4) + 8 + 14 + 36;
    y += 28 + 5 * 24 + 8;
    y += 28 + textHeight(r.why, '15px "Noto Serif SC", serif', W - pad * 2, 24, 4) + 16;
    const footerY = y + 20;
    const H = footerY + 96;

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
    ctx.fillStyle = 'rgba(255,255,255,.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(231,220,205,.95)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 22px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText('文学气质小测 · 我的文学气质结果', W / 2, 72);

    ctx.fillStyle = '#2b241c';
    ctx.font = '700 42px "Noto Serif SC", serif';
    ctx.fillText(`更像「${r.top.name}」`, W / 2, 130);

    ctx.fillStyle = '#6f6458';
    ctx.font = '16px "Noto Serif SC", serif';
    ctx.fillText(`${r.top.region} · ${r.top.kind}`, W / 2, 162);

    const heroY = 188;
    const layout = shareCardHeroLayout(W, pad, heroY, heroH);
    roundRect(ctx, pad, heroY, W - pad * 2, heroH, 18);
    ctx.fillStyle = 'rgba(139,94,52,.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(231,220,205,.9)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(layout.fl.x, layout.blockY + 8);
    ctx.lineTo(layout.fl.x, layout.blockY + layout.blockH - 8);
    ctx.strokeStyle = 'rgba(231,220,205,.9)';
    ctx.stroke();

    const avSrc = typeof LIT_AVATAR_IMG !== 'undefined' ? LIT_AVATAR_IMG[r.avKey] : '';
    if (avSrc) {
      try {
        const avImg = await imageLoadWithTimeout(loadCanvasImage(avSrc), 8000, 'avatar');
        const fit = fitImageInBox(avImg.naturalWidth, avImg.naturalHeight, layout.av);
        ctx.drawImage(avImg, fit.x, fit.y, fit.w, fit.h);
      } catch (_) {
        ctx.fillStyle = 'rgba(139,94,52,.08)';
        roundRect(ctx, layout.av.x, layout.av.y, layout.av.w, layout.av.h, 12);
        ctx.fill();
        ctx.fillStyle = '#8b5e34';
        ctx.font = '600 16px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(r.avType || '气质小人', layout.av.x + layout.av.w / 2, layout.av.y + layout.av.h / 2);
        ctx.textAlign = 'left';
      }
    }

    const flImageSize = Math.min(layout.fl.w - 12, 80);
    const flowerX = layout.fl.x + (layout.fl.w - flImageSize) / 2;
    const flowerY = layout.fl.y + 28;
    const flTextX = layout.fl.x + layout.fl.w / 2;
    try {
      const flImg = await imageLoadWithTimeout(loadFlowerImage(r.flowerKey), 8000, 'flower');
      const flFit = fitImageInBox(flImg.naturalWidth, flImg.naturalHeight, {
        x: flowerX, y: flowerY, w: flImageSize, h: flImageSize
      });
      ctx.drawImage(flImg, flFit.x, flFit.y, flFit.w, flFit.h);
    } catch (_) { /* 花信图加载失败时跳过 */ }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 14px "Noto Serif SC", serif';
    ctx.fillText(`花信：${r.flowerLabel}`, flTextX, flowerY + flImageSize + 28);
    ctx.fillStyle = '#6f6458';
    ctx.font = '12px "Noto Serif SC", serif';
    const songName = FLOWER_SONG[r.flowerKey] || '';
    canvasFillTextCentered(ctx, `歌曲：${songName}`, flTextX, flowerY + flImageSize + 50, layout.fl.w - 8);
    if (r.avType) {
      ctx.fillStyle = '#2f6f4e';
      ctx.font = '600 12px "Noto Serif SC", serif';
      ctx.fillText(`气质小人 · ${r.avType}`, flTextX, flowerY + flImageSize + 92);
    }
    ctx.textAlign = 'left';

    y = contentStartY;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2f6f4e';
    ctx.font = '600 14px "Noto Serif SC", serif';
    ctx.fillText(r.dims.join(' · '), W / 2, y);
    y += 28;
    ctx.fillStyle = '#6f6458';
    ctx.font = '14px "Noto Serif SC", serif';
    ctx.fillText(`文学气质倾向 · ${r.dims[0]}`, W / 2, y);
    y += 36;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px "Noto Serif SC", serif';
    ctx.fillText('判语', pad, y);
    y += 28;
    ctx.fillStyle = '#4b3d31';
    ctx.font = '16px "Noto Serif SC", serif';
    y = canvasWrapText(ctx, r.top.one, pad, y, W - pad * 2, 26, 3) + 12;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px "Noto Serif SC", serif';
    ctx.fillText('文学家名言', pad, y);
    y += 28;
    ctx.fillStyle = '#4b3d31';
    ctx.font = 'italic 16px "Noto Serif SC", serif';
    y = canvasWrapText(ctx, r.top.quote, pad, y, W - pad * 2, 26, 4) + 8;
    ctx.fillStyle = '#6f6458';
    ctx.font = '14px "Noto Serif SC", serif';
    ctx.fillText(`—— ${r.top.name}`, pad, y);
    y += 36;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px "Noto Serif SC", serif';
    ctx.fillText('Top 5 匹配', pad, y);
    y += 28;
    ctx.font = '15px "Noto Serif SC", serif';
    r.ranked.slice(0, 5).forEach((item, i) => {
      ctx.fillStyle = i === 0 ? '#8b5e34' : '#6f6458';
      ctx.fillText(`${i + 1}. ${item.w.name}  ${r.pct(item.sim)}%`, pad, y);
      y += 24;
    });
    y += 8;

    ctx.fillStyle = '#8b5e34';
    ctx.font = '700 18px "Noto Serif SC", serif';
    ctx.fillText('几分缘由', pad, y);
    y += 28;
    ctx.fillStyle = '#6f6458';
    ctx.font = '15px "Noto Serif SC", serif';
    y = canvasWrapText(ctx, r.why, pad, y, W - pad * 2, 24, 4) + 16;

    roundRect(ctx, pad, footerY, W - pad * 2, 72, 14);
    ctx.fillStyle = 'rgba(139,94,52,.08)';
    ctx.fill();
    ctx.fillStyle = '#8b5e34';
    ctx.font = '600 15px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText('你也来测一测你的文学气质？', W / 2, footerY + 32);
    ctx.fillStyle = '#6f6458';
    ctx.font = '13px "Noto Serif SC", serif';
    ctx.fillText(shareUrl, W / 2, footerY + 56);

    return canvas;
  }

  async function ensureShareCardUrl(forceRebuild = false) {
    if (forceRebuild) revokeSharePreviewUrl();
    if (!forceRebuild && lastShareExportUrl) return lastShareExportUrl;

    let canvasUrl = '';
    try {
      const canvas = await buildShareCardCanvas();
      lastShareCanvas = canvas;
      canvasUrl = await tryCanvasExportUrl(canvas);
    } catch (e) {
      console.warn('canvas build/export failed', e);
    }
    if (canvasUrl) {
      revokeSharePreviewUrl();
      lastShareExportUrl = canvasUrl;
      if (canvasUrl.startsWith('blob:')) lastSharePreviewUrl = canvasUrl;
      return canvasUrl;
    }

    const svgUrl = await buildShareCardSvgDataUrl();
    lastShareExportUrl = svgUrl;
    return svgUrl;
  }

  async function withShareCardReady(fn) {
    const btnIds = ['saveShareCardBtn', 'shareImageBtn', 'previewShareCardBtn'];
    const labels = {};
    btnIds.forEach(id => {
      const b = document.getElementById(id);
      if (b) { labels[id] = b.textContent; b.disabled = true; b.textContent = '生成中…'; }
    });
    try {
      showToast('正在生成结果卡…');
      if (lastResult) await preloadShareAssetData(lastResult.avKey, lastResult.flowerKey);
      const url = await ensureShareCardUrl(true);
      await fn(url);
    } catch (e) {
      console.error('share card error', e);
      showToast('生成结果卡失败，请重试');
    } finally {
      btnIds.forEach(id => {
        const b = document.getElementById(id);
        if (b) { b.disabled = false; b.textContent = labels[id]; }
      });
    }
  }

  async function saveShareCard() {
    if (!lastResult) { showToast('请先完成测试'); return; }
    await withShareCardReady(async url => {
      const name = lastResult.top.name.replace(/[\\/:*?"<>|]/g, '');
      if (url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `文学气质小测-${name}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('结果卡已保存');
        return;
      }
      showSharePreview(url);
      showToast('请长按图片保存到相册');
    });
  }

  async function shareShareCard() {
    if (!lastResult) { showToast('请先完成测试'); return; }
    const shareUrl = config.shareUrl || '';
    await withShareCardReady(async url => {
      const title = `我测出来更像文学家「${lastResult.top.name}」`;
      if (url.startsWith('blob:') && navigator.share) {
        try {
          const blob = await fetch(url).then(r => r.blob());
          const file = new File([blob], '文学气质小测结果.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title, text: title + '\n' + shareUrl, files: [file] });
            showToast('已唤起分享');
            return;
          }
          await navigator.share({ title, text: title + '\n' + shareUrl, url: shareUrl });
          showToast('已唤起分享');
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return;
        }
      }
      showSharePreview(url);
      showToast('请长按图片保存后发送给好友');
    });
  }

  async function previewShareCard() {
    if (!lastResult) { showToast('请先完成测试'); return; }
    await withShareCardReady(url => {
      showSharePreview(url);
      showToast('结果卡已生成，长按图片保存');
    });
  }

  function setResult(r) {
    lastResult = r;
    const preview = document.getElementById('shareCardPreview');
    if (preview) preview.classList.remove('show');
    revokeSharePreviewUrl();
    lastShareCanvas = null;
    Object.keys(shareAssetCache).forEach(k => delete shareAssetCache[k]);
    if (r && r.avKey && r.flowerKey) preloadShareAssetData(r.avKey, r.flowerKey);
  }

  function bindButtons() {
    const closeBtn = document.getElementById('shareCardModalClose');
    const modal = document.getElementById('shareCardModal');
    if (closeBtn) closeBtn.onclick = hideShareCardModal;
    if (modal) {
      modal.onclick = e => {
        if (e.target.id === 'shareCardModal') hideShareCardModal();
      };
    }
    const saveBtn = document.getElementById('saveShareCardBtn');
    const shareBtn = document.getElementById('shareImageBtn');
    const previewBtn = document.getElementById('previewShareCardBtn');
    if (saveBtn) saveBtn.onclick = () => saveShareCard().catch(e => { console.error(e); showToast('保存失败，请重试'); });
    if (shareBtn) shareBtn.onclick = () => shareShareCard().catch(e => { console.error(e); showToast('分享失败，请重试'); });
    if (previewBtn) previewBtn.onclick = () => previewShareCard().catch(e => { console.error(e); showToast('预览失败，请重试'); });
  }

  function init(cfg) {
    config = { shareUrl: cfg.shareUrl || '', showToast: cfg.showToast || (() => {}) };
    bindButtons();
  }

  global.LiteraryShareCard = {
    init,
    setResult,
    preloadShareAssetData,
    revokeSharePreviewUrl
  };
})(window);
