'use strict';
const { validateApp, usersCollection } = require('utils-common');
const crypto = require('crypto');
const db = uniCloud.database();
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
    
    // 检查手机号是否已存在
    const { data: existingUser } = await usersCollection.where({
      mobile: event.mobile,
      appid: context.APPID
    }).get();
	
	
    // 加密密码
    const encryptedPassword = crypto.createHash('sha256')
      .update(event.password + app.secret_key)
      .digest('hex');
	  
	let userId='';
    if (existingUser.length > 0) {
	  const user = existingUser[0];
	  // 更新最后登录时间
	  await usersCollection.doc(user._id).update({
	    last_login_date: new Date(),
	    last_login_ip: context.CLIENTIP,
	  });
	  userId = user._id
    }else{
		const newUser = {
				mobile: event.mobile,
				password: encryptedPassword,
				appid: [context.APPID],
				status: 0,
				register_date: new Date(),
				register_ip: context.CLIENTIP,
				last_login_date: new Date(),
				last_login_ip: context.CLIENTIP,
				roles: ['user']
		};
		const { id } = await usersCollection.add(newUser);
		let userId = id
	}

    // 生成token (简化版，实际应该使用更安全的方案)
    const token = crypto.createHash('md5')
      .update(userId + app.secret_key + Date.now())
      .digest('hex');
    
    return {
      code: 200,
      message: '登录成功',
      data: {
        userId: userId,
        nickname: event.mobile,
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