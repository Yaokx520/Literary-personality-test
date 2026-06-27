#!/usr/bin/env node
/* Generate international packs — run: node gen_international.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'packs');
const SHARED = path.join(__dirname, 'shared');

const UI = require('./ui_locales.json');

function loadWriters() {
  const src = fs.readFileSync(path.join(ROOT, 'literary_data.js'), 'utf8');
  const m = src.match(/const WRITERS = \[([\s\S]*?)\];/);
  return 'const WRITERS = [' + m[1] + '];';
}

function loadQuestions() {
  return fs.readFileSync(path.join(ROOT, 'literary_questions.js'), 'utf8');
}

function extractCss() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1] : '';
}

function translateQuestions(src, lang) {
  const enMap = {
    '夜雨敲窗的时候，你最先想起的常常是——': 'When rain taps the window at night, you first think of—',
    '若把此刻心绪写成半句话，它多半会停在——': 'If you wrote half a sentence for this mood, it would stop at—',
    '走进人群，你更像——': 'Walking into a crowd, you are more like—',
    '一本好书翻至中途被打断，你心里会闪过——': 'When a good book is interrupted midway, you think—',
    '「乡愁」一词，先唤起的并非地名，而是——': 'The word "homesickness" first brings not a place, but—',
    '你更熟稔哪一种沉默——': 'Which silence do you know best—',
    '提笔写字时，最先落下的往往是——': 'When you write, the first thing to land is often—',
    '这也太奇怪了': 'That is too weird',
    '无从下手': 'No idea where to start',
    '我不道啊': 'I have no clue',
    '大脑一片空白': 'My mind goes blank',
    '题在说什么？': 'What is this asking?',
    '随便吧，都可以': 'Whatever works',
    '先逃了再说': 'Escape first',
  };
  let out = src;
  const maps = { en: enMap, es: {}, fr: {}, pt: {}, ja: {}, ru: {} };
  const apply = maps[lang] || enMap;
  if (lang !== 'en') {
    Object.assign(apply, enMap);
  }
  for (const [zh, t] of Object.entries(apply)) {
    out = out.split(zh).join(t);
  }
  return '/* Literary questions · ' + lang + ' */\n' + out;
}

function indexHtml(lang, ui) {
  return `<!DOCTYPE html>
<html lang="${ui.htmlLang || lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="${ui.eyebrow}" />
  <title>${ui.title}</title>
  <link rel="stylesheet" href="../shared/literary.css" />
</head>
<body class="view-welcome">
  <div class="wrap">
    <section class="hero">
      <span class="eyebrow">${ui.eyebrow}</span>
      <h1>${ui.title}</h1>
      <p class="intro">${ui.intro}</p>
      <div class="meta">
        <span class="tag">${ui.tag1}</span><span class="tag">${ui.tag2}</span>
        <span class="tag">${ui.tag3}</span><span class="tag">${ui.tag4}</span>
      </div>
      <div class="controls welcome-cta" style="margin-top:20px">
        <button class="btn primary" id="startBtn">${ui.start}</button>
        <button class="btn ghost" id="browseBtn">${ui.browse}</button>
      </div>
    </section>
    <div class="grid">
      <section class="card panel test-area" id="testArea">
        <div class="section-title"><h2>${ui.qTitle}</h2><small id="qTotalLabel">${ui.qTotal}</small></div>
        <div class="bamboo-progress"><div class="bamboo-track" id="bambooTrack"><div class="bamboo-fill" id="progressFill"></div></div></div>
        <div class="q-count" id="qCount"></div>
        <div class="type-pill" id="typePill"></div>
        <div class="question" id="questionText"></div>
        <div class="options" id="optionsBox"></div>
        <div class="controls">
          <button class="btn ghost" id="prevBtn">${ui.prev}</button>
          <button class="btn ghost" id="resetBtn">${ui.reset}</button>
          <button class="btn primary" id="nextBtn">${ui.next}</button>
        </div>
        <p class="mini" id="hintText"></p>
      </section>
      <aside class="card panel library-aside">
        <div class="section-title"><h2>${ui.libTitle}</h2><small id="libCount"></small></div>
        <div class="library" id="libraryBox"></div>
      </aside>
    </div>
    <section class="result" id="resultBox">
      <div class="result-grid">
        <div>
          <span class="eyebrow">${ui.resultEyebrow}</span>
          <div class="result-flower-theme" id="resultFlowerTheme"><div class="theme-flower" id="resultFlowerIcon"></div><p id="resultFlowerDesc"></p></div>
          <div class="result-title-row"><h2 id="resultTitle"></h2><div class="result-avatar" id="resultAvatar"></div></div>
          <p class="lead" id="resultIntro"></p>
          <div class="personality-tags" id="personalityTags"></div>
          <div class="result-box"><h3>${ui.verdict}</h3><p id="resultOneLiner"></p></div>
          <div class="result-box"><h3>${ui.why}</h3><p id="resultWhy"></p></div>
          <div class="result-box quote-card"><h3>${ui.quoteTitle}</h3><blockquote id="resultQuote"></blockquote><cite id="resultQuoteAuthor"></cite></div>
          <div class="result-box"><h3>${ui.top5q}</h3><div id="top5Quotes" class="top5-quotes"></div></div>
        </div>
        <div>
          <div class="result-box"><h3>${ui.radar}</h3><div class="radar-wrap"><svg id="radarChart" width="320" height="320" viewBox="0 0 320 320"></svg></div><p class="mini" style="text-align:center;margin-top:4px">${ui.radarHint}</p></div>
          <div class="result-box"><h3>${ui.probTitle}</h3><p class="mini" style="margin-bottom:10px">${ui.probHint}</p><div class="prob-hotcold"><div><h4>${ui.hot}</h4><ol id="probHotList"></ol></div><div><h4>${ui.cold}</h4><ol id="probColdList"></ol></div></div></div>
          <div class="result-box"><h3>${ui.top5}</h3><div class="top5" id="top5List"></div></div>
          <div class="result-box"><h3>${ui.share}</h3><textarea class="share" id="shareText" readonly></textarea><p class="share-tip" id="shareTip">${ui.shareTip}</p></div>
          <div class="controls">
            <button class="btn primary" id="againBtn">${ui.again}</button>
            <button class="btn ghost" id="copyBtn">${ui.copy}</button>
            <button class="btn ghost" id="showLibBtn">${ui.showLib}</button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="mobile-bar" id="mobileBar">
    <button class="btn ghost" id="mobilePrevBtn">${ui.prev}</button>
    <button class="btn primary" id="mobileNextBtn">${ui.next}</button>
  </div>
  <button type="button" class="mute-btn" id="muteBtn"><span class="icon" id="muteIcon">🔊</span><span id="muteLabel">${ui.mute}</span></button>
  <div class="toast" id="toast"></div>
  <script src="../../stats-config.js"></script>
  <script src="../../stats-client.js"></script>
  <script src="../../personality_insights.js"></script>
  <script src="locale.js"></script>
  <script src="writers.js"></script>
  <script src="questions.js"></script>
  <script src="../../literary_avatars.js"></script>
  <script src="../shared/literary_test_i18n.js"></script>
</body>
</html>`;
}

fs.mkdirSync(SHARED, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(SHARED, 'literary.css'), extractCss());
fs.copyFileSync(path.join(__dirname, 'literary_test_i18n.js'), path.join(SHARED, 'literary_test_i18n.js'));

const writers = loadWriters();
const questions = loadQuestions();
const langs = Object.keys(UI);

for (const lang of langs) {
  const dest = path.join(OUT, lang);
  fs.mkdirSync(dest, { recursive: true });
  const ui = UI[lang];
  ui.shareUrl = 'https://yaokx520.github.io/Literary-personality-test/international/packs/' + lang + '/';
  fs.writeFileSync(path.join(dest, 'index.html'), indexHtml(lang, ui), 'utf8');
  fs.writeFileSync(path.join(dest, 'locale.js'), 'window.LIT_I18N = ' + JSON.stringify(ui, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(path.join(dest, 'writers.js'), writers, 'utf8');
  fs.writeFileSync(path.join(dest, 'questions.js'), translateQuestions(questions, lang), 'utf8');
  console.log('Generated', lang);
}

const manifest = langs.flatMap(l => [
  `${l}/index.html`, `${l}/locale.js`, `${l}/writers.js`, `${l}/questions.js`
]).concat(['../shared/literary.css', '../shared/literary_test_i18n.js']);

fs.writeFileSync(path.join(OUT, 'MANIFEST.txt'),
  'International Literary Temperament Test\nLanguages: ' + langs.join(', ') + '\n\n' + manifest.join('\n') + '\n',
  'utf8');
console.log('Done ->', OUT);
