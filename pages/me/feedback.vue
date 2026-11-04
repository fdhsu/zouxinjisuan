<template>
	<view class="container">		 
		<view class="list-cell m-t b-b">
			<text class="cell-tit">问题类型：</text>
			<text v-for="(item, index) in type" :key="index" :class="feedtype==item?'cell-rad cell-rad-on':'cell-rad'" @click="handleType(item)">{{item}}</text>
		</view>
		<view class="feedback m-t">
			 <textarea 
				class="textarea"
				  maxlength="300"
			       v-model="feedinfo" 
			       placeholder="请输入内容" 
			       @input="onInput"
			     />
			<view class="count">已输入: {{ feedinfo.length }}/300</view>
		</view>
		
		<view class="logoff_btn" @click="toFeedback">提交反馈</view>
	</view>
</template>
<script>
	import { getUserInfo,removeUserInfo } from '@/utils/auth';
	export default {
		data() {
			return {
				type:['功能类','账号类'],
				feedtype:'功能类',
				feedinfo:'',
				userdata:{}
			}
		},
		onLoad() {
			this.userdata = getUserInfo() || {};
		},
		methods:{
			onInput(e) {
			    if(this.feedinfo.length > 300) {
					this.feedinfo = this.feedinfo.substring(0, 300)
			    }
			},
			handleType(val){
				this.feedtype = val
			},
			//反馈
			toFeedback(){
				if(this.userdata.nickname){
					uniCloud.callFunction({
					  name: 'feedback',
					  data: {
					    mobile: this.userdata.nickname,
						feedtype: this.feedtype,
						feedinfo: this.feedinfo
					  }
					}).then(res => {
					  console.log(res.result);
					  if (res.result.code === 200) {
						  uni.showToast({
						  	title: "提交成功，感谢您的反馈",
						  	icon: 'none'
						  })
						uni.navigateTo({
							url:"/pages/me/set"
						})
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
					uni.showModal({
					    content: '请先登录',
					    success: (e)=>{
					    	if(e.confirm){
								uni.navigateTo({
									url:'../login/login'
								})
					    	}
					    }
					});
				}
			}			
		}
	}
</script>

<style scoped lang='scss'>
	.logoff_btn{
	  width: 100%;
	  height: 90upx;
	  margin: 0 auto;
	  background-color:  rgba(70, 143, 152, 0.8);
	  margin-top: 30px;
	  text-align: center;
	  line-height: 90upx;
	  border-radius: 40upx;
	  color: #fff;
	  font-size: 30upx;
	}
	.feedback{
		background: #fff;
		padding: 20upx 30upx;
		.count{
			font-size: 24upx;
			color:#AAA;
			text-align: right;
		}
		.textarea{
			font-size: 30upx;
			height: 200px;
			width: 94%;
		}
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx 30upx;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: #fb603d;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
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
		.cell-rad{
			border: 1px solid #ececec;
			border-radius: 50upx;
			padding: 2upx 20upx;
			font-size: 26upx;
			margin-right: 10upx;
		}
		.cell-rad-on{
			background:rgba(70, 143, 152, 0.8);
			color:#fff;
			border: 1px solid rgba(70, 143, 152, 0.8);
		}
		.cell-tip{
			font-size:28upx;
			color: #909399;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
