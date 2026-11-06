<template>
<view>
  <view class="logo">
    <image src="/static/logo/144-144.png"></image>
  </view>
  <view class="login_from">
      <input placeholder="请输入手机号" v-model="mobile" type="number" maxlength="11" placeholder-style="color: #333"></input>
	  <input placeholder="密码" v-model="password"  maxlength="20" type="password" placeholder-style="color: #333"></input>
	   <view class="agreement">
	   <checkbox-group @change="checkboxChange">
	   	<label>
	   		<checkbox value="readCb" :checked="isReadChk"/>我已阅读并同意
	   	</label>
	   	<text class="link" @click="navTo('/pages/login/privacy?url=http://app.dizengkeji.com/app/agreement.html')">《用户协议》</text>
	   		<text class="link" @click="navTo('/pages/login/privacy?url=http://app.dizengkeji.com/app/privacy.html')">《隐私协议》</text>
	   </checkbox-group>
	   </view>
      <view class="login_btn" @click="onlogin">登录</view>
	  <view class="register">
		  <text class="link " @click="navigateToRegister">没有账户，去注册</text>
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
import loginMixin from '@/common/login-mixin';

export default {
	mixins: [loginMixin]
	// onLoad is handled by the mixin (sets this.os)
	// All methods (onlogin, checkboxChange, navTo, etc.) come from the mixin
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
.codes view{
	height: 80upx;
	line-height: 80upx;
	width: 130upx;
	margin-bottom: 60upx;
	color: #FFFFFF;
	background-color: #0076FF;
	text-align: center;
	font-size: 24upx;
	border-radius: 10upx;
}
.login_btn{
  width: 100%;
  height: 90upx;
  margin: 0 auto;
  background-color: #0396ff;
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
	color: #0396ff
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
