'use strict';
const db = uniCloud.database();
const usersCollection = db.collection('uni-id-users');
const appsCollection = db.collection('apps');

/**
 * 验证应用是否有效
 * @param {string} appid 应用ID
 * @returns {object} 应用信息
 */
async function validateApp(appid) {
  const { data: app } = await appsCollection.where({
    appid: appid,
    status: 1
  }).get();
  
  if (app.length === 0) {
    throw new Error('应用不存在或已被禁用');
  }
  
  return app[0];
}

/**
 * 验证用户是否属于该应用
 * @param {string} userId 用户ID
 * @param {string} appid 应用ID
 * @returns {object} 用户信息
 */
async function validateUserApp(userId, appid) {
  const { data: user } = await usersCollection.doc(userId).get();
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  if (!user.appid || !user.appid.includes(appid)) {
    throw new Error('用户不属于该应用');
  }
  
  return user;
}

module.exports = {
  validateApp,
  validateUserApp,
  usersCollection,
  appsCollection
};
