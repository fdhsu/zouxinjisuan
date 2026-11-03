<!-- 首页 - 首页 -->
<template>
	<view class="page-container">
		<!-- ========== 顶部品牌搜索栏 ========== -->
		<view class="header-section">
			<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="search-bar">
				<view class="search-input">
					<text class="search-icon">&#x1F50D;</text>
					<input
						class="search-field"
						v-model="searchText"
						placeholder="搜索你需要的工具"
						placeholder-style="color:#b0b4c0"
						confirm-type="search"
					/>
					<text v-if="searchText" class="clear-btn" @click.stop="searchText=''">&#x2715;</text>
				</view>
				<view class="notify-icon" @click="onNotify">
					<text class="notify-bell">&#x1F514;</text>
				</view>
			</view>
		</view>

		<!-- ========== 我的收藏 ========== -->
		<scroll-view v-if="favoriteTools.length>0" class="favorite-section" scroll-x :show-scrollbar="false">
			<view class="favorite-inner">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">我的收藏</text>
				</view>
				<view class="favorite-scroll-area">
					<view class="favorite-card" v-for="(item,idx) in favoriteTools" :key="'fav'+idx"
						@click="navigateTool(item)" @longpress.stop="toggleFavorite(item)">
						<view class="fav-icon-wrap" :style="{background:item.bgColor}">
							<text class="fav-emoji">{{item.icon}}</text>
						</view>
						<text class="fav-name">{{item.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- ========== 主内容区 ========== -->
		<scroll-view class="main-scroll" scroll-y :style="{height:scrollHeight+'px'}">
			<view class="category-block" v-for="(cat,ci) in filteredCategories" :key="'cat'+ci">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">{{cat.name}}</text>
				</view>
				<view class="tool-grid">
					<view class="tool-cell" v-for="(tool,ti) in cat.tools" :key="'t'+ti"
						@click="onToolTap(tool)" @longpress.stop="toggleFavorite(tool)"
						:hover-class="'tool-cell-hover'" :hover-stay-time="150">
						<view class="tool-icon-box" :style="{background:tool.bgColor}">
							<text class="tool-emoji">{{tool.icon}}</text>
						</view>
						<text class="tool-label">{{tool.name}}</text>
						<text v-if="isFavorited(tool)" class="fav-star">&#9733;</text>
					</view>
				</view>
			</view>

			<view v-if="searchText&&filteredCategories.length===0" class="empty-search">
				<text class="empty-icon">&#x1F50D;</text>
				<text class="empty-text">没有找到「{{searchText}}」相关工具</text>
			</view>

			<!-- Banner 广告位 -->
			<view class="ad-wrapper" v-if="adList.length>0">
				<view class="ad-container" :style="{height:swiperHeight+'px'}">
					<swiper class="ad-swiper" circular autoplay :interval="3000" :duration="500">
						<swiper-item v-for="(item,index) in adList" :key="index"
							@click="navTo(item.url,'/pages/login/privacy?url='+item.url)">
							<image :src="item.icon" mode="aspectFill" class="ad-image" @load="onImageLoad"/>
						</swiper-item>
					</swiper>
				</view>
			</view>

			<!-- 底部信息 -->
			<view class="footer-section">
				<view class="footer-row">
					<text class="footer-version">走心计算 v2.0.0</text>
					<view class="footer-divider"></view>
					<view class="offline-badge">
						<text class="offline-dot">&#x2714;</text>
						<text class="offline-text">离线可用</text>
					</view>
				</view>
				<view class="feedback-link" @click="goFeedback" hover-class="feedback-hover">
					<text class="feedback-text">&#x1F4E9; 意见反馈</text>
				</view>
			</view>
			<view style="height:40rpx;"></view>
		</scroll-view>

		<!-- ========== 新手引导 ========== -->
		<view v-if="showGuide" class="guide-overlay" @click="nextGuideStep">
			<view class="guide-flex-wrap">
				<view class="guide-spacer" :style="{height:guideSpacerH+'px'}"></view>
				<view class="guide-highlight-dot" :style="{top:guideDotTop+'px',left:guideDotLeft}"></view>
				<view class="guide-card" @click.stop>
					<view class="guide-step-tag">
						<text class="guide-step-num">{{guideStep+1}}/{{guideSteps.length}}</text>
					</view>
					<text class="guide-tip">{{guideSteps[guideStep].text}}</text>
					<view class="guide-action-row">
						<text class="guide-skip" @click.stop="skipGuide">跳过</text>
						<view class="guide-btn" hover-class="guide-btn-hover" @click.stop="nextGuideStep">
							<text class="guide-btn-text">{{guideStep===guideSteps.length-1?'开始使用':'下一步'}}</text>
						</view>
					</view>
				</view>
				<view class="guide-bottom-fill"></view>
			</view>
		</view>
	</view>
</template>

<script>
import { getBannerAdvertising } from '@/api/home.js';

export default {
	data() {
		return {
			statusBarHeight: 0,
			scrollHeight: 600,
			searchText: '',
			swiperHeight: 100,
			adList: [],
			isOnline: true,
			favoriteTools: [],
			showGuide: false,
			guideStep: 0,
			guideSteps: [
				{ text: '搜索你需要的工具', target: 'search' },
				{ text: '丰富的计算工具，分类清晰', target: 'tools' },
				{ text: '管理收藏和设置', target: 'me' }
			],
			systemHeight: 812,
			categories: [
				{
					name: '财务计算',
					tools: [
						{ id: 'mortgage', name: '房贷计算器', icon: '\uD83C\uDFE0', bgColor: '#EEF2FF', color: '#4F46E5', url: '../tools/house', placeholder: false },
						{ id: 'calculator', name: '简易计算器', icon: '\uD83E\uDDEE', bgColor: '#FFF7ED', color: '#EA580C', url: '../tools/electric', placeholder: false },
						{ id: 'tax', name: '税费计算器', icon: '\uD83D\uDCB0', bgColor: '#ECFDF5', color: '#059669', url: '', placeholder: true },
						{ id: 'deposit', name: '存款利息计算', icon: '\uD83C\uDFE6', bgColor: '#FEF2F2', color: '#DC2626', url: '', placeholder: true }
					]
				},
				{
					name: '育儿助手',
					tools: [
						{ id: 'baby_subsidy', name: '育儿补贴计算', icon: '\uD83D\uDC76', bgColor: '#FDF2F8', color: '#DB2777', url: '../baby/index', placeholder: false },
						{ id: 'pregnancy', name: '孕期计算器', icon: '\uD83E\uDD30', bgColor: '#F5F3FF', color: '#7C3AED', url: '', placeholder: true },
						{ id: 'vaccine', name: '疫苗接种提醒', icon: '\uD83D\uDC89', bgColor: '#ECFEFF', color: '#0891B2', url: '', placeholder: true }
					]
				},
				{
					name: '文字工具',
					tools: [
						{ id: 'font_convert', name: '繁简转换', icon: '\uD83D\uDD24', bgColor: '#EEF2FF', color: '#4338CA', url: '../tools/font', placeholder: false },
						{ id: 'word_count', name: '字数统计', icon: '\uD83D\uDCDD', bgColor: '#FFFBEB', color: '#D97706', url: '', placeholder: true },
						{ id: 'pinyin', name: '拼音转换', icon: '\uD83D\uDD21', bgColor: '#F0FDFA', color: '#0D9488', url: '', placeholder: true }
					]
				},
				{
					name: '生活工具',
					tools: [
						{ id: 'date_calc', name: '日期计算器', icon: '\uD83D\uDCC5', bgColor: '#FFF1F2', color: '#E11D48', url: '', placeholder: true },
						{ id: 'unit_convert', name: '单位换算', icon: '\uD83D\uDCF1', bgColor: '#F7FEE7', color: '#65A30D', url: '', placeholder: true },
						{ id: 'bmi', name: 'BMI计算', icon: '\u2696\uFE0F', bgColor: '#FAF5FF', color: '#9333EA', url: '', placeholder: true },
						{ id: 'color_convert', name: '颜色转换器', icon: '\uD83C\uDFA8', bgColor: '#EFF6FF', color: '#2563EB', url: '', placeholder: true }
					]
				}
			]
		};
	},
	computed: {
		filteredCategories() {
			if (!this.searchText.trim()) return this.categories;
			var kw = this.searchText.trim().toLowerCase();
			var res = [];
			for (var i = 0; i < this.categories.length; i++) {
				var cat = this.categories[i];
				var matched = cat.tools.filter(function(t) {
					return t.name.toLowerCase().indexOf(kw) !== -1;
				});
				if (matched.length > 0) {
					res.push({ name: cat.name, tools: matched });
				}
			}
			return res;
		},
		guideSpacerH() {
			var pos = this.guidePositions();
			if (this.guideStep >= pos.length) return 200;
			return Math.max(pos[this.guideStep].top - 10, 20);
		},
		guideDotTop() {
			var pos = this.guidePositions();
			if (this.guideStep >= pos.length) return 200;
			return pos[this.guideStep].top;
		},
		guideDotLeft() {
			var pos = this.guidePositions();
			if (this.guideStep >= pos.length) return '48%';
			return pos[this.guideStep].left;
		}
	},
	mounted() {
		this.initSystemInfo();
		this.loadFavorites();
		this.initNetworkListener();
		this.getBanner();
		this.$nextTick(function() {
			this.checkGuide();
		});
	},
	methods: {
		initSystemInfo() {
			var sys = uni.getSystemInfoSync();
			this.statusBarHeight = sys.statusBarHeight || 20;
			this.systemHeight = sys.windowHeight || 812;
			var headerH = this.statusBarHeight + 56;
			var self = this;
			this.$nextTick(function() {
				uni.createSelectorQuery().in(self).select('.favorite-section').boundingClientRect(function(rect) {
					if (rect) {
						self.scrollHeight = self.systemHeight - headerH - rect.height;
					} else {
						self.scrollHeight = self.systemHeight - headerH;
					}
				}).exec();
			});
		},
		guidePositions() {
			var hw = this.systemHeight > 700 ? 375 : 320;
			var tabH = 55;
			return [
				{ top: this.statusBarHeight + 14, left: '48%' },
				{ top: hw * 0.42, left: '48%' },
				{ top: this.systemHeight - tabH - 30, left: '83%' }
			];
		},
		checkGuide() {
			var guided = uni.getStorageSync('hasGuided');
			if (!guided) {
				this.showGuide = true;
				this.guideStep = 0;
			}
		},
		nextGuideStep() {
			if (this.guideStep < this.guideSteps.length - 1) {
				this.guideStep++;
			} else {
				this.showGuide = false;
				uni.setStorageSync('hasGuided', true);
			}
		},
		skipGuide() {
			this.showGuide = false;
			uni.setStorageSync('hasGuided', true);
		},
		loadFavorites() {
			var data = uni.getStorageSync('favoriteTools');
			if (data) {
				try { this.favoriteTools = JSON.parse(data); } catch(e) { this.favoriteTools = []; }
			}
		},
		saveFavorites() {
			uni.setStorageSync('favoriteTools', JSON.stringify(this.favoriteTools));
		},
		isFavorited(tool) {
			return this.favoriteTools.some(function(f) { return f.id === tool.id; });
		},
		toggleFavorite(tool) {
			var idx = -1;
			for (var i = 0; i < this.favoriteTools.length; i++) {
				if (this.favoriteTools[i].id === tool.id) { idx = i; break; }
			}
			if (idx >= 0) {
				this.favoriteTools.splice(idx, 1);
				uni.showToast({ title: '已取消收藏', icon: 'none' });
			} else {
				this.favoriteTools.push({
					id: tool.id, name: tool.name, icon: tool.icon,
					bgColor: tool.bgColor, color: tool.color,
					url: tool.url, placeholder: tool.placeholder
				});
				uni.showToast({ title: '已收藏', icon: 'none' });
			}
			this.saveFavorites();
		},
		onToolTap(tool) {
			if (tool.placeholder) {
				uni.showToast({ title: '即将上线', icon: 'none' });
				return;
			}
			this.navigateTool(tool);
		},
		navigateTool(tool) {
			if (tool.url) {
				uni.navigateTo({ url: tool.url });
			}
		},
		onNotify() {
			uni.showToast({ title: '暂无新消息', icon: 'none' });
		},
		goFeedback() {
			uni.navigateTo({ url: '../me/feedback' });
		},
		initNetworkListener() {
			var self = this;
			uni.getNetworkType({
				success: function(res) { self.isOnline = res.networkType !== 'none'; }
			});
			uni.onNetworkStatusChange(function(res) {
				self.isOnline = res.isConnected;
				if (res.isConnected) self.getBanner();
			});
		},
		getBanner() {
			var self = this;
			getBannerAdvertising().then(function(res) {
				if (res.code == '0000') {
					self.adList = (res.data || {}).banner_list || [];
				}
			});
		},
		onImageLoad(event) {
			var d = event.detail;
			var sys = uni.getSystemInfoSync();
			var h = (d.height / d.width) * sys.windowWidth;
			this.swiperHeight = Math.min(h, 120);
		},
		navTo(url, to) {
			if (url) uni.navigateTo({ url: to });
		}
	}
};
</script>

<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
	background-color: #f5f6fa;
	position: relative;
}

/* ===== 顶部搜索栏 ===== */
.header-section {
	background: linear-gradient(145deg, #4a6cf7 0%, #6366f1 50%, #8b5cf6 100%);
	padding-bottom: 20rpx;
}
.status-bar { width: 100%; }
.search-bar {
	display: flex;
	align-items: center;
	padding: 0 28rpx 0 32rpx;
	height: 80rpx;
}
.search-input {
	flex: 1;
	display: flex;
	align-items: center;
	background: rgba(255,255,255,0.92);
	border-radius: 40rpx;
	padding: 0 28rpx;
	height: 64rpx;
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; opacity: 0.5; }
.search-field {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	height: 64rpx;
}
.clear-btn {
	font-size: 24rpx;
	color: #999;
	padding: 8rpx;
	margin-left: 8rpx;
}
.notify-icon {
	margin-left: 24rpx;
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(255,255,255,0.15);
}
.notify-bell { font-size: 30rpx; }

/* ===== 我的收藏 ===== */
.favorite-section {
	width: 100%;
	height: 180rpx;
	background: #fff;
	white-space: nowrap;
	border-bottom: 1rpx solid #f0f0f5;
}
.favorite-inner {
	display: inline-block;
	padding: 16rpx 0 16rpx 32rpx;
	height: 100%;
}
.favorite-scroll-area {
	display: inline-flex;
	align-items: center;
	gap: 20rpx;
	padding-right: 32rpx;
	height: 120rpx;
}
.favorite-card {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	min-width: 130rpx;
	padding: 12rpx 16rpx;
	background: #f8f9fe;
	border-radius: 16rpx;
	flex-shrink: 0;
}
.fav-icon-wrap {
	width: 64rpx;
	height: 64rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8rpx;
}
.fav-emoji { font-size: 32rpx; }
.fav-name { font-size: 22rpx; color: #555; white-space: nowrap; }

/* ===== 分类标题 ===== */
.section-title {
	display: flex;
	align-items: center;
	padding: 28rpx 32rpx 16rpx;
}
.title-bar {
	width: 6rpx;
	height: 30rpx;
	background: linear-gradient(180deg, #4a6cf7, #8b5cf6);
	border-radius: 3rpx;
	margin-right: 14rpx;
}
.title-text {
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1a2e;
}

/* ===== 工具网格 ===== */
.category-block { padding-bottom: 8rpx; }
.tool-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 0 20rpx;
}
.tool-cell {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 0;
	position: relative;
	border-radius: 16rpx;
}
.tool-cell-hover {
	background: rgba(0,0,0,0.03);
	opacity: 0.85;
}
.tool-icon-box {
	width: 88rpx;
	height: 88rpx;
	border-radius: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12rpx;
}
.tool-emoji { font-size: 40rpx; }
.tool-label {
	font-size: 24rpx;
	color: #444;
	text-align: center;
	max-width: 140rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.fav-star {
	position: absolute;
	top: 10rpx;
	right: 24rpx;
	font-size: 20rpx;
	color: #f59e0b;
}

/* ===== 空搜索 ===== */
.empty-search {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}
.empty-icon { font-size: 64rpx; opacity: 0.3; }
.empty-text { font-size: 28rpx; color: #999; margin-top: 20rpx; }

/* ===== 广告 ===== */
.ad-wrapper {
	padding: 24rpx 32rpx;
}
.ad-container {
	overflow: hidden;
	border-radius: 16rpx;
}
.ad-swiper { width: 100%; height: 100%; }
.ad-image { width: 100%; height: 100%; }

/* ===== 底部信息 ===== */
.footer-section {
	padding: 40rpx 32rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.footer-row {
	display: flex;
	align-items: center;
	justify-content: center;
}
.footer-version { font-size: 24rpx; color: #aaa; }
.footer-divider {
	width: 2rpx;
	height: 20rpx;
	background: #ddd;
	margin: 0 20rpx;
}
.offline-badge {
	display: flex;
	align-items: center;
}
.offline-dot {
	font-size: 22rpx;
	color: #22c55e;
	margin-right: 6rpx;
}
.offline-text { font-size: 24rpx; color: #aaa; }
.feedback-link {
	margin-top: 20rpx;
	padding: 12rpx 32rpx;
	background: #fff;
	border-radius: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.feedback-hover { opacity: 0.7; }
.feedback-text { font-size: 26rpx; color: #555; }

/* ===== 新手引导 ===== */
.guide-overlay {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0,0,0,0.72);
	z-index: 9999;
}
.guide-flex-wrap {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
}
.guide-spacer { flex-shrink: 0; }
.guide-highlight-dot {
	position: absolute;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255,255,255,0.9);
	background: rgba(74,108,247,0.3);
	box-shadow: 0 0 20rpx 6rpx rgba(74,108,247,0.4);
	transform: translate(-50%, -50%);
	z-index: 10;
	animation: guidePulse 1.5s ease-in-out infinite;
}
@keyframes guidePulse {
	0%, 100% { box-shadow: 0 0 20rpx 6rpx rgba(74,108,247,0.4); }
	50% { box-shadow: 0 0 36rpx 12rpx rgba(74,108,247,0.6); }
}
.guide-card {
	margin: 24rpx 48rpx 0;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx 36rpx;
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.15);
	z-index: 11;
}
.guide-step-tag {
	display: inline-flex;
	background: linear-gradient(135deg, #4a6cf7, #8b5cf6);
	border-radius: 20rpx;
	padding: 4rpx 18rpx;
	margin-bottom: 20rpx;
}
.guide-step-num {
	font-size: 22rpx;
	color: #fff;
	font-weight: 600;
}
.guide-tip {
	font-size: 30rpx;
	color: #1a1a2e;
	line-height: 1.6;
	margin-bottom: 28rpx;
	display: block;
}
.guide-action-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.guide-skip {
	font-size: 26rpx;
	color: #999;
}
.guide-btn {
	background: linear-gradient(135deg, #4a6cf7, #8b5cf6);
	border-radius: 32rpx;
	padding: 12rpx 40rpx;
}
.guide-btn-hover { opacity: 0.85; }
.guide-btn-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 600;
}
.guide-bottom-fill { flex: 1; }
</style>
