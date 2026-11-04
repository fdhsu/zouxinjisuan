'use strict';
const { validateApp, usersCollection } = require('utils-common');
const crypto = require('crypto');

/**
 * 用户登录
 * @param {string} appid 应用ID
 * @param {string} mobile 手机号
 * @param {string} password 密码
 * @returns {object} 登录结果
 */
exports.main = async (event, context) => {
  try {
    // 验证应用
    const app = await validateApp(context.APPID);
    
    // 查找用户
    const { data: users } = await usersCollection.where({
      mobile: event.mobile,
      appid: context.APPID
    }).get();
    
    if (users.length === 0) {
      throw new Error('用户不存在或不属于该应用');
    }
    
    const user = users[0];
    
    // 验证密码
    const encryptedPassword = crypto.createHash('sha256')
      .update(event.password + app.secret_key)
      .digest('hex');
    
    if (user.password !== encryptedPassword) {
      throw new Error('密码错误');
    }
    
    // 检查用户状态
    if (user.status !== 0) {
      throw new Error('用户已被禁用');
    }
    
    // 更新最后登录时间
    await usersCollection.doc(user._id).update({
      last_login_date: new Date(),
	  last_login_ip: context.CLIENTIP,
    });
    
    // 生成token (简化版，实际应该使用更安全的方案)
    const token = crypto.createHash('md5')
      .update(user._id + app.secret_key + Date.now())
      .digest('hex');
    
    return {
      code: 200,
      message: '登录成功',
      data: {
        userId: user._id,
        nickname: user.mobile,
        token: token,
        appid: context.APPID
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: error.message
    };
  }
};