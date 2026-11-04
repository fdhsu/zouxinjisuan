'use strict';
const { validateApp, usersCollection } = require('utils-common');
const crypto = require('crypto');

/**
 * 用户注销
 * @param {string} appid 应用ID
 * @param {string} mobile 手机号
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
    
	
    
    // 更新最后登录时间
    await usersCollection.doc(user._id).update({
		mobile: event.mobile+'-zx',
      last_login_date: new Date(),
	  last_login_ip: context.CLIENTIP,
    });

    
    return {
      code: 200,
      message: '注销成功',
      data: {
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: error.message
    };
  }
};