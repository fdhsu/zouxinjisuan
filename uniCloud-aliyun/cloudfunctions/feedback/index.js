'use strict';
const db = uniCloud.database();
const feedbackCollection = db.collection('feedback');
exports.main = async (event, context) => {
	try {
	const feedBackInfo = {
			mobile: event.mobile,
			appid: [context.APPID],
			status: 1,
			feedtype: event.feedtype,
			feedinfo: event.feedinfo,
			create_time: new Date()
	};
	const { id } = await feedbackCollection.add(feedBackInfo);
	return {
	      code: 200,
	      message: '提交成功',
	      data: {
	        id: id,
	      }
	    };
	  } catch (error) {
	    return {
	      code: 500,
	      message: error.message
	    };
	}
};