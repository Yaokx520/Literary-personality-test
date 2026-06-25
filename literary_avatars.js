/* 文学气质：六维 Top1+Top2 → 12 款国际风 3D 人物卡片立绘 */
const LIT_AVATAR_PAIRS = {
  '0_4': '现实批判 · 人文悲悯',
  '0_5': '现实批判 · 先锋实验',
  '1_3': '抒情浪漫 · 都市孤独',
  '1_4': '抒情浪漫 · 人文悲悯',
  '2_5': '哲思抽象 · 先锋实验',
  '2_1': '哲思抽象 · 抒情浪漫',
  '3_1': '都市孤独 · 抒情浪漫',
  '3_2': '都市孤独 · 哲思抽象',
  '4_0': '人文悲悯 · 现实批判',
  '4_1': '人文悲悯 · 抒情浪漫',
  '5_2': '先锋实验 · 哲思抽象',
  '5_0': '先锋实验 · 现实批判'
};

const LIT_AVATAR_TYPE = {
  '0_4': '人文观察',
  '0_5': '批判先锋',
  '1_3': '都市独语',
  '1_4': '浪漫悲悯',
  '2_5': '抽象实验',
  '2_1': '哲思浪漫',
  '3_1': '孤独抒情',
  '3_2': '都市哲思',
  '4_0': '悲悯现实',
  '4_1': '人文浪漫',
  '5_2': '先锋哲思',
  '5_0': '实验批判'
};

const LIT_AVATAR_IMG = {
  '0_4': 'assets/avatars/literary/lav_0_4.png',
  '0_5': 'assets/avatars/literary/lav_0_5.png',
  '1_3': 'assets/avatars/literary/lav_1_3.png',
  '1_4': 'assets/avatars/literary/lav_1_4.png',
  '2_5': 'assets/avatars/literary/lav_2_5.png',
  '2_1': 'assets/avatars/literary/lav_2_1.png',
  '3_1': 'assets/avatars/literary/lav_3_1.png',
  '3_2': 'assets/avatars/literary/lav_3_2.png',
  '4_0': 'assets/avatars/literary/lav_4_0.png',
  '4_1': 'assets/avatars/literary/lav_4_1.png',
  '5_2': 'assets/avatars/literary/lav_5_2.png',
  '5_0': 'assets/avatars/literary/lav_5_0.png'
};

function litAvatarKey(scores) {
  const sorted = scores.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const key = `${sorted[0].i}_${sorted[1].i}`;
  if (LIT_AVATAR_IMG[key]) return key;
  const fb = Object.keys(LIT_AVATAR_IMG).find(k => k.startsWith(`${sorted[0].i}_`));
  return fb || '1_4';
}

function litAvatarHtml(key) {
  const src = LIT_AVATAR_IMG[key];
  if (!src) return '';
  const type = LIT_AVATAR_TYPE[key] || '';
  const alt = type ? `气质类型 ${type}` : '气质小人';
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

const LIT_RADAR_DIMS = ['现实批判', '抒情浪漫', '哲思抽象', '都市孤独', '人文悲悯', '先锋实验'];
