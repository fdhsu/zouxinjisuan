
import config from '../common/config.js'

var baseAPI = config.appUrl
export const myRequest = (options) => {
  return new Promise((resolve, reject) => {
    if (options.load) {
      uni.showLoading({
        title: options.loadText?options.loadText:'加载中',
        mask: true,
      })
    }
	let header={
	    'content-type': 'application/json'
	}

    uni.request({
      url:  baseAPI + options.url,
      method: options.method || 'POST',
      data: options.data||{},
	  timeout:1000*60*5,
      header:header,
      success: (res) => {
        if (options.load) {
          uni.hideLoading()
        }		
		switch (res.statusCode) {
			case 200:
			// console.log("接口"+JSON.stringify(res.data)
			// )
			  resolve(res.data ? res.data : res)
			  return
			case 400:
				 uni.showToast({ title: res.data.error_description,icon:"none" });    
				 break;
			case 401:
				uni.showToast({ title: res.data.error_description,icon:"none" });
				break
			case 402:
				uni.showToast({ title: '无接口权限，请联系管理员',icon:"none" });
				break	
			case 404:
			  uni.showToast({ title: '访问路径不存在',icon:"none" });
			  break
			case 500:
			  uni.showToast({ title: '服务异常',icon:"none" });
			  break
			case 503:
			  uni.showToast({ title: '请耐心等待，服务更新中。。。',icon:"none" });
			  break
			default:
			   console.log("接口url："+baseAPI+options.url)
			   uni.showToast({ title: res.data?res.data.msg:'服务器异常，请联系管理员',icon:"none" });
			  break
		}
	
		 reject(res.data ? res.data : res)
      },
      fail: (err) => {
        if (!options.noLoad) {
          uni.hideLoading()
        }
		console.log(baseAPI+ options.url+"接口error：")
		console.log(err)		  
        reject(err)
      },
    })
  })
}