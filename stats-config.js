/**
 * 统计 API 地址：本地打开页面走 127.0.0.1；线上走公网 IP。
 * 注意：GitHub Pages 为 HTTPS，若统计 API 仅为 HTTP，浏览器会拦截上报（需为 API 配置 HTTPS）。
 */
(function () {
  const host = location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:';
  const apiBase = isLocal ? 'http://127.0.0.1:3921' : 'http://183.157.163.171:3921';
  window.LIT_STATS_CONFIG = { apiBase };
  if (location.protocol === 'https:' && apiBase.startsWith('http:')) {
    console.warn('[LitStats] HTTPS 页面无法向 HTTP 统计服务上报，请为 183.157.163.171 配置 HTTPS 或使用本地测试。');
  }
})();
