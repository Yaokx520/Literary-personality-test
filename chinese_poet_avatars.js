/* 诗心小测：六维 Top1+Top2 → 12 款国风人物卡片立绘 */
const POET_AVATAR_PAIRS = {
  '0_4': '感时忧世 · 家国情怀',
  '0_5': '感时忧世 · 奇崛翻新',
  '1_3': '写意抒情 · 隐逸疏离',
  '1_4': '写意抒情 · 家国情怀',
  '2_5': '玄思清远 · 奇崛翻新',
  '2_1': '玄思清远 · 写意抒情',
  '3_1': '隐逸疏离 · 写意抒情',
  '3_2': '隐逸疏离 · 玄思清远',
  '4_0': '家国情怀 · 感时忧世',
  '4_1': '家国情怀 · 写意抒情',
  '5_2': '奇崛翻新 · 玄思清远',
  '5_0': '奇崛翻新 · 感时忧世'
};

/** 类型名（卡片标题，无序号） */
const POET_AVATAR_TYPE = {
  '0_4': '忧国志士',
  '0_5': '奇思异士',
  '1_3': '逍遥隐士',
  '1_4': '清雅才女',
  '2_5': '幻梦诗客',
  '2_1': '墨客诗人',
  '3_1': '哀婉词人',
  '3_2': '禅心居士',
  '4_0': '策谋之士',
  '4_1': '温润君子',
  '5_2': '瑰奇诗客',
  '5_0': '豪放词人'
};

const POET_AVATAR_IMG = {
  '0_4': 'assets/avatars/poet/pav_0_4.png',
  '0_5': 'assets/avatars/poet/pav_0_5.png',
  '1_3': 'assets/avatars/poet/pav_1_3.png',
  '1_4': 'assets/avatars/poet/pav_1_4.png',
  '2_5': 'assets/avatars/poet/pav_2_5.png',
  '2_1': 'assets/avatars/poet/pav_2_1.png',
  '3_1': 'assets/avatars/poet/pav_3_1.png',
  '3_2': 'assets/avatars/poet/pav_3_2.png',
  '4_0': 'assets/avatars/poet/pav_4_0.png',
  '4_1': 'assets/avatars/poet/pav_4_1.png',
  '5_2': 'assets/avatars/poet/pav_5_2.png',
  '5_0': 'assets/avatars/poet/pav_5_0.png'
};

/** 各选项向量六维均值（chinese_poet_questions.js），用于抵消题库维度偏置 */
const POET_DIM_AVG = [2.13, 2.01, 1.89, 1.84, 2.01, 1.92];

function estimatePoetAnswerCount(scores) {
  const sum = scores.reduce((a, b) => a + b, 0);
  const avgSum = POET_DIM_AVG.reduce((a, b) => a + b, 0);
  return Math.max(1, Math.round(sum / avgSum));
}

function poetAvatarKey(scores, answerCount) {
  const n = answerCount > 0 ? answerCount : estimatePoetAnswerCount(scores);
  const norm = scores.map((v, i) => (v - POET_DIM_AVG[i] * n) / Math.max(1, n));
  let bestKey = '1_4';
  let bestDist = Infinity;
  for (const key of Object.keys(POET_AVATAR_IMG)) {
    const [a, b] = key.split('_').map(Number);
    const centroid = [0, 0, 0, 0, 0, 0];
    centroid[a] = 2;
    centroid[b] = 1;
    const dist = norm.reduce((s, v, i) => s + (v - centroid[i]) ** 2, 0);
    if (dist < bestDist) {
      bestDist = dist;
      bestKey = key;
    }
  }
  return bestKey;
}

function poetAvatarHtml(key) {
  const src = POET_AVATAR_IMG[key];
  if (!src) return '';
  const type = POET_AVATAR_TYPE[key] || '';
  const alt = type ? `诗心类型 ${type}` : '诗心所向';
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

/* 雷达六维（与测试一致，含奇崛翻新） */
const POET_RADAR_DIMS = ['感时忧世', '写意抒情', '玄思清远', '隐逸疏离', '家国情怀', '奇崛翻新'];
