'use strict';
const { validateApp, usersCollection } = require('utils-common');
const crypto = require('crypto');

/**
 * 用户注册
 * @param {string} appid 应用ID
 * @param {string} mobile 手机号
 * @param {string} password 密码
 * @returns {object} 注册结果
 */
exports.main = async (event, context) => {
  try {
   // 验证应用
   const app = await validateApp(context.APPID);
    
    // 检查手机号是否已存在
    const { data: existingUser } = await usersCollection.where({
      mobile: event.mobile,
      appid: context.APPID
    }).get();
    
    if (existingUser.length > 0) {
      throw new Error('该用户已注册');
    }
    
    // 加密密码
    const encryptedPassword = crypto.createHash('sha256')
      .update(event.password + app.secret_key)
      .digest('hex');
    
    // 创建新用户
    const newUser = {
      mobile: event.mobile,
      password: encryptedPassword,
      appid: [event.appid],
      status: 0,
	  register_ip: context.CLIENTIP,
      register_date: new Date(),
      roles: ['user']
    };
    
    const { id } = await usersCollection.add(newUser);
    
    return {
      code: 200,
      message: '注册成功',
      data: {
        userId: id
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: error.message
    };
  }
};