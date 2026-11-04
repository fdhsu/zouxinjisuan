// 云函数 user_logout
'use strict';
exports.main = async (event, context) => {
  const { userId } = event;
  
  // 可选操作：
  // 1. 记录用户退出日志
  // 2. 更新用户最后在线时间
  // 3. 如果是敏感操作，可以使token失效
  
  // 示例：更新用户最后在线时间
  const db = uniCloud.database();
  await db.collection('users').doc(userId).update({
    lastLoginTime: Date.now()
  });
  
  return {
    code: 0,
    message: '退出成功'
  };
};