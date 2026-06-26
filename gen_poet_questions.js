const fs = require('fs');
const vm = require('vm');

const QUIRKY = [
  '这也太奇怪了', '无从下手', '我不道啊', '大脑一片空白',
  '题在说什么？', '先逃了再说', '随便吧，都可以', '我是来凑数的',
];
const QUIRKY_D = [1, 1, 2, 3, 1, 2];
const REBALANCE = [1.55, 0.64, 0.83, 0.68, 0.86, 0.73];

const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync('chinese_poet_questions.js', 'utf8').replace(/^const /gm, 'var '),
  ctx
);
const POET_Q = ctx.POET_Q;

function clamp(v, lo = 0, hi = 10) {
  return Math.max(lo, Math.min(hi, v));
}
function rebalanceD(d) {
  const out = d.map((x, i) => clamp(Math.round(x * REBALANCE[i])));
  if (Math.max(...out) - Math.min(...out) < 2) {
    const i = out.indexOf(Math.max(...out));
    out[i] = clamp(out[i] + 1);
  }
  return out;
}
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const lines = [
  '/* 36题分支题库：均衡六维得分；每题4选项；每次可从 q01–q05 随机入口 */',
  'const POET_Q = {',
];

for (const qid of Object.keys(POET_Q).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))) {
  const q = POET_Q[qid];
  let extra = '';
  if (q.join) extra += `,join:'${q.join}'`;
  if (q.end) extra += ',end:true';
  lines.push(`  ${qid}:{id:'${qid}',q:'${esc(q.q)}',type:'${esc(q.type)}'${extra},opts:[`);
  const opts = q.opts.slice(0, 4);
  const qi = Number(qid.slice(1)) - 1;
  let detour = qi % 2 === 0 ? 'q30' : 'q31';
  if (['q30', 'q31', 'q32', 'q33'].includes(qid)) detour = opts[0]?.next || 'q14';
  opts.forEach(o => {
    const d = rebalanceD(o.d);
    const nstr = o.next && !q.end ? `,next:'${o.next}'` : '';
    lines.push(`    {t:'${esc(o.t)}',d:${JSON.stringify(d)}${nstr}},`);
  });
  lines.push('  ]},');
}
lines.push('};', '', "const POET_START = 'q04';", "const POET_START_POOL = ['q04','q05','q03','q02','q01'];", '');
fs.writeFileSync('chinese_poet_questions.js', lines.join('\n'), 'utf8');
console.log('OK chinese_poet_questions.js');
