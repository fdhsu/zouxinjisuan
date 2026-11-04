/**
 * 用户相关 API（uniCloud 云函数）
 */

/**
 * 提交反馈
 * @param {string} mobile - 用户手机号
 * @param {string} feedtype - 反馈类型
 * @param {string} feedinfo - 反馈内容
 * @returns {Promise}
 */
export function submitFeedback(mobile, feedtype, feedinfo) {
  return uniCloud.callFunction({
    name: 'feedback',
    data: { mobile, feedtype, feedinfo }
  });
}

/**
 * 注销账号
 * @param {string} mobile - 用户手机号
 * @returns {Promise}
 */
export function logoffAccount(mobile) {
  return uniCloud.callFunction({
    name: 'applogoff',
    data: { mobile }
  });
}
