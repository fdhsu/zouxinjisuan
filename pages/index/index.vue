<!-- 首页 -->
<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">首页</block>
		</cu-custom>
		<!-- banner图 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" circular="true" indicator-dots="true" autoplay="true" interval="3500"
						duration="600">
						<swiper-item class="swiper-list" v-for="(item, index) in bannerList" :key="index">
							<view class="swiper-item uni-bg-red" @click="handleClick(item)">
								<image class="swiper-img" :src="item.imageUrl" mode=""></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<!-- 导航栏 -->
		<view class="cu-list grid solids-bottom col-4 no-border">
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
	import request from '@/common/request.js';
	// 图表
	import uCharts from "@/components/u-charts/u-charts.js";
	// import addTip from '../../components/wxcomponents/struggler-uniapp-add-tip/struggler-uniapp-add-tip.vue';
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
				bannerList: [
					{
						imageUrl: '../../static/images/2.webp',
						link: 'https://appweb.yangqianguan.com/v2/activity/flexible?act=BYVddKHQ'
					},
					{
						imageUrl: '../../static/images/1.webp',
						link: 'https://www.51hicard.com/landingPage/page?code=ry201003&page_name=dx-ry20ml&hfqorigin=hfq150170000216280000&agent=ruiyi&rp_hfq=1s'
					},
				],
				tools: [
					{
						cuIcon: 'coin',
						color: 'purple',
						count: 0,
						badge: 0,
						mid: '6',
						name: '房贷计算器'
					},
					{
						cuIcon: 'appreciatefill',
						color: 'purple',
						count: 0,
						badge: 0,
						mid: '8',
						name: '火星文转换'
					},
				],
				projectList: []
			};
		},
		watch: {},
		mounted() {
			//console.log(this.projectList);
			//this.getData();
			_self = this;
			//this.getServerData();
		},
		methods: {
			handleClick(item) {
				console.log(item.link)
			      uni.navigateTo({
			              url: `/pages/index/webview?url=${encodeURIComponent(item.link)}`
			      });
			},
			async getData() {
				console.log('数据加载');
				await this.$http
					.get('/weixin/v1/api/wx/tool/getHotSearchWordcloud', {})
					.then(async r => {
						console.log(r.data);
						this.cyData.series=[];
						r.data.forEach(item => {
							if(this.cyData.series.length<11){
							this.cyData.series.push({
								"name": item.keyword,
								"textSize": item.size/5000
							});
							}
						});
						console.log(this.cyData.series);
						_self.showData("canvasData", this.Data);
					})
					.catch(err => {

					});

			},
			scroll: function(e) {
				console.log(e);
				this.old.scrollTop = e.detail.scrollTop;
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
			},
		}
	};
</script>
<style lang="scss" scoped>
	.chartsMain {
		width: 750rpx;
		height: 450rpx;
		padding-top: 15rpx;
		background: #fff;
		margin-bottom: 24rpx;
		border-top: 2rpx solid #f2f2f2;

		.charts {
			width: 750rpx;
			height: 450rpx;
			box-sizing: border-box;
		}
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	/*scroll-view外层*/
	.skill-sequence-panel-content-wrapper {
		position: relative;
		white-space: nowrap;
		padding: 10rpx 0 10rpx 10rpx;
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

	.nav-li {
		padding: 40rpx 30rpx;
		width: 100%;
		background-image: url(https://s1.ax1x.com/2020/06/27/NyU04x.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
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
