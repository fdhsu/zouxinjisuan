<template>
<view>
  <view class="logo">
    <image src="/static/logo/144-144.png"></image>
  </view>
  <view class="login_from">
      <input placeholder="手机号" v-model="mobile" type="number" maxlength="11" placeholder-style="color: #333"></input>
	  <input placeholder="密码" v-model="password"  maxlength="20" type="password" placeholder-style="color: #333"></input>
		<view class="agreement">
	   <checkbox-group @change="checkboxChange">
	   	<label>
	   		<checkbox value="readCb" :checked="isReadChk"/>我已阅读并同意
	   	</label>
	   	<text class="link" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/agreement.html')">《用户协议》</text>
		<text class="link" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/privacy.html')">《隐私协议》</text>
	   </checkbox-group>
	   </view>
      <view class="login_btn" @click="onlogin">注册</view>
	<view class="register">
		  <text class="link " @click="navigateToRegister">返回登录</text>
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
import { setUserInfo,setToken } from "../../utils/auth";
export default {
  data() {
    return {
	  isReadChk: false,
      isCanUse: uni.getStorageSync('isCanUse'),
      mobile: '',
	  username:'',
	  password:'',
      avatarUrl: '',
      bgImg: ['', ''],
      imgTime: '',
      imgIndex: 0,
	  codeName: '验证码',
      isCode: true,
	
	  smscode:'',
	  wxcode: ''
    };
  },
  props: {},
  methods: {
	checkboxChange(e) {
		// console.log(e)
		// console.log(e.detail.value)
		// console.log(e.detail.value.length > 0)
		this.isReadChk = e.detail.value.length > 0
	},
	navigateToRegister() {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	},
	navTo(url){
		uni.navigateTo({
			url:url,
			animationType: 'slide-in-bottom',
		})
	},
	navsTo(url){
		uni.navigateTo({
			url:url
		})
	},
	onlogin(){ //登录 模拟存储token
	if (!this.isReadChk) {
	        uni.showToast({
	          title: '请先同意用户协议',
	          icon: 'none'
	        });
	        return;
	      } 
	
		let date = new Date().getTime()
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
		uni.showLoading({
			title:'注册中...'
		})
		uniCloud.callFunction({
		  name: 'appregister',
		  data: {
		    mobile: this.mobile,
		    password: this.password
		  }
		}).then(res => {
			uni.hideLoading()
		  console.log(res.result);
		  if (res.result.code === 200) {
		    // 保存token和用户信息
			setToken(res.result.data.token)
			setToken(res.result.data)
			uni.showToast({
				title:'注册成功'
			})
			uni.navigateBack(-1)
		  }else{
			  uni.showToast({
			  	title: res.result.message,
			  	icon: 'none'
			  })
		  }
		  uni.hideLoading()
		}).catch(err => {
			uni.hideLoading()
		  console.error(err);
		  uni.showToast({
		  	title: err.message,
		  	icon: 'none'
		  })

		});
	}
  }
};
</script>
<style scoped lang="scss">
	.register{
		padding-top: 20px;
	}
.agreement{
	padding-top: 20px;
}
.login{
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.6s ease-in-out;
  background-color: #eee;
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