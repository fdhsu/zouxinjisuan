<template>
	<view class="container">
		<view class="list-cell  m-t b-b">
			<text class="cell-tit">注销账号是不可恢复的操作，在您提交注销申请前，请先确认以下信息：<br>
			1.账号信息会被清空；<br>
			2.账号注销后无法找回；<br>
			账号注销后，即使您使用相同的手机号码再次注册，依旧无法找回之前的账号信息，会以新的用户身份进行登录。
			</text>
		</view>
		<view class="agreement">
		<checkbox-group @change="checkboxChange">
			<label>
				<checkbox value="readCb" :checked="isReadChk"/>我已阅读并同意以上注销须知
			</label>
		</checkbox-group>
		</view>
		<view class="logoff_btn" @click="toLogOff">注销账号</view>
	</view>
</template>

<script>
	import {  getUserInfo, removeToken,removeUserInfo} from '@/utils/auth';
	import { mapMutations} from 'vuex';
	export default {
		data() {
			return {
				isReadChk:false,
				userdata:{}
			};
		},
		onLoad(){
			//this.$app.recordVisitLog()
		},
		methods:{
			checkboxChange(e) {
				this.isReadChk = e.detail.value.length > 0
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
			clearUser(){
				removeToken()
				removeUserInfo();
				setTimeout(()=>{
					uni.navigateBack();
					uni.switchTab({
					      url: '/pages/index/me',
					      success: () => {
					        console.log('跳转成功');
					      },
					      fail: (err) => {
					        console.log('跳转失败', err);
					      }
					    });
				}, 200)
			},
			toLogOff(){
				if (!this.isReadChk) {
				    uni.showToast({
				        title: '请先勾选注销须知',
				        icon: 'none'
				    });
				    return;
				} 
				this.userdata = getUserInfo() || {};
				console.log(JSON.stringify(this.userdata))
				uni.showModal({
				    content: '确定要注销账号吗？',
				    success: (e)=>{
				    	if(e.confirm){
							if(this.userdata.nickname){
								
							uniCloud.callFunction({
							  name: 'applogoff',
							  data: {
							    mobile: this.userdata.nickname
							  }
							}).then(res => {
								uni.hideLoading()
							  console.log(res.result);
							  if (res.result.code === 200) {
							    this.clearUser();
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
							
				    		}else{
				    			this.clearUser();
				    		}
				    	}
				    }
				});
			}
		},
	}
</script>
<style scoped lang="scss">
	.agreement{
		padding:50rpx 10rpx 20rpx;
		text-align: center;
	}
	.logoff_btn{
	  width: 100%;
	  height: 90upx;
	  margin: 0 auto;
	  background-color: #ddd;
	  margin-top: 30px;
	  text-align: center;
	  line-height: 90upx;
	  border-radius: 40upx;
	  color: #333;
	  font-size: 30upx;
	}
</style>
<style lang='scss'>
	page{
	}
	
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx 30upx;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		align-items: center;
		
		&.cell-hover{
			background:#f8f8f8;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:32upx;
			color:#909399;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: 30upx;
			color: #303133;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: 28upx;
			color: #909399;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
