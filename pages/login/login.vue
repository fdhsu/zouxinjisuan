<template>
<view>
  <view class="logo">
    <image src="/static/logo/144-144.png"></image>
  </view>
  <view class="login_from">
      <input placeholder="请输入手机号" v-model="mobile" type="number" maxlength="11" placeholder-style="color: #333"></input>
	  <input placeholder="密码" v-model="password"  maxlength="20" type="password" placeholder-style="color: #333"></input>
	   
      <view class="login_btn" @click="onlogin">登录</view>
	  <view class="register">
		  <text class="link " @click="navigateToRegister">没有账户，去注册</text>
	  </view>
		<view class="list-call" style="color: #666; margin-left:auto;margin-right: auto;padding-top: 30px;text-align: center;">
			<text class="link" style="font-size: 14px;" @click="openAutoLogin" v-if="os=='app'">本机一键登录</text>  
		</view>
  </view>
  <!-- #ifdef MP-WEIXIN -->
  <view class="login_from">
	  <button class="login_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
  </view>
  <!-- #endif -->
</view>
</template>

<script>
// 引入 JSON 文件
// const manifest = require('@/manifest.json');
	
// // 获取 appid
// const appid = manifest.appid;
// console.log('当前项目的 appid 是:', appid);
import { setUserInfo,setToken } from "../../utils/auth";
export default {
  data() {
    return {
	  isReadChk: true,
      isCanUse: uni.getStorageSync('isCanUse'),
      mobile: '',
	  password:'',
      avatarUrl: '',
      bgImg: ['', ''],
      imgTime: '',
      imgIndex: 0,
	  codeName: '验证码',
      isCode: true,
	
	  smscode:'',
	  wxcode: '',
	  showSmsLogin:false,
	  password: '',
	  openid:'',
	  unionid:'',
	  userinfowx:'',
	  idfd:1,
	  fxpid:0,
	  islogin:false,
	  isdl:false,
	  code:'',
	  anonymousCode:'',
	  gender:0,
	  nickName:'',
	  btnDisbe:false,
	  autoLogin:false,
	  secret: 'b2EyMHF6ZDExMTExMTAwMA==',
	  os:'',
    };
  },
  props: {},
  onLoad() {
  	let _this=this
  	uni.preLogin({
  		provider: 'univerify',
  		success(){  //
  			// 显示一键登录选项
  			console.log('预登录成功')
  			_this.autoLogin=true
  			console.log("this.autoLogin:"+_this.autoLogin)
  		},
  		fail(res){  // 预登录失败
  			console.log(res)
  		}
  	})
  	
  	this.os = uni.getSystemInfoSync().uniPlatform;
  	console.log("os:"+this.os)
  },
  methods: {
	  //一键登录
	  openAutoLogin(){
	  	if(!this.autoLogin){
	  			uni.showToast({ title: '请打开数据流量',icon:"none" });
	  			return
	  	}
	  	let _self = this;
	  	uni.login({
	  		provider: 'univerify',
	  		univerifyStyle: { // 自定义登录框样式
	  		//参考`univerifyStyle 数据结构`
	  		  "icon": {
	  		        "path": "static/login/144-144.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
	  		        "width":  "60px",  //图标宽度 默认值：60px
	  		        "height": "60px"   //图标高度 默认值：60px
	  		    },
	  	  },
	  		success(res){ // 登录成功
	  			console.log(res);  // {openid:'登录授权唯一标识',access_to.ken:'接口返回的 token'}
	  			// 在得到access_token后，通过callfunction调用云函数
	  			uniCloud.callFunction({
	  			  name: 'toolautologin',
	  			  data: res.authResult
	  			}).then(res => {
	  				console.log("获取号码成功：")
	  				console.log(res.result.phoneNumber)
	  				if(res.result.code===0){
	  						uniCloud.callFunction({
	  						  name: 'applogreg',
	  						  data: {
	  						    mobile: res.result.phoneNumber,
								password: "aaaaaa"
	  						  }
	  						}).then(res => {
	  						  console.log(res.result);
	  						  if (res.result.code === 200) {
	  							console.log(res.result.data)
								
	  						    // 保存token和用户信息
								setToken(res.result.data.token)
	  							setUserInfo(res.result.data)
	  							uni.showToast({
	  								title:'登陆成功'
	  							})
	  							// 登录成功，可以关闭一键登录授权界面了
	  							uni.closeAuthView()
								uni.switchTab({
								  url: '/pages/index/me',
								  success: () => {
								    console.log('跳转成功');
								  },
								  fail: (err) => {
								    console.log('跳转失败', err);
								  }
								});
	  							//uni.navigateBack(-1)
	  						  }else{
	  							  uni.showToast({
	  							  	title: res.result.message,
	  							  	icon: 'none'
	  							  })
	  						  }
	  						  uni.hideLoading()
	  						}).catch(err => {
	  						  console.error(err);
	  						  uni.showToast({
	  						  	title: err.message,
	  						  	icon: 'none'
	  						  })
	  						  uni.hideLoading()
	  						});
	  						
	  				}else{
	  					uni.showToast({ title: '登录失败',icon:"none" });
	  				}
	  			  
	  			}).catch(err=>{
	  			  // 处理错误
	  			  console.log("获取错误："+err)
	  			})
	  			
	  			//
	  		},
	  		fail(res){  // 登录失败
	  			console.log(res)
	  			if(res.errCode==30002){
	  				uni.closeAuthView()
	  			}else{
	  				uni.showToast({ title: res.errMsg,icon:"none" });
	  			}
	  		}
	  	})
	  },
	
	checkboxChange(e) {
		// console.log(e)
		// console.log(e.detail.value)
		// console.log(e.detail.value.length > 0)
		this.isReadChk = e.detail.value.length > 0
	},
	navigateToRegister() {
		uni.navigateTo({
			url: '/pages/login/register'
		});
	},
	navigateToAgreement() {
		uni.navigateTo({
			url: '/pages/me/agreement'
		});
	},
    getUserInfo() {
      let _this = this;
      uni.getUserInfo({
        provider: 'weixin',
        success: function (infoRes) {
          console.log(infoRes);
		  
		  let form = {code: _this.wxcode, userInfo: infoRes.userInfo}
		  _this.request('/v1/login/weixin', form, 'POST').then(res=>{
			  console.log("login: ", res)
		  	_this.setData({
		  	  mobile: infoRes.userInfo.mobile,
		  	  //昵称
		  	  avatarUrl: infoRes.userInfo.avatarUrl //头像
		  	});
		  	setToken(res.data.token) 
		  	setUserInfo(infoRes.userInfo);  //模拟存储用户信息
		  	try {
		  	  uni.setStorageSync('isCanUse', 1); //记录是否第一次授权  false:表示不是第一次授权
		  	  uni.switchTab({
		  	    url: '/pages/views/tabBar/home'
		  	  });
		  	} catch (e) {
		  	  console.log('缓存失败');
		  	}
		  	
		  })
		  
          
        },

        fail(res) {}

      });
    },
	onlogin(){ //登录 模拟存储token
	if (!this.isReadChk) {
	        uni.showToast({
	          title: '请先同意用户协议',
	          icon: 'none'
	        });
	        return;
	      } 
	if(!this.mobile){
		uni.showToast({ title: '手机号不能为空',icon:"none" });
		return false;
	}
	const regex = /^1[3-9]\d{9}$/;
	if(!regex.test(this.mobile)){
		uni.showToast({ title: '输入正确手机号',icon:"none" });
		return false;
	}
	if(!this.password){
		uni.showToast({ title: '密码不能为空',icon:"none" });
		return false;
	}
		let date = new Date().getTime()
		//setToken(date)
		// let user = {  //模拟存储用户信息
		// 	avatarUrl: '../../static/logo/192-192.png',
		// 	nickName: '游客'
		// }
		// setUserInfo(user)
		
		
		// setUserInfo(infoRes.userInfo);  //模拟存储用户信息
		uni.showLoading({
			title:'登录中...'
		})
		/*setTimeout(()=>{
			uni.hideLoading()
			uni.showToast({
				title:'登陆成功'
			})
		}, 500)*/
		
		//console.log('当前项目的 appid 是:', appid);
		uniCloud.callFunction({
		  name: 'applogin',
		  data: {
		    mobile: this.mobile,
		    password: this.password
		  }
		}).then(res => {
		  console.log(res.result);
		  if (res.result.code === 200) {
		    // 保存token和用户信息
			setToken(res.result.data.token)
			setUserInfo(res.result.data)
			uni.showToast({
				title:'登陆成功'
			})
			uni.switchTab({
			  url: '/pages/index/me',
			  success: () => {
			    console.log('跳转成功');
			  },
			  fail: (err) => {
			    console.log('跳转失败', err);
			  }
			});
		  }else{
			  uni.showToast({
			  	title: res.result.message,
			  	icon: 'none'
			  })
		  }
		  uni.hideLoading()
		}).catch(err => {
		  console.error(err);
		  uni.showToast({
		  	title: err.message,
		  	icon: 'none'
		  })
		  uni.hideLoading()
		});
	},
	getCode() { //获取用户短信验证码
		if(this.isCode == false){
			return
		}
		if (this.tel == '') {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.tel)) {
			uni.showToast({
				title: '请填写正确手机号码',
				icon: 'none'
			});
			return false;
		}
		this.getPhoneCode()
	},
	getPhoneCode() {
		let timer = ''
		let date = 120
		let that = this
		if (that.isCode == true) {
			uni.showToast({
				title: '验证码发送成功~',
				icon: 'none'
			})
			clearInterval(timer)
			setInterval(() => {
				if (date >= 1) {
					date--
					that.codeName = date + '秒重试'
					that.isCode = false
				} else {
					that.isCode = true
					that.codeName = '验证码'
					clearInterval(timer)
				}
			}, 1000)
		}
	},
	wxlogin() {
	  // 1.wx获取登录用户code
	  let _this = this;
	  uni.login({
	    provider: 'weixin',
	    success: function (loginRes) {
	      console.log('这是用户的code', loginRes);
		  _this.setData({
			  wxcode: loginRes.code
		  });
	    }
	  });
	},
	onAuthorize(){ //微信公众号授权登录
		uni.showToast({
			title:'对接你的公众号登录方法',
			icon:"none"
		})
	}
  }
};
</script>
<style scoped lang="scss">
.agreement{
	padding-top: 20px;
}
.register{
	padding-top: 20px;
}
.login{
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.6s ease-in-out;
  background-color: #333;
}
.logo image{
  height: 160upx;
  width: 160upx;
  display: block;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 120upx;
}
.login_from{
  width: 80vw;
  margin: 0 auto;
  margin-top: 5vh;
}
.login_from .codes{
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: space-between;
}
.login_from input{
  height: 90upx;
  line-height: 90upx;
  margin-bottom: 60upx;
  background-color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  padding: 0 30upx;
  border-radius: 10upx;
  font-size: 30upx;
  color: #333;
}
.codes input{
	width: 75%;
}
.agreement {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }
.codes view{
	height: 80upx;
	line-height: 80upx;
	width: 130upx;
	margin-bottom: 60upx;
	color: #FFFFFF;
	background-color: rgba(70, 143, 152, 0.8);
	text-align: center;
	font-size: 24upx;
	border-radius: 10upx;
}
.login_btn{
  width: 100%;
  height: 90upx;
  margin: 0 auto;
  background-color: rgba(70, 143, 152, 0.8);
  margin-top: 30px;
  text-align: center;
  line-height: 90upx;
  border-radius: 40upx;
  color: #fff;
  font-size: 30upx;
}
.login_btn:active{
  opacity: 0.9;
}
.wxLogin{
  height: 200upx;
  width: 300upx;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  position: fixed;
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
}
.link{
	color: rgba(70, 143, 152, 0.8)
}
.wxLogin view{
  text-align: center;
  color: #FFFFFF;
  font-size: 24upx;
  margin-bottom: 20upx;
}
.wxLogin image{
  height: 100upx;
  width: 100upx;
  display: block;
  z-index: 10;
  margin: 0 auto;
}
.wxLogin button{
  width: 100upx!important;
  height: 100upx;
  position: absolute;
  border-radius: 50%;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 10;
  padding: 0!important;
}
</style>