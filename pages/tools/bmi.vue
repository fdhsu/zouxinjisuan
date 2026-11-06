<template>
	<view class="bmi-page">
		<!-- 输入卡片 -->
		<view class="card">
			<view class="card-title">身体数据</view>
			<view class="form-row">
				<text class="form-label">身高</text>
				<view class="input-wrap">
					<input class="form-input" type="digit" v-model="height" placeholder="请输入" />
					<text class="unit">cm</text>
				</view>
			</view>
			<view class="form-row">
				<text class="form-label">体重</text>
				<view class="input-wrap">
					<input class="form-input" type="digit" v-model="weight" placeholder="请输入" />
					<text class="unit">kg</text>
				</view>
			</view>
		</view>

		<!-- 计算按钮 -->
		<view class="btn-primary" @tap="calcBMI">
			<text class="btn-primary-text">计算</text>
		</view>

		<!-- 结果卡片 -->
		<view class="result-card" v-if="result.show" :style="{ background: result.gradient }">
			<view class="result-header">
				<text class="result-title">BMI 指数</text>
				<text class="result-tag" :style="{ color: result.color }">{{ result.category }}</text>
			</view>
			<view class="result-main">
				<text class="result-main-value">{{ result.value }}</text>
				<text class="result-main-label">kg/m²</text>
			</view>

			<!-- 可视化标尺 -->
			<view class="scale-wrap">
				<view class="scale-bar">
					<view class="scale-zone zone-thin"></view>
					<view class="scale-zone zone-normal"></view>
					<view class="scale-zone zone-overweight"></view>
					<view class="scale-zone zone-obese"></view>
					<view class="scale-marker" :style="{ left: result.markerPos + '%' }">
						<view class="marker-dot"></view>
						<view class="marker-line"></view>
					</view>
				</view>
				<view class="scale-labels">
					<text class="scale-label">偏瘦</text>
					<text class="scale-label">正常</text>
					<text class="scale-label">偏胖</text>
					<text class="scale-label">肥胖</text>
				</view>
				<view class="scale-values">
					<text class="scale-val">&lt;18.5</text>
					<text class="scale-val">18.5~24</text>
					<text class="scale-val">24~28</text>
					<text class="scale-val">≥28</text>
				</view>
			</view>
		</view>

		<!-- 健康建议 -->
		<view class="card advice-card" v-if="result.show">
			<view class="card-title">健康建议</view>
			<view class="advice-content">
				<view class="advice-icon-wrap" :style="{ background: result.iconBg }">
					<text class="advice-icon" :style="{ color: result.color }">{{ result.icon }}</text>
				</view>
				<text class="advice-text">{{ result.advice }}</text>
			</view>
		</view>

		<!-- 参考表格 -->
		<view class="card">
			<view class="card-title">BMI 参考标准（中国）</view>
			<view class="ref-table">
				<view class="ref-row ref-header">
					<text class="ref-cell ref-category">分类</text>
					<text class="ref-cell ref-range">BMI 范围</text>
					<text class="ref-cell ref-risk">健康风险</text>
				</view>
				<view class="ref-row">
					<view class="ref-dot-wrap"><view class="ref-dot" style="background:#4A90D9;"></view></view>
					<text class="ref-cell ref-category" style="color:#4A90D9;font-weight:600;">偏瘦</text>
					<text class="ref-cell ref-range">&lt; 18.5</text>
					<text class="ref-cell ref-risk">营养不良风险</text>
				</view>
				<view class="ref-row">
					<view class="ref-dot-wrap"><view class="ref-dot" style="background:#4CAF50;"></view></view>
					<text class="ref-cell ref-category" style="color:#4CAF50;font-weight:600;">正常</text>
					<text class="ref-cell ref-range">18.5 ~ 24</text>
					<text class="ref-cell ref-risk">低风险</text>
				</view>
				<view class="ref-row">
					<view class="ref-dot-wrap"><view class="ref-dot" style="background:#FF9800;"></view></view>
					<text class="ref-cell ref-category" style="color:#FF9800;font-weight:600;">偏胖</text>
					<text class="ref-cell ref-range">24 ~ 28</text>
					<text class="ref-cell ref-risk">中等风险</text>
				</view>
				<view class="ref-row">
					<view class="ref-dot-wrap"><view class="ref-dot" style="background:#F44336;"></view></view>
					<text class="ref-cell ref-category" style="color:#F44336;font-weight:600;">肥胖</text>
					<text class="ref-cell ref-range">≥ 28</text>
					<text class="ref-cell ref-risk">高风险</text>
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { fmt2, toast } from '@/utils/helpers.js';

export default {
	data() {
		return {
			height: '',
			weight: '',
			result: {
				show: false,
				value: '0.00',
				category: '',
				color: '',
				gradient: '',
				iconBg: '',
				icon: '',
				advice: '',
				markerPos: 0
			}
		};
	},
	methods: {
		calcBMI() {
			var h = parseFloat(this.height);
			var w = parseFloat(this.weight);

			if (!h || h <= 0 || !w || w <= 0) {
				toast('请输入有效的身高和体重');
				return;
			}
			if (h < 30 || h > 250) {
				toast('身高范围应在 30~250 cm');
				return;
			}
			if (w < 2 || w > 300) {
				toast('体重范围应在 2~300 kg');
				return;
			}

			var hm = h / 100;
			var bmi = w / (hm * hm);
			var bmiStr = fmt2(bmi);

			var category = '';
			var color = '';
			var gradient = '';
			var iconBg = '';
			var icon = '';
			var advice = '';
			var markerPos = 0;

			if (bmi < 18.5) {
				category = '偏瘦';
				color = '#4A90D9';
				gradient = 'linear-gradient(135deg, #4A90D9, #D6EAFF)';
				iconBg = 'rgba(74,144,217,0.12)';
				icon = '💡';
				advice = '您的体重偏轻，建议适当增加营养摄入，配合力量训练增加肌肉量。';
				// 0~18.5 映射到 0~25%
				markerPos = (bmi / 18.5) * 25;
			} else if (bmi < 24) {
				category = '正常';
				color = '#4CAF50';
				gradient = 'linear-gradient(135deg, #4CAF50, #E8F5E9)';
				iconBg = 'rgba(76,175,80,0.12)';
				icon = '✅';
				advice = '恭喜！您的体重在健康范围内，请继续保持良好的饮食和运动习惯。';
				// 18.5~24 映射到 25~50%
				markerPos = 25 + ((bmi - 18.5) / 5.5) * 25;
			} else if (bmi < 28) {
				category = '偏胖';
				color = '#FF9800';
				gradient = 'linear-gradient(135deg, #FF9800, #FFF3E0)';
				iconBg = 'rgba(255,152,0,0.12)';
				icon = '⚠️';
				advice = '您的体重略微超标，建议控制饮食热量，增加有氧运动，每周至少150分钟中等强度运动。';
				// 24~28 映射到 50~75%
				markerPos = 50 + ((bmi - 24) / 4) * 25;
			} else {
				category = '肥胖';
				color = '#F44336';
				gradient = 'linear-gradient(135deg, #F44336, #FFEBEE)';
				iconBg = 'rgba(244,67,54,0.12)';
				icon = '🔴';
				advice = '您的体重已达到肥胖标准，建议咨询医生或营养师，制定科学的减重计划。';
				// 28+ 映射到 75~98%（上限 cap 在 40）
				markerPos = 75 + (Math.min(bmi - 28, 12) / 12) * 23;
			}

			this.result = {
				show: true,
				value: bmiStr,
				category: category,
				color: color,
				gradient: gradient,
				iconBg: iconBg,
				icon: icon,
				advice: advice,
				markerPos: Math.min(Math.max(markerPos, 2), 98)
			};
		}
	}
};
</script>

<style lang="scss" scoped>
$primary: #2B7DE9;
$primary-light: #EEF4FF;
$radius: 24rpx;
$text-main: #333;
$text-sec: #888;
$bg: #F5F5FA;
$card-bg: #fff;

@import '@/common/tool-styles.scss';

.bmi-page {
	min-height: 100vh;
	background: $bg;
	padding: 24rpx;
	padding-bottom: 60rpx;
}

/* ========== Input ========== */
.input-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
}
.unit {
	font-size: 26rpx;
	color: $text-sec;
	margin-left: 8rpx;
	flex-shrink: 0;
}

/* ========== Button ========== */
.btn-primary {
	background: linear-gradient(135deg, $primary 0%, #5b9eff 100%);
	border-radius: 48rpx;
	padding: 26rpx 0;
	text-align: center;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba($primary, 0.3);
}
.btn-primary-text {
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
}

/* ========== Result Card ========== */
.result-card {
	border-radius: $radius;
	padding: 32rpx 28rpx;
	margin-bottom: 24rpx;
	color: #fff;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}
.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.result-title {
	font-size: 30rpx;
	font-weight: 700;
}
.result-tag {
	font-size: 28rpx;
	font-weight: 700;
	background: rgba(255, 255, 255, 0.85);
	padding: 6rpx 20rpx;
	border-radius: 20rpx;
}
.result-main {
	text-align: center;
	margin-bottom: 32rpx;
}
.result-main-value {
	font-size: 72rpx;
	font-weight: 700;
	display: block;
	line-height: 1.1;
}
.result-main-label {
	font-size: 26rpx;
	opacity: 0.8;
	margin-top: 8rpx;
	display: block;
}

/* ========== Scale Bar ========== */
.scale-wrap {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 16rpx;
	padding: 24rpx 20rpx 16rpx;
}
.scale-bar {
	position: relative;
	display: flex;
	height: 24rpx;
	border-radius: 12rpx;
	overflow: visible;
	margin-bottom: 12rpx;
}
.scale-zone {
	height: 100%;
}
.zone-thin {
	width: 25%;
	background: #4A90D9;
	border-radius: 12rpx 0 0 12rpx;
}
.zone-normal {
	width: 25%;
	background: #4CAF50;
}
.zone-overweight {
	width: 25%;
	background: #FF9800;
}
.zone-obese {
	width: 25%;
	background: #F44336;
	border-radius: 0 12rpx 12rpx 0;
}
.scale-marker {
	position: absolute;
	top: -8rpx;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
}
.marker-dot {
	width: 20rpx;
	height: 20rpx;
	background: #fff;
	border-radius: 50%;
	border: 4rpx solid $text-main;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}
.marker-line {
	width: 4rpx;
	height: 32rpx;
	background: #fff;
	border-radius: 2rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}
.scale-labels {
	display: flex;
	margin-bottom: 4rpx;
}
.scale-label {
	width: 25%;
	text-align: center;
	font-size: 22rpx;
	opacity: 0.9;
}
.scale-values {
	display: flex;
}
.scale-val {
	width: 25%;
	text-align: center;
	font-size: 20rpx;
	opacity: 0.7;
}

/* ========== Advice ========== */
.advice-card {
	margin-bottom: 24rpx;
}
.advice-content {
	display: flex;
	align-items: flex-start;
}
.advice-icon-wrap {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 20rpx;
	margin-top: 4rpx;
}
.advice-icon {
	font-size: 32rpx;
}
.advice-text {
	flex: 1;
	font-size: 28rpx;
	color: $text-main;
	line-height: 1.7;
}

/* ========== Reference Table ========== */
.ref-table {
	border-radius: 16rpx;
	overflow: hidden;
	border: 1rpx solid #f0f0f5;
}
.ref-row {
	display: flex;
	align-items: center;
	padding: 20rpx 16rpx;
	border-bottom: 1rpx solid #f0f0f5;
	&:last-child {
		border-bottom: none;
	}
}
.ref-headers {
	background: #f8f9fc;
}
.ref-cell {
	font-size: 26rpx;
	color: $text-main;
}
.ref-category {
	width: 22%;
}
.ref-range {
	width: 33%;
}
.ref-risk {
	flex: 1;
}
.ref-dot-wrap {
	width: 40rpx;
	display: flex;
	justify-content: center;
	flex-shrink: 0;
}
.ref-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
}
.ref-header {
	background: #f8f9fc;
	.ref-cell {
		font-weight: 600;
		color: $text-sec;
		font-size: 24rpx;
	}
}
</style>
