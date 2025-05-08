<template>
	<view class="container">
		<view class="list-cell  m-t b-b" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/agreement.html')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">用户协议</text>
			<image mode="aspectFit" style="width: 30upx; height: 30upx; margin-left: 50upx;float: right;" src="/static/icon/fh.png">
		</view>
		<view class="list-cell m-t b-b" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/privacy.html')"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">隐私协议</text>
			<image mode="aspectFit" style="width: 30upx; height: 30upx; margin-left: 10upx;" src="/static/icon/fh.png">
		</view>

	</view>
</template>

<script>
	import { mapMutations} from 'vuex';
	export default {
		data() {
			return {
				urls:'',
			};
		},
		onLoad(){
			//this.$app.recordVisitLog()
		},
		methods:{
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
		},
	}
</script>

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
