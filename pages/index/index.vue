<!-- 首页 -->
<template>
	<view>
		<!-- banner图 -->
		<view class="ad-container">
		  <swiper class="ad-swiper" circular autoplay interval="3000" duration="500">
		    <swiper-item v-for="(item, index) in adList" :key="index"  @click="navTo(item.url,'/pages/login/privacy?url='+item.url)">
		      <image :src="item.icon" mode="aspectFill" class="ad-image"/>
		    </swiper-item>
		  </swiper>
		</view>
		<!-- 导航栏 -->
		<view class="cu-list grid solids-bottom col-3 no-border">
			<view class="cu-item" v-for="(item, index) in tools" :key="index"
				:style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]" @click="goTool"
				:data-mid="item.mid">
				<view :class="['cuIcon-' + item.cuIcon, 'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.count != 0">
						<block v-if="item.badge != 1">{{ item.badge > 99 ? '99+' : item.badge }}</block>
					</view>
				</view>
				<text>{{ item.name }}</text>
			</view>
			</view>
		<view style="height: 140rpx;width: 1rpx;"></view>
	</view>
</template>

<script>
	import { getBannerAdvertising} from '@/api/home.js'
	var _self;
	var canvaWord = null;

	export default {
		components: {
			// addTip
		},
		data() {
			return {
				duration: 1,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				pixelRatio: 1,
				adList: [],
				tools: [
					{
						cuIcon: 'emoji',
						color: 'blue',
						count: 0,
						badge: 0,
						mid: '7',
						name: '育儿补贴计算'
					},
					{
						cuIcon: 'coin',
						color: 'blue',
						count: 0,
						badge: 0,
						mid: '6',
						name: '房贷计算器'
					},
					{
						cuIcon: 'appreciatefill',
						color: 'blue',
						count: 0,
						badge: 0,
						mid: '8',
						name: '繁简转换'
					}
				],
				projectList: []
			};
		},
		watch: {},
		mounted(){
			this.initNetworkListener();
			this.getBanner();
		},
		methods: {
			// 初始化网络监听
			initNetworkListener() {
			  uni.getNetworkType({
			    success: (res) => {
			      this.isOnline = res.networkType !== 'none';
			    }
			  });
			
			  uni.onNetworkStatusChange((res) => {
			    this.isOnline = res.isConnected;
			    if (res.isConnected) {
			      this.getBanner();
			    }
			  });
			},
			getBanner(){
				getBannerAdvertising().then(res => {
					//console.log(res)
					if(res.code=="0000"){
						this.adList = (res.data||{}).banner_list||[]
					}
				})
			},
			// 图片加载完成事件
			onImageLoad(event) {
			      const { width, height } = event.detail;
			      // 根据图片宽高比计算高度
			      const systemInfo = uni.getSystemInfoSync();
			      const windowWidth = systemInfo.windowWidth;
			      const imageHeight = (height / width) * windowWidth;
			      // 设置 swiper 高度
			      this.swiperHeight = imageHeight;
			 },
			scroll: function(e) {
				console.log(e);
				this.old.scrollTop = e.detail.scrollTop;
			},
			navTo(url,to){
				if(url){
					uni.navigateTo({
						url:to
					})
				}
			},
			goTool: function(e) {
				console.log(e.currentTarget.dataset.mid)
				if (e.currentTarget.dataset.mid == 6) {
					uni.navigateTo({
						url: '../tools/house'
					});
				}
				if (e.currentTarget.dataset.mid == 8) {
					uni.navigateTo({
						url: '../tools/font'
					});
				}
				if (e.currentTarget.dataset.mid == 7) {
					//console.log(7);
					uni.navigateTo({
						url: '../baby/index'
					});
				}
			},
		}
	};
</script>
<style lang="scss" scoped>
	.ad-container {
	  height: 300rpx;
	  overflow: hidden;
	}
	
	.ad-swiper {
	  width: 100%;
	  height: 100%;
	}
	
	.ad-image {
	  width: 100%;
	  height: 100%;
	}
	/*左右渐变遮罩*/
	.hide-content-box {
		position: absolute;
		top: 0;
		height: 100%;
		width: 10px;
		z-index: 2;
	}
	.hide-content-box-left {
		left: 0;
		background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #f3f3f3 60%);
	}
	.hide-content-box-right {
		right: 0;
		background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #f3f3f3 60%);
	}
	.kite-classify-scroll {
		width: 100%;
		height: 380rpx;
		overflow: hidden;
		white-space: nowrap;
	}
	.kite-classify-cell {
		display: inline-block;
		width: 266rpx;
		height: 370rpx;
		margin-right: 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 2px 2px 3px rgba(26, 26, 26, 0.2);
	}
	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}
	.nav-name::before {
		content: '';
		position: absolute;
		display: block;
		width: 40rpx;
		height: 6rpx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: '';
		position: absolute;
		display: block;
		width: 100rpx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40rpx;
		opacity: 0.3;
	}
	.nav-content {
		width: 100%;
		padding: 15rpx;
		display: inline-block;
		overflow-wrap: break-word;
		white-space: normal;
	}
	.nav-btn {
		width: 200rpx;
		height: 60rpx;
		margin: 8rpx auto;
		text-align: center;
		line-height: 60rpx;
		border-radius: 10rpx;
	}
	.bg-index1 {
		background-color: #19cf8a;
		color: #fff;
	}
	.bg-index2 {
		background-color: #954ff6;
		color: #fff;
	}
	.bg-index3 {
		background-color: #5177ee;
		color: #fff;
	}
	.bg-index4 {
		background-color: #f49a02;
		color: #fff;
	}
	.bg-index5 {
		background-color: #ff4f94;
		color: #fff;
	}
	.bg-index6 {
		background-color: #7fd02b;
		color: #fff;
	}
	.item-name {
		margin-bottom: 15rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
</style>
