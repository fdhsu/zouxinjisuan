/**
 * 公共工具函数
 * 统一格式化为金额、日期、导航、提示等，避免各页面重复定义
 */

// ─── 金额格式化 ───

/**
 * 带千分位的金额格式化（保留原始小数位）
 * 与 baby/index.vue、house.vue 原有 formatMoney 行为一致
 * @param {number|string} num
 * @returns {string}
 */
export function formatMoney(num) {
  if (num === 0 || num === '0') return '0';
  if (num === undefined || num === null || isNaN(Number(num))) return '0';
  var parts = Number(num).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * 带千分位 + 固定 2 位小数
 * 与 tax.vue 原有 fmt() 行为一致
 * @param {number|string} n
 * @returns {string}
 */
export function fmt2(n) {
  if (n === 0 || n === undefined || n === null || isNaN(Number(n))) return '0.00';
  return Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 带千分位 + 固定 0 位小数（整数金额）
 * 与 date.vue 原有 fmt() 行为一致
 * @param {number|string} n
 * @returns {string}
 */
export function fmt0(n) {
  return Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 安全地四舍五入到 2 位小数
 * @param {number} n
 * @returns {number}
 */
export function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

// ─── 日期格式化 ───
/**
 * 将 Date 对象格式化为 YYYY-MM-DD
 */
export function formatDate(date) {
  var y = date.getFullYear();
  var m = ('0' + (date.getMonth() + 1)).slice(-2);
  var d = ('0' + date.getDate()).slice(-2);
  return y + '-' + m + '-' + d;
}

/**
 * 将 Date 对象格式化为 YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date) {
  var base = formatDate(date);
  var h = ('0' + date.getHours()).slice(-2);
  var min = ('0' + date.getMinutes()).slice(-2);
  var s = ('0' + date.getSeconds()).slice(-2);
  return base + ' ' + h + ':' + min + ':' + s;
}

// ─── 导航 ───
/**
 * 带动画跳转到子页面（slide-in-bottom）
 */
export function navTo(url) {
  uni.navigateTo({ url: url, animationType: 'slide-in-bottom' });
}

/**
 * 普通跳转（无动画）
 */
export function navPlain(url) {
  uni.navigateTo({ url: url });
}

// ─── 提示 ───
/**
 * 显示纯文本 Toast
 */
export function toast(msg, duration) {
  uni.showToast({ title: msg, icon: 'none', duration: duration || 2000 });
}

// ─── 验证 ───
/**
 * 校验中国大陆手机号
 */
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}
