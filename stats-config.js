/**
 * 统计 API 地址
 * - 本地开发：127.0.0.1:3921
 * - 线上（GitHub Pages HTTPS）：https://wqp520.cloud-ip.cc
 */
(function () {
  const host = location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:';
  const apiBase = isLocal ? 'http://127.0.0.1:3921' : 'https://wqp520.cloud-ip.cc';
  window.LIT_STATS_CONFIG = { apiBase };
})();
