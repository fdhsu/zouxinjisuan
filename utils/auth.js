// 本地缓存工具方法

/** 用户 token */
export function setToken(value) {
  uni.setStorageSync('mortgage-token', value);
}
export function getToken() {
  return uni.getStorageSync('mortgage-token');
}
export function removeToken() {
  uni.removeStorageSync('mortgage-token');
}

/** 用户信息 */
export function setUserInfo(value) {
  try {
    uni.setStorageSync('mortgage-userinfo', JSON.stringify(value));
  } catch (e) {}
}
export function getUserInfo() {
  const userinfo = uni.getStorageSync('mortgage-userinfo');
  if (userinfo) {
    return JSON.parse(userinfo);
  }
}
export function removeUserInfo() {
  uni.removeStorageSync('mortgage-userinfo');
}

/** 项目配置（主题等） */
export function setConfig(value) {
  try {
    uni.setStorageSync('config', JSON.stringify(value));
  } catch (e) {}
}
export function getConfig() {
  const config = uni.getStorageSync('config');
  if (config) {
    return JSON.parse(config);
  }
}
