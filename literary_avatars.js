/* 文学气质：国际简约风 Q 版小人 — 大眼睛 + 色块形体区分，极少外饰 */
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

function litAvatarKey(scores) {
  const sorted = scores.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const key = `${sorted[0].i}_${sorted[1].i}`;
  if (LIT_AVATAR_SVG[key]) return key;
  const fb = Object.keys(LIT_AVATAR_SVG).find(k => k.startsWith(`${sorted[0].i}_`));
  return fb || '1_4';
}

const LIT_AVATAR_SVG = {
  '0_4': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <rect x="28" y="54" width="24" height="24" rx="10" fill="#4a7c59"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <path d="M36 43 Q40 45 44 43" fill="none" stroke="#c08060" stroke-width="1.2" stroke-linecap="round"/>
    <rect x="26" y="22" width="28" height="8" rx="4" fill="#3d6649"/>
  </svg>`,
  '0_5': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <path d="M26 54 L54 52 L52 76 Q40 80 28 76 Z" fill="#8b5e34"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <ellipse cx="40" cy="22" rx="15" ry="9" fill="#9b59b6"/>
    <rect x="24" y="48" width="32" height="5" rx="2" fill="#e74c3c"/>
  </svg>`,
  '1_3': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <rect x="30" y="54" width="20" height="24" rx="8" fill="#566573"/>
    <circle cx="40" cy="38" r="15" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="34" cy="38" rx="4.5" ry="5.5" fill="#fff"/><ellipse cx="46" cy="38" rx="4.5" ry="5.5" fill="#fff"/>
    <circle cx="34" cy="39" r="2.8" fill="#2c241c"/><circle cx="46" cy="39" r="2.8" fill="#2c241c"/>
    <circle cx="35" cy="37" r=".9" fill="#fff"/><circle cx="47" cy="37" r=".9" fill="#fff"/>
    <path d="M30 34 Q40 26 50 34 L48 42 Q40 36 32 42 Z" fill="#4a5568"/>
  </svg>`,
  '1_4': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <ellipse cx="40" cy="66" rx="18" ry="14" fill="#d4847c"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <path d="M36 43 Q40 46 44 43" fill="none" stroke="#e07070" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="40" cy="22" r="8" fill="#f48fb1" opacity=".85"/>
  </svg>`,
  '2_5': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <polygon points="28,54 52,54 48,78 32,78" fill="#6a4c93"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#6a4c93"/><circle cx="47" cy="37" r="3" fill="#3498db"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <ellipse cx="40" cy="22" rx="16" ry="8" fill="#2c3e50"/>
  </svg>`,
  '2_1': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <rect x="28" y="54" width="24" height="24" rx="12" fill="#789262"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <path d="M36 43 Q40 46 44 43" fill="none" stroke="#c08060" stroke-width="1.2" stroke-linecap="round"/>
    <ellipse cx="40" cy="24" rx="17" ry="6" fill="#5a7348"/>
  </svg>`,
  '3_1': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <rect x="30" y="56" width="20" height="22" rx="6" fill="#5d6d7e"/>
    <circle cx="40" cy="38" r="15" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="34" cy="38" rx="4.5" ry="5.5" fill="#fff"/><ellipse cx="46" cy="38" rx="4.5" ry="5.5" fill="#fff"/>
    <circle cx="34" cy="39" r="2.8" fill="#2c241c"/><circle cx="46" cy="39" r="2.8" fill="#2c241c"/>
    <circle cx="35" cy="37" r=".9" fill="#fff"/><circle cx="47" cy="37" r=".9" fill="#fff"/>
    <ellipse cx="40" cy="26" rx="14" ry="8" fill="#7f8c8d"/>
  </svg>`,
  '3_2': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <path d="M24 58 Q40 52 56 58 L52 78 Q40 82 28 78 Z" fill="#3d4f5f"/>
    <circle cx="40" cy="38" r="15" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="34" cy="38" rx="4.5" ry="5.5" fill="#fff"/><ellipse cx="46" cy="38" rx="4.5" ry="5.5" fill="#fff"/>
    <circle cx="34" cy="39" r="2.8" fill="#2c241c"/><circle cx="46" cy="39" r="2.8" fill="#2c241c"/>
    <circle cx="35" cy="37" r=".9" fill="#fff"/><circle cx="47" cy="37" r=".9" fill="#fff"/>
    <path d="M28 32 Q40 22 52 32 L50 40 Q40 34 30 40 Z" fill="#34495e"/>
  </svg>`,
  '4_0': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <rect x="26" y="54" width="28" height="24" rx="8" fill="#8d6e63"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <path d="M36 43 Q40 45 44 43" fill="none" stroke="#a07050" stroke-width="1" stroke-linecap="round"/>
    <rect x="26" y="24" width="28" height="6" rx="3" fill="#6d4c41"/>
  </svg>`,
  '4_1': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <ellipse cx="40" cy="66" rx="16" ry="13" fill="#b08968"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <path d="M36 43 Q40 46 44 43" fill="none" stroke="#d4847c" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M26 30 Q40 22 54 30 L52 34 Q40 28 28 34 Z" fill="#d7ccc8"/>
  </svg>`,
  '5_2': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <path d="M26 52 L54 50 L52 76 Q40 82 28 76 Z" fill="#c2185b"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#e91e63"/><circle cx="47" cy="37" r="3" fill="#00bcd4"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <ellipse cx="40" cy="22" rx="16" ry="9" fill="#e91e63"/>
  </svg>`,
  '5_0': `<svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="92" rx="18" ry="4" fill="rgba(43,36,28,.08)"/>
    <path d="M24 52 L56 50 L54 76 Q40 82 26 76 Z" fill="#2c2c2c"/>
    <circle cx="40" cy="36" r="16" fill="#ffe8d0" stroke="#e8c9a8" stroke-width=".8"/>
    <ellipse cx="33" cy="36" rx="5" ry="6" fill="#fff"/><ellipse cx="47" cy="36" rx="5" ry="6" fill="#fff"/>
    <circle cx="33" cy="37" r="3" fill="#2c241c"/><circle cx="47" cy="37" r="3" fill="#2c241c"/>
    <circle cx="34.5" cy="35" r="1" fill="#fff"/><circle cx="48.5" cy="35" r="1" fill="#fff"/>
    <rect x="24" y="22" width="32" height="7" rx="3" fill="#1a1a1a"/>
    <rect x="28" y="48" width="24" height="4" rx="2" fill="#c0392b"/>
  </svg>`
};
