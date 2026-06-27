const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const source = JSON.parse(fs.readFileSync(path.join(DIR, 'source_zh.json'), 'utf8'));
const writersZh = JSON.parse(fs.readFileSync(path.join(DIR, 'writers_source_zh.json'), 'utf8'));

const ABSURD = require('./data/absurd');
const TYPES = require('./data/types');
const QUESTIONS = require('./data/questions');

function buildQuestions(lang) {
  const out = {};
  const tr = QUESTIONS[lang];
  for (const [qid, item] of Object.entries(source)) {
    const zhOpts = item.opts;
    const qtr = tr[qid];
    const opts = zhOpts.map((zo, i) => {
      if (ABSURD[lang][zo]) return ABSURD[lang][zo];
      return qtr.opts[i];
    });
    out[qid] = { q: qtr.q, type: TYPES[lang][item.type] || item.type, opts };
  }
  return out;
}

const langs = ['en', 'es', 'fr', 'pt', 'ja', 'ru'];
const counts = {};

for (const lang of langs) {
  const qPath = path.join(DIR, `questions.${lang}.json`);
  fs.writeFileSync(qPath, JSON.stringify(buildQuestions(lang), null, 2), 'utf8');
  counts[`questions.${lang}.json`] = fs.readFileSync(qPath, 'utf8').split('\n').length;
}

counts['writers_source_zh.json'] = fs.readFileSync(path.join(DIR, 'writers_source_zh.json'), 'utf8').split('\n').length;
console.log(JSON.stringify(counts, null, 2));
