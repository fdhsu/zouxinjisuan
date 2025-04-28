<!-- 关于作者 -->
<template>
  <view class="about">

    <canvas canvas-id="bubble" :style="'width:' + width + 'px;height:' + height + 'px'" class="like-fx"></canvas>
    <like-fx ref="likeFx" :width="width" :height="height"></like-fx>
	
	<view class="titleZ text-center align-center">
		<text class="text-bold">关于我们</text>
		<view class="contentZ">
			<text class="text-xl">一个简单的小工具，希望可以方便大家！</text>
		</view>
	</view>
	
	<view class="titleZ text-center align-center margin-top-xl">
		<text class="text-bold">计算房贷？繁简文字转换？</text>
		<view class="contentZ margin-top-lg">
			<text class="text-xl text-bold">计算房贷</text>
			<text class="text-xl">：我们可以测算商贷，公积金贷款，还有组合贷，最重要的是可自定义输入贷款利率哦~</text>
		</view>
		<view class="contentZ" style="margin-top: 40rpx;">
			<text class="text-xl text-bold">繁简转换</text>
			<text class="text-xl">：简体中文转成繁体字，繁体字转成简体中文~</text>
		</view>
	</view>
	
  </view>
</template>

<script>
  import LikeFx from '@/components/likeFx/likeFx.vue'
  export default {
    components: {
      LikeFx
    },
    data() {
      return {
        animation_timer: null, // 动画定时器
        width: 375,
        height: 1920
      }
    },
    onLoad() {
      this._startLikeAnimation();
    },
    methods: {
      _startLikeAnimation() {
        this.animation_timer = setInterval(() => {
          this.$refs.likeFx.likeClick()
        }, 300)
      }
    }
  }
</script>

<style scoped>
	.titleZ{
		width: 750rpx;
		font-size: 52rpx;
		margin-top: 60rpx;
	}
	.contentZ{
		width: 650rpx;
		margin: 10rpx auto 0;
		text-align: left;
	}
  .about-bg {
    background-size: cover;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
    color: #fff;
  }

  .edit-fixed {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 1024;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
  }

  .detail-imgs image {
    width: 100%;
    float: left;
    /* height:400rpx; 不定高了*/
    border: 0;
    padding: 0;
    margin: 0
  }

  .share-img {
    position: fixed;
    padding: 10rpx;
    width: 100rpx;
    height: 100rpx;
    /* top: 680rpx; */
    bottom: 200rpx;
    right: 20rpx;
    z-index: 1024;
    opacity: 0.8;
    box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
    border: none;
  }

  .about {
    margin: 0;
    width: 100%;
    height: 100vh;
	padding-top: 20%;
    color: #fff;
    background: linear-gradient(-120deg, #F15BB5, #9A5CE5, #01BEFF, #00F5D4);
    /* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
    background-size: 500% 500%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .container {
    width: 100%;
    position: absolute;
    text-align: center;
  }

  .like-fx {
    position: fixed;
    right: 0;
    z-index: 1024;
    pointer-events: none;
    /* background-color: red; */
  }
</style>
