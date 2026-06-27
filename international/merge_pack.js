#!/usr/bin/env node
/** Merge translation JSON into questions.js / writers.js for one language pack. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const lang = process.argv[2];
const outDir = process.argv[3];
if (!lang || !outDir) {
  console.error('Usage: node merge_pack.js <lang> <outDir>');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const TR = path.join(__dirname, 'translations');

function loadJsConst(file, varName) {
  const src = fs.readFileSync(file, 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src.replace(/^const /gm, 'var '), ctx);
  return ctx[varName];
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function emitQuestions(qs) {
  const lines = [`/* Literary temperament questions · ${lang} */`, 'const LIT_Q = {'];
  const ids = Object.keys(qs).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  ids.forEach((id, idx) => {
    const q = qs[id];
    lines.push(`  ${id}:{id:'${id}',q:'${esc(q.q)}',type:'${esc(q.type)}',opts:[`);
    q.opts.forEach((o, oi) => {
      const d = o.d.join(', ');
      let tail = `d:[${d}]`;
      if (o.next) tail += `,next:'${o.next}'`;
      lines.push(`    {t:'${esc(o.t)}',${tail}},`);
    });
    lines.push('  ]' + (q.end ? ',end:true' : '') + '},');
  });
  lines.push('};');
  lines.push('const LIT_START = \'q01\';');
  return lines.join('\n') + '\n';
}

function emitWriters(writers) {
  const lines = [`/* Literary writers · ${lang} */`, 'const WRITERS = ['];
  writers.forEach(w => {
    const traits = w.traits.join(',');
    lines.push(
      `{id:'${w.id}',name:'${esc(w.name)}',region:'${esc(w.region)}',kind:'${esc(w.kind)}',traits:[${traits}],quote:'${esc(w.quote)}',intro:'${esc(w.intro)}',one:'${esc(w.one)}'},`
    );
  });
  lines.push('];');
  return lines.join('\n') + '\n';
}

const qTr = JSON.parse(fs.readFileSync(path.join(TR, `questions.${lang}.json`), 'utf8'));
const wTr = JSON.parse(fs.readFileSync(path.join(TR, `writers.${lang}.json`), 'utf8'));

const qs = loadJsConst(path.join(ROOT, 'literary_questions.js'), 'LIT_Q');
Object.entries(qs).forEach(([id, q]) => {
  const t = qTr[id];
  if (!t) throw new Error(`Missing question translation: ${id} (${lang})`);
  q.q = t.q;
  q.type = t.type;
  t.opts.forEach((text, i) => {
    if (!q.opts[i]) throw new Error(`Option count mismatch ${id} (${lang})`);
    q.opts[i].t = text;
  });
});

const writers = loadJsConst(path.join(ROOT, 'literary_data.js'), 'WRITERS');
writers.forEach(w => {
  const t = wTr[w.id];
  if (!t) throw new Error(`Missing writer translation: ${w.id} (${lang})`);
  w.name = t.name;
  w.region = t.region;
  w.kind = t.kind;
  w.intro = t.intro;
  w.one = t.one;
  w.quote = t.quote;
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'questions.js'), emitQuestions(qs), 'utf8');
fs.writeFileSync(path.join(outDir, 'writers.js'), emitWriters(writers), 'utf8');
console.log('Merged', lang, '->', outDir);
