const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(require('path').join(__dirname, '../literary_questions.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src.replace(/^const /gm, 'var '), ctx);
const qs = ctx.LIT_Q;
const byQ = {};
Object.entries(qs).forEach(([id, q]) => {
  byQ[id] = { q: q.q, type: q.type, opts: q.opts.map(o => o.t) };
});
fs.writeFileSync(require('path').join(__dirname, 'translations/source_zh.json'), JSON.stringify(byQ, null, 2), 'utf8');
console.log('questions', Object.keys(byQ).length);
