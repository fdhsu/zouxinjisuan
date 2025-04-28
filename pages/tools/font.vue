<template>
	<view class="tools">
		<u-input v-model="value" type="textarea" :border="true" height="200" :auto-height="true" />
		<view class="btns">
			<view class="btn2" @tap="traditionalToSimplified()">繁体转换为简体</view>
			<view class="btn" @tap="simplifiedToTraditional()">简体转换为繁体</view>
			<!-- <view class="btn" @tap="tansfer(3)">转换为火星文</view> -->
		</view>
		<u-input v-model="result" placeholder="匹配结果" type="textarea" :border="true" height="200" :auto-height="true" />
		<button class="clear" @tap="clear()">清空</button>
	</view>
</template>

<script>
import * as opencc from 'opencc-js';
	var app = getApp();
	export default {
		data() {
			return {
				colors: '',
				value: '',
				result: ''
			};
		},
		components: {
		},
		props: {},

		
		onLoad: function(options) {
			// this.setData({
				this.colors=app.globalData.newColor
			// });
		},
		methods: {
			// tansfer(index){
			// 	if(index == 1){
			// 		this.simplifiedToTraditional()
			// 	} else if(index == 2){
			// 		this.traditionalToSimplified()
			// 	}
			// },
			clear(){
				this.value = '';
				this.result = '';
			},
			simplifiedToTraditional() {
			    const converter = opencc.Converter({ from: 'cn', to: 'twp' });
			     this.result = converter(this.value);
			},
			traditionalToSimplified() {
			    const converter = opencc.Converter({ from: 'twp', to: 'cn' });
			    this.result = converter(this.value);
			}
		}
	};
</script>
<style lang="scss" scoped>
	page {
		background-color: #F5F5FA;
	}
	.tools .btns{
		display: flex;
	}
	.tools .btns .btn{
		flex: 1;
		text-align: center;
		color: #fff;
		background-color: #3280fc;
		border-color: #1970fc;
		padding: 28upx 0;
	}
	.tools .btns .btn2{
		flex: 1;
		text-align: center;
		color: #fff;
		background-color: #32c4fc;
		border-color: #32c4fc;
		padding: 28upx 0;
	}
	.clear{
		margin: 20px 0;
		background-color: #0076FF;
		color: #ffffff;
		font-size: 30upx;
	}
</style>
