<template>
	<view class="pregnancy-page">
		<!-- Input Card -->
		<view class="card">
			<view class="card-title">孕期计算</view>
			<view class="form-row">
				<text class="form-label">计算方式</text>
				<view class="radio-group">
					<view class="radio-item" :class="{ active: mode === 0 }" @tap="mode = 0; result.show = false">
						<view class="radio-dot" :class="{ active: mode === 0 }"></view>
						<text class="radio-text" :class="{ active: mode === 0 }">按末次月经</text>
					</view>
					<view class="radio-item" :class="{ active: mode === 1 }" @tap="mode = 1; result.show = false">
						<view class="radio-dot" :class="{ active: mode === 1 }"></view>
						<text class="radio-text" :class="{ active: mode === 1 }">按预产期</text>
					</view>
				</view>
			</view>
			<view class="form-row">
				<text class="form-label">{{ mode === 0 ? '末次月经日期' : '预产期日期' }}</text>
				<picker mode="date" :value="inputDate" @change="onDateChange">
					<view class="picker-wrap">
						<text class="picker-text">{{ inputDate || '请选择' }}</text>
						<text class="picker-arrow">&#x25BE;</text>
					</view>
				</picker>
			</view>
			<view class="btn-row">
				<button class="calc-btn" @tap="calculate">计算</button>
			</view>
		</view>

		<!-- Result Card -->
		<view class="result-card" v-if="result.show">
			<view class="result-header">
				<text class="result-title">计算结果</text>
				<text class="result-tag">{{ result.stage }}</text>
			</view>
			<view class="result-main">
				<text class="result-main-value">{{ result.currentWeek }}</text>
				<text class="result-main-label">当前孕周</text>
			</view>
			<view class="result-rows">
				<view class="result-row">
					<text class="result-row-label">预产期</text>
					<text class="result-row-value">{{ result.edd }}</text>
				</view>
				<view class="result-row">
					<text class="result-row-label">受孕日估算</text>
					<text class="result-row-value">{{ result.conception }}</text>
				</view>
				<view class="result-row">
					<text class="result-row-label">所处阶段</text>
					<text class="result-row-value">{{ result.stage }}</text>
				</view>
				<view class="result-row">
					<text class="result-row-label">距预产期还剩</text>
					<text class="result-row-value">{{ result.daysLeft }} 天</text>
				</view>
			</view>
		</view>

		<!-- Prenatal Checkup Timeline -->
		<view class="card" v-if="result.show">
			<view class="card-title">关键产检时间</view>
			<view class="milestone-list">
				<view class="milestone-item" v-for="(m, idx) in milestones" :key="idx" :class="{ passed: m.status === 'passed', current: m.status === 'current', upcoming: m.status === 'upcoming' }">
					<view class="milestone-dot">
						<text class="milestone-dot-icon" v-if="m.status === 'passed'">&#x2713;</text>
						<text class="milestone-dot-icon" v-else-if="m.status === 'current'">&#x2605;</text>
						<text class="milestone-dot-num">{{ idx + 1 }}</text>
					</view>
					<view class="milestone-info">
						<view class="milestone-top">
							<text class="milestone-name">{{ m.name }}</text>
							<text class="milestone-tag" :class="m.status">{{ m.statusLabel }}</text>
						</view>
						<text class="milestone-weeks">{{ m.weeks }}</text>
						<text class="milestone-dates">{{ m.dateRange }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Fetal Development Reference -->
		<view class="card" v-if="result.show">
			<view class="card-title">胎儿发育参考</view>
			<view class="fetal-info">
				<view class="fetal-display">
					<text class="fetal-emoji">{{ result.fetalEmoji }}</text>
					<text class="fetal-size">{{ result.fetalSize }}</text>
				</view>
				<view class="fetal-desc-wrap">
					<text class="fetal-desc">{{ result.fetalDesc }}</text>
				</view>
			</view>
			<view class="fetal-table">
				<view class="fetal-table-header">
					<text class="fetal-th-week">孕周</text>
					<text class="fetal-th-size">大小参考</text>
				</view>
				<view class="fetal-table-row" v-for="(f, idx) in fetalTable" :key="idx" :class="{ highlight: f.highlight }">
					<text class="fetal-td-week">{{ f.week }}</text>
					<text class="fetal-td-size">{{ f.size }}</text>
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { formatDate, toast } from '@/utils/helpers.js';

export default {
	data() {
		return {
			mode: 0, // 0 = by LMP, 1 = by EDD
			inputDate: '',
			result: {
				show: false,
				edd: '',
				conception: '',
				currentWeek: '',
				stage: '',
				daysLeft: 0,
				weekNum: 0,
				dayNum: 0,
				fetalSize: '',
				fetalEmoji: '',
				fetalDesc: ''
			},
			milestones: [],
			fetalTable: [
				{ week: '8周', size: '葡萄大小', highlight: false },
				{ week: '12周', size: '李子大小', highlight: false },
				{ week: '16周', size: '牛油果大小', highlight: false },
				{ week: '20周', size: '香蕉大小', highlight: false },
				{ week: '24周', size: '玉米大小', highlight: false },
				{ week: '28周', size: '茄子大小', highlight: false },
				{ week: '32周', size: '大白菜大小', highlight: false },
				{ week: '36周', size: '哈密瓜大小', highlight: false },
				{ week: '40周', size: '西瓜大小', highlight: false }
			],
			fetalData: {
				4: { size: '芝麻大小', emoji: '\uD83C\uDF31', desc: '胚胎刚刚着床，心脏开始形成，神经管和消化系统开始发育。' },
				5: { size: '苹果籽大小', emoji: '\uD83C\uDF31', desc: '面部特征开始形成，眼睛和鼻孔出现，心脏开始跳动。' },
				6: { size: '甜豌豆大小', emoji: '\uD83C\uDF31', desc: '手指和脚趾开始形成，大脑快速发育，可以检测到胎心。' },
				7: { size: '蓝莓大小', emoji: '\uD83E\uDED0', desc: '大脑细胞快速增殖，四肢开始形成雏形，五官更加清晰。' },
				8: { size: '葡萄大小', emoji: '\uD83C\uDF47', desc: '胎儿已有覆盆子大小，手指和脚趾成形，开始有轻微运动。' },
				9: { size: '樱桃大小', emoji: '\uD83C\uDF52', desc: '所有重要器官已形成，开始进入快速生长期，可以做出吞咽动作。' },
				10: { size: '金桔大小', emoji: '\uD83C\uDF4A', desc: '胎儿开始有自主运动，指甲和头发开始生长，骨骼开始硬化。' },
				11: { size: '无花果大小', emoji: '\uD83E\uDDC3', desc: '胎儿可以踢腿和翻转，声带形成，性别特征开始明显。' },
				12: { size: '李子大小', emoji: '\uD83E\uDDC3', desc: '胎儿已有李子大小，反射能力形成，手指和脚趾完全分开。' },
				13: { size: '柠檬大小', emoji: '\uD83C\uDF4B', desc: '指纹开始形成，声带发育完成，可以做出吸吮拇指的动作。' },
				14: { size: '桃子大小', emoji: '\uD83C\uDF51', desc: '胎儿开始长出胎毛，可以做出面部表情，声带进一步发育。' },
				15: { size: '苹果大小', emoji: '\uD83C\uDF4E', desc: '胎儿可以感知光线，骨骼加速发育，开始有规律的呼吸运动。' },
				16: { size: '牛油果大小', emoji: '\uD83E\uDD51', desc: '胎儿可以做出吸吮和吞咽动作，开始有听觉，能听到心跳声。' },
				17: { size: '石榴大小', emoji: '\uD83C\uDF4E', desc: '脂肪开始堆积，骨骼从软骨变为硬骨，听觉继续发育。' },
				18: { size: '红薯大小', emoji: '\uD83C\uDF60', desc: '耳朵位置固定，可以听到外界声音，神经系统发育迅速。' },
				19: { size: '芒果大小', emoji: '\uD83E\uDD6D', desc: '感觉器官快速发育，可以翻身，胎动更加明显。' },
				20: { size: '香蕉大小', emoji: '\uD83C\uDF4C', desc: '胎儿已有香蕉大小，可以做出各种表情，开始有规律的睡眠周期。' },
				21: { size: '胡萝卜大小', emoji: '\uD83E\uDD55', desc: '眉毛和眼睑形成，可以吞咽羊水，消化系统的发育进入新阶段。' },
				22: { size: '木瓜大小', emoji: '\uD83C\uDF48', desc: '嘴唇和眉毛更加清晰，肺部开始产生表面活性物质。' },
				23: { size: '大芒果大小', emoji: '\uD83E\uDD6D', desc: '胎儿可以听到外界的声音，肺部继续发育，血管形成。' },
				24: { size: '玉米大小', emoji: '\uD83C\uDF3D', desc: '肺部开始产生表面活性物质，皮肤薄而透明，可以睁开眼睛。' },
				25: { size: '花菜大小', emoji: '\uD83E\uDD66', desc: '对声音有反应，可以打嗝，皮肤开始变得不透明。' },
				26: { size: '葱大小', emoji: '\uD83E\uDDC5', desc: '眼睛可以睁开闭合，大脑发育迅速，肺部继续成熟。' },
				27: { size: '生菜大小', emoji: '\uD83E\uDD6C', desc: '可以规律地呼吸，大脑非常活跃，睡眠周期更加明显。' },
				28: { size: '茄子大小', emoji: '\uD83C\uDF46', desc: '胎儿已有茄子大小，可以眨眼和感知光线，大脑快速发育。' },
				29: { size: '南瓜大小', emoji: '\uD83C\uDF83', desc: '肌肉和肺部继续发育，大脑连接快速形成，体温调节能力增强。' },
				30: { size: '大白菜大小', emoji: '\uD83E\uDD6C', desc: '骨髓开始产生红细胞，可以感知光线变化，脂肪快速堆积。' },
				31: { size: '椰子大小', emoji: '\uD83E\uDD65', desc: '大脑发育极快，可以调节体温，免疫系统逐步建立。' },
				32: { size: '大白菜大小', emoji: '\uD83E\uDD6C', desc: '胎儿已有大白菜大小，脚趾甲和手指甲完全形成，练习呼吸。' },
				33: { size: '菠萝大小', emoji: '\uD83C\uDF4D', desc: '骨骼继续硬化，免疫系统发育，皮下脂肪增加。' },
				34: { size: '哈密瓜大小', emoji: '\uD83C\uDF48', desc: '肺部接近成熟，中枢神经系统发育，免疫系统继续增强。' },
				35: { size: '蜜瓜大小', emoji: '\uD83C\uDF48', desc: '大部分器官已发育完全，肾脏完全形成，肝脏可以代谢废物。' },
				36: { size: '哈密瓜大小', emoji: '\uD83C\uDF48', desc: '胎儿已有哈密瓜大小，面部特征完全形成，开始入盆准备出生。' },
				37: { size: '冬瓜大小', emoji: '\uD83C\uDF48', desc: '被认为是足月，各器官系统基本成熟，随时准备出生。' },
				38: { size: '小西瓜大小', emoji: '\uD83C\uDF49', desc: '肺部完全成熟，大脑和神经系统发育完成，继续积累脂肪。' },
				39: { size: '西瓜大小', emoji: '\uD83C\uDF49', desc: '胎儿已完全发育，器官功能完善，等待最佳时机出生。' },
				40: { size: '西瓜大小', emoji: '\uD83C\uDF49', desc: '胎儿已有西瓜大小，发育完全成熟，随时可能出生。' }
			}
		};
	},
	methods: {
		onDateChange(e) {
			this.inputDate = e.detail.value;
		},

		calculate() {
			if (!this.inputDate) {
				toast('请先选择日期');
				return;
			}

			var inputDate = new Date(this.inputDate);
			inputDate.setHours(0, 0, 0, 0);

			var lmp, edd;

			if (this.mode === 0) {
				// By LMP: EDD = LMP + 280 days
				lmp = inputDate;
				edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
			} else {
				// By EDD: LMP = EDD - 280 days
				edd = inputDate;
				lmp = new Date(edd.getTime() - 280 * 24 * 60 * 60 * 1000);
			}

			var conception = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);

			var today = new Date();
			today.setHours(0, 0, 0, 0);

			var totalDays = Math.floor((today - lmp) / (24 * 60 * 60 * 1000));
			var weekNum = Math.floor(totalDays / 7);
			var dayNum = totalDays % 7;

			if (totalDays < 0) {
				toast('所选日期尚未开始孕期');
				return;
			}

			if (weekNum > 42) {
				toast('孕周已超过42周，请确认日期');
				return;
			}

			// Stage
			var stage = '';
			if (weekNum <= 12) {
				stage = '孕早期';
			} else if (weekNum <= 27) {
				stage = '孕中期';
			} else {
				stage = '孕晚期';
			}

			// Days remaining
			var daysLeft = Math.floor((edd - today) / (24 * 60 * 60 * 1000));

			// Fetal info
			var fetalInfo = this.getFetalInfo(weekNum);

			this.result = {
				show: true,
				edd: formatDate(edd),
				conception: formatDate(conception),
				currentWeek: weekNum + '周+' + dayNum + '天',
				stage: stage,
				daysLeft: daysLeft >= 0 ? daysLeft : 0,
				weekNum: weekNum,
				dayNum: dayNum,
				fetalSize: fetalInfo.size,
				fetalEmoji: fetalInfo.emoji,
				fetalDesc: fetalInfo.desc
			};

			// Build milestones
			this.buildMilestones(lmp);

			// Update fetal table highlights
			this.updateFetalTable(weekNum);
		},

		getFetalInfo(week) {
			if (week < 4) week = 4;
			if (week > 40) week = 40;

			// Find closest week in fetalData
			var keys = Object.keys(this.fetalData).map(Number).sort(function(a, b) { return a - b; });
			var closest = keys[0];
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] <= week) {
					closest = keys[i];
				} else {
					break;
				}
			}
			return this.fetalData[closest] || { size: '未知', emoji: '\uD83C\uDF31', desc: '' };
		},

		buildMilestones(lmp) {
			var today = new Date();
			today.setHours(0, 0, 0, 0);

			var rawMilestones = [
				{ name: '首次B超确认', weeksStart: 6, weeksEnd: 8 },
				{ name: 'NT检查', weeksStart: 11, weeksEnd: 13, daysEnd: 6 },
				{ name: '唐氏筛查', weeksStart: 15, weeksEnd: 20 },
				{ name: '大排畸B超', weeksStart: 20, weeksEnd: 24 },
				{ name: '糖耐量试验', weeksStart: 24, weeksEnd: 28 },
				{ name: '小排畸B超', weeksStart: 28, weeksEnd: 32 },
				{ name: '每2周产检', weeksStart: 32, weeksEnd: 36 },
				{ name: '每周产检', weeksStart: 36, weeksEnd: 40 }
			];

			var milestones = [];
			for (var i = 0; i < rawMilestones.length; i++) {
				var m = rawMilestones[i];
				var startDate = new Date(lmp.getTime() + m.weeksStart * 7 * 24 * 60 * 60 * 1000);
				var endWeeks = m.weeksEnd;
				var endExtraDays = m.daysEnd || 0;
				var endDate = new Date(lmp.getTime() + (endWeeks * 7 + endExtraDays) * 24 * 60 * 60 * 1000);

				var weeksLabel = m.weeksStart + '-' + m.weeksEnd + '周';
				if (m.daysEnd) {
					weeksLabel = m.weeksStart + '-13周+6';
				}

				var dateRange = formatDate(startDate) + ' ~ ' + formatDate(endDate);

				var status = 'upcoming';
				var statusLabel = '待进行';
				if (today >= startDate && today <= endDate) {
					status = 'current';
					statusLabel = '本周';
				} else if (today > endDate) {
					status = 'passed';
					statusLabel = '已完成';
				}

				milestones.push({
					name: m.name,
					weeks: weeksLabel,
					dateRange: dateRange,
					status: status,
					statusLabel: statusLabel
				});
			}

			this.milestones = milestones;
		},

		updateFetalTable(weekNum) {
			var weekMap = { 8: 0, 12: 1, 16: 2, 20: 3, 24: 4, 28: 5, 32: 6, 36: 7, 40: 8 };
			var highlightIdx = -1;
			var keys = Object.keys(weekMap);
			for (var i = 0; i < keys.length; i++) {
				var w = parseInt(keys[i]);
				if (weekNum >= w) {
					highlightIdx = weekMap[w];
				}
			}
			for (var j = 0; j < this.fetalTable.length; j++) {
				this.fetalTable[j].highlight = (j === highlightIdx);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/tool-styles.scss';

.pregnancy-page { min-height: 100vh; background: $bg; padding: 24rpx; padding-bottom: 60rpx; }

/* Radio group */
.radio-group {
	display: flex;
	align-items: center;
	gap: 24rpx;
}
.radio-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}
.radio-dot {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	border: 3rpx solid #ccc;
	display: flex;
	align-items: center;
	justify-content: center;
	&.active {
		border-color: $primary;
		&::after {
			content: '';
			width: 16rpx;
			height: 16rpx;
			border-radius: 50%;
			background: $primary;
		}
	}
}
.radio-text {
	font-size: 26rpx;
	color: $text-sec;
	&.active {
		color: $primary;
		font-weight: 600;
	}
}

/* Picker */
.picker-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
}
.picker-text {
	font-size: 28rpx;
	color: $text-main;
}
.picker-arrow {
	font-size: 20rpx;
	color: #999;
	margin-left: 8rpx;
}

/* Button */
.btn-row {
	margin-top: 28rpx;
}
.calc-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: $primary;
	color: #fff;
	font-size: 32rpx;
	font-weight: 700;
	border-radius: $radius;
	border: none;
	letter-spacing: 4rpx;
}
.calc-btn:active {
	opacity: 0.85;
}

/* Result card */
.result-card {
	background: linear-gradient(135deg, $primary, #5B9CF5);
	border-radius: $radius;
	padding: 32rpx 28rpx;
	margin-bottom: 24rpx;
	color: #fff;
	box-shadow: 0 8rpx 24rpx rgba(43, 125, 233, 0.25);
}
.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}
.result-title {
	font-size: 30rpx;
	font-weight: 700;
}
.result-tag {
	font-size: 24rpx;
	opacity: 0.85;
	background: rgba(255, 255, 255, 0.2);
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}
.result-main {
	text-align: center;
	margin-bottom: 28rpx;
}
.result-main-value {
	font-size: 52rpx;
	font-weight: 700;
	display: block;
}
.result-main-label {
	font-size: 24rpx;
	opacity: 0.8;
	margin-top: 8rpx;
	display: block;
}
.result-rows {
	background: rgba(255, 255, 255, 0.12);
	border-radius: 16rpx;
	padding: 8rpx 20rpx;
}
.result-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14rpx 0;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	&:last-child {
		border-bottom: none;
	}
}
.result-row-label {
	font-size: 26rpx;
	opacity: 0.85;
}
.result-row-value {
	font-size: 26rpx;
	font-weight: 600;
}

/* Milestones */
.milestone-list {
	padding: 0 8rpx;
}
.milestone-item {
	display: flex;
	align-items: flex-start;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f5;
	&:last-child {
		border-bottom: none;
	}
	&.passed .milestone-dot {
		background: #E8F5E9;
	}
	&.passed .milestone-dot-icon {
		color: #4CAF50;
	}
	&.current .milestone-dot {
		background: $primary-light;
	}
	&.current .milestone-dot-icon {
		color: $primary;
	}
	&.upcoming .milestone-dot {
		background: #F5F5F5;
	}
}
.milestone-dot {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 20rpx;
	margin-top: 4rpx;
}
.milestone-dot-icon {
	font-size: 28rpx;
	font-weight: 700;
}
.milestone-dot-num {
	font-size: 24rpx;
	color: #999;
	font-weight: 600;
}
.milestone-info {
	flex: 1;
}
.milestone-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}
.milestone-name {
	font-size: 28rpx;
	color: $text-main;
	font-weight: 600;
}
.milestone-tag {
	font-size: 22rpx;
	padding: 4rpx 14rpx;
	border-radius: 16rpx;
	&.passed {
		background: #E8F5E9;
		color: #4CAF50;
	}
	&.current {
		background: $primary-light;
		color: $primary;
		font-weight: 600;
	}
	&.upcoming {
		background: #F5F5F5;
		color: #999;
	}
}
.milestone-weeks {
	font-size: 24rpx;
	color: $text-sec;
	display: block;
	margin-bottom: 4rpx;
}
.milestone-dates {
	font-size: 22rpx;
	color: #bbb;
	display: block;
}

/* Fetal development */
.fetal-info {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: $primary-light;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
}
.fetal-display {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 28rpx;
	flex-shrink: 0;
}
.fetal-emoji {
	font-size: 64rpx;
	line-height: 1.2;
}
.fetal-size {
	font-size: 24rpx;
	color: $primary;
	font-weight: 700;
	margin-top: 8rpx;
}
.fetal-desc-wrap {
	flex: 1;
}
.fetal-desc {
	font-size: 26rpx;
	color: $text-main;
	line-height: 1.7;
}

/* Fetal table */
.fetal-table {
	border: 1rpx solid #f0f0f5;
	border-radius: 12rpx;
	overflow: hidden;
}
.fetal-table-header {
	display: flex;
	background: #f8f9fa;
	padding: 16rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f5;
}
.fetal-th-week {
	flex: 1;
	font-size: 24rpx;
	color: $text-main;
	font-weight: 600;
}
.fetal-th-size {
	flex: 1;
	font-size: 24rpx;
	color: $text-main;
	font-weight: 600;
	text-align: right;
}
.fetal-table-row {
	display: flex;
	padding: 14rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f5;
	&:last-child {
		border-bottom: none;
	}
	&.highlight {
		background: $primary-light;
	}
}
.fetal-td-week {
	flex: 1;
	font-size: 24rpx;
	color: $text-sec;
}
.fetal-td-size {
	flex: 1;
	font-size: 24rpx;
	color: $text-main;
	text-align: right;
	font-weight: 500;
}
.fetal-table-row.highlight .fetal-td-week,
.fetal-table-row.highlight .fetal-td-size {
	color: $primary;
	font-weight: 600;
}
</style>
