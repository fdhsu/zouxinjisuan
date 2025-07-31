<template>
	<view class="container">		 
		<view class="list-cell b-b" @click="navTo('/pages/me/gywm')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于我们</text>
			<image mode="aspectFit" style="width: 30upx; height: 30upx;" src="/static/me/fh.png">
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/me/logoff')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">注销账号</text>
			<image mode="aspectFit" style="width: 30upx; height: 30upx;" src="/static/me/fh.png">
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="list-cell b-b" @click="clearStorage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-tip">{{currentSize}}</text>
		</view>
		<!-- #endif -->
		
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import { removeToken,removeUserInfo } from '@/utils/auth';
	import {   mapMutations  } from 'vuex';
	export default {
		data() {
			return {
				version:'',
				currentSize:'0KB'
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			// 获取本地应用资源版本号
			plus.runtime.getProperty(plus.runtime.appid, (info) => {
				//console.log(JSON.stringify(info));
				 this.version = info.version;
				 //this.appVersionCode = info.versionCode;
			})
			this.getStorageSize()
			// #endif
			//this.$app.recordVisitLog()
		},
		methods:{
			...mapMutations(['logout']),

			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
							removeToken()
							removeUserInfo();
				    		setTimeout(()=>{
				    			uni.navigateBack();
								// uni.switchTab({
								//       url: '/pages/index/tabbar',
								//       success: () => {
								//         console.log('跳转成功');
								//       },
								//       fail: (err) => {
								//         console.log('跳转失败', err);
								//       }
								//     });
				    		}, 200)
				    	}
				    }
				});
			},
			clearStorage() {
				 let that = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					console.log(files, len)
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录
									that.files = []
									uni.showToast({
										title: '清除成功',
										duration: 2000,
										icon:'none'
									});
									that.getStorageSize(); // 重新计算缓存
								}, function(e) {
									console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}
				} else { // ios
					plus.cache.clear(function() {
						uni.showToast({
							title: '清除成功',
							duration: 2000
						});
						that.getStorageSize();
					});
				}
			},
			getStorageSize() {
				let that = this;
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						that.currentSize = "0B";
					} else if (sizeCache < 1024) {
						that.currentSize = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						that.currentSize = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						that.currentSize = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						that.currentSize = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
				});
			}
		}
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
		.cell-tip{
			font-size:28upx;
			color: #909399;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
