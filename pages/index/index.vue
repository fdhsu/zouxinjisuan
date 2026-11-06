<!-- 首页 -->
<template>
	<view class="page-container">
		<!-- ========== Banner 顶部 ========== -->
		<view class="banner-section" v-if="adList.length>0">
			<swiper class="banner-swiper" circular autoplay :interval="3000" :duration="500" :style="{height:bannerHeight+'px'}">
				<swiper-item v-for="(item,index) in adList" :key="index"
					@click="navTo(item.url,'/pages/login/privacy?url='+item.url)">
					<image :src="item.icon" mode="aspectFill" class="banner-image" @load="onBannerLoad"/>
				</swiper-item>
			</swiper>
		</view>

		<!-- ========== 主内容区 ========== -->
		<view class="main-content">

			<!-- 我的收藏 -->
			<view class="section-card" v-if="favoriteTools.length>0">
				<view class="card-header">
					<text class="card-title">我的收藏</text>
				</view>
				<view class="tool-grid">
					<view class="tool-cell" v-for="(item,idx) in favoriteTools" :key="'fav'+idx"
						@click="navigateTool(item)" @longpress.stop="toggleFavorite(item)"
						:hover-class="'tool-cell-hover'" :hover-stay-time="150">
						<view class="tool-icon-box" :style="{background:item.bgColor}">
							<image :src="item.icon" class="tool-icon-img" mode="aspectFit"/>
						</view>
						<text class="tool-label">{{item.name}}</text>
					</view>
				</view>
			</view>

			<!-- 分类工具卡片 -->
			<view class="section-card" v-for="(cat,ci) in categories" :key="'cat'+ci">
				<view class="card-header">
					<text class="card-title">{{cat.name}}</text>
				</view>
				<view class="tool-grid">
					<view class="tool-cell" v-for="(tool,ti) in cat.tools" :key="'t'+ti"
						@click="onToolTap(tool)" @longpress.stop="toggleFavorite(tool)"
						:hover-class="'tool-cell-hover'" :hover-stay-time="150">
						<view class="tool-icon-box" :style="{background:tool.bgColor}">
							<image :src="tool.icon" class="tool-icon-img" mode="aspectFit"/>
						</view>
						<text class="tool-label">{{tool.name}}</text>
						<text v-if="isFavorited(tool)" class="fav-star">&#9733;</text>
					</view>
				</view>
			</view>

			<!-- 底部信息 -->
			<view class="footer-section">
				<view class="footer-row">
					<text class="footer-version">走心计算 v2.1.0</text>
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
		</view>

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
			bannerHeight: 0,
			adList: [],
			isOnline: true,
			favoriteTools: [],
			showGuide: false,
			guideStep: 0,
			guideSteps: [
				{ text: '丰富的计算工具，分类清晰', target: 'tools' },
				{ text: '长按可收藏常用工具', target: 'favorite' },
				{ text: '管理收藏和设置', target: 'me' }
			],
			systemHeight: 812,
			categories: [
				{
					name: '财务计算',
					tools: [
						{ id: 'mortgage', name: '房贷计算器', icon: '/static/icons/mortgage.png', bgColor: '#2B7DE9', color: '#2B7DE9', url: '../tools/house', placeholder: false },
						{ id: 'calculator', name: '科学计算器', icon: '/static/icons/calculator.png', bgColor: '#F5A623', color: '#F5A623', url: '../tools/electric', placeholder: false },
						{ id: 'tax', name: '税费计算器', icon: '/static/icons/tax.png', bgColor: '#27AE60', color: '#27AE60', url: '../tools/tax', placeholder: false },
						{ id: 'deposit', name: '存款利息计算', icon: '/static/icons/deposit.png', bgColor: '#E74C3C', color: '#E74C3C', url: '../tools/deposit', placeholder: false }
					]
				},
				{
					name: '育儿助手',
					tools: [
						{ id: 'baby_subsidy', name: '育儿补贴计算', icon: '/static/icons/baby_subsidy.png', bgColor: '#E74C3C', color: '#E74C3C', url: '../baby/index', placeholder: false },
						{ id: 'pregnancy', name: '孕期计算器', icon: '/static/icons/pregnancy.png', bgColor: '#9B59B6', color: '#9B59B6', url: '../tools/pregnancy', placeholder: false },
						{ id: 'vaccine', name: '疫苗接种提醒', icon: '/static/icons/vaccine.png', bgColor: '#1ABC9C', color: '#1ABC9C', url: '../tools/vaccine', placeholder: false }
					]
				},
				{
					name: '文字工具',
					tools: [
						{ id: 'font_convert', name: '繁简转换', icon: '/static/icons/font_convert.png', bgColor: '#2B7DE9', color: '#2B7DE9', url: '../tools/font', placeholder: false },
						{ id: 'word_count', name: '字数统计', icon: '/static/icons/word_count.png', bgColor: '#F5A623', color: '#F5A623', url: '', placeholder: true },
						{ id: 'pinyin', name: '拼音转换', icon: '/static/icons/pinyin.png', bgColor: '#1ABC9C', color: '#1ABC9C', url: '', placeholder: true }
					]
				},
				{
					name: '生活工具',
					tools: [
						{ id: 'date_calc', name: '日期计算器', icon: '/static/icons/date_calc.png', bgColor: '#E74C3C', color: '#E74C3C', url: '../tools/date', placeholder: false },
						{ id: 'unit_convert', name: '单位换算', icon: '/static/icons/unit_convert.png', bgColor: '#27AE60', color: '#27AE60', url: '../tools/unit', placeholder: false },
						{ id: 'bmi', name: 'BMI计算', icon: '/static/icons/bmi.png', bgColor: '#9B59B6', color: '#9B59B6', url: '../tools/bmi', placeholder: false },
						{ id: 'color_convert', name: '颜色转换器', icon: '/static/icons/color_convert.png', bgColor: '#2B7DE9', color: '#2B7DE9', url: '', placeholder: true }
					]
				}
			]
		};
	},
	computed: {
		guideSpacerH() {
			// 三张卡片作为一组，居中显示在屏幕中央
			var cardH = 150, gap = 0;
			var totalH = 3 * cardH + 2 * gap;
			var startY = Math.round((this.systemHeight - totalH) / 2);
			return startY + this.guideStep * (cardH + gap);
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
		this.loadFavorites();
		this.initNetworkListener();
		this.getBanner();
		this.$nextTick(function() {
			this.checkGuide();
		});
	},
	methods: {
		guidePositions() {
			var hw = this.systemHeight > 700 ? 375 : 320;
			var tabH = 55;
			return [
				{ top: hw * 0.35, left: '48%' },
				{ top: hw * 0.55, left: '30%' },
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
			// 兼容旧版emoji图标，迁移为图片路径
			var emojiMap = {
				'\uD83C\uDFE0': '/static/icons/mortgage.png',
				'\uD83E\uDDEE': '/static/icons/calculator.png',
				'\uD83D\uDCB0': '/static/icons/tax.png',
				'\uD83C\uDFE6': '/static/icons/deposit.png',
				'\uD83D\uDC76': '/static/icons/baby_subsidy.png',
				'\uD83E\uDD30': '/static/icons/pregnancy.png',
				'\uD83D\uDC89': '/static/icons/vaccine.png',
				'\uD83D\uDD04': '/static/icons/font_convert.png',
				'\uD83D\uDCCA': '/static/icons/word_count.png',
				'\uD83D\uDCAC': '/static/icons/pinyin.png',
				'\uD83D\uDCC5': '/static/icons/date_calc.png',
				'\uD83D\uDCCF': '/static/icons/unit_convert.png',
				'\u2696\uFE0F': '/static/icons/bmi.png',
				'\uD83C\uDFA8': '/static/icons/color_convert.png'
			};
			var changed = false;
			for (var i = 0; i < this.favoriteTools.length; i++) {
				var old = this.favoriteTools[i].icon;
				if (emojiMap[old]) { this.favoriteTools[i].icon = emojiMap[old]; changed = true; }
			}
			if (changed) this.saveFavorites();
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
		onBannerLoad(event) {
			var d = event.detail;
			var sys = uni.getSystemInfoSync();
			var h = (d.height / d.width) * sys.windowWidth;
			this.bannerHeight = Math.min(h, 200);
		},
		navTo(url, to) {
			if (url) uni.navigateTo({ url: to });
		}
	}
};
</script>

<style lang="scss" scoped>
$primary: #2B7DE9;
$bg: #F2F5FA;
$card-bg: #fff;
$text: #1a1a2e;
$text-sec: #555;
$text-light: #999;
$radius: 24rpx;

.page-container {
	min-height: 100vh;
	background-color: $bg;
	position: relative;
	padding-bottom: 20rpx;
}

/* ===== 顶部 Banner ===== */
.banner-section {
	width: 100%;
	overflow: hidden;
	border-radius: 0 0 24rpx 24rpx;
}
.banner-swiper { width: 100%; }
.banner-image { width: 100%; height: 100%; }

/* ===== 分类卡片 ===== */
.section-card {
	background: $card-bg;
	border-radius: $radius;
	margin: 24rpx 24rpx 0;
	padding: 28rpx 20rpx 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.card-header {
	padding: 0 12rpx 20rpx;
}
.card-title {
	font-size: 32rpx;
	font-weight: 700;
	color: $text;
}

/* ===== 工具网格 ===== */
.tool-grid {
	display: flex;
	flex-wrap: wrap;
}
.tool-cell {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 0;
	position: relative;
}
.tool-cell-hover {
	opacity: 0.85;
}
.tool-icon-box {
	width: 96rpx;
	height: 96rpx;
	border-radius: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.tool-icon-img { width: 52rpx; height: 52rpx; }
.tool-label {
	font-size: 24rpx;
	color: $text-sec;
	text-align: center;
	max-width: 150rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.fav-star {
	position: absolute;
	top: 8rpx;
	right: 20rpx;
	font-size: 20rpx;
	color: #f59e0b;
}

/* ===== 底部信息 ===== */
.footer-section {
	padding: 40rpx 32rpx 120rpx;
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
	background: rgba(43,125,233,0.3);
	box-shadow: 0 0 20rpx 6rpx rgba(43,125,233,0.4);
	transform: translate(-50%, -50%);
	z-index: 10;
	animation: guidePulse 1.5s ease-in-out infinite;
}
@keyframes guidePulse {
	0%, 100% { box-shadow: 0 0 20rpx 6rpx rgba(43,125,233,0.4); }
	50% { box-shadow: 0 0 36rpx 12rpx rgba(43,125,233,0.6); }
}
.guide-card {
	margin: 0 48rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx 36rpx;
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.15);
	z-index: 11;
}
.guide-step-tag {
	display: inline-flex;
	background: linear-gradient(135deg, #2B7DE9, #5BA3F5);
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
	background: linear-gradient(135deg, #2B7DE9, #5BA3F5);
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
