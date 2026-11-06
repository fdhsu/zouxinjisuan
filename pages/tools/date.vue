<template>
	<view class="date-page">
		<view class="tab-bar">
			<view v-for="(tab, idx) in mainTabs" :key="idx" class="tab-bar-item" :class="{ active: mainTab === idx }" @tap="mainTab = idx">
				<text class="tab-bar-text">{{ tab }}</text>
				<view v-if="mainTab === idx" class="tab-bar-indicator"></view>
			</view>
		</view>

		<!-- Tab 0: 日期差 -->
		<view v-show="mainTab === 0" class="tab-content">
			<view class="card">
				<view class="card-title">日期差计算</view>
				<view class="form-row">
					<text class="form-label">开始日期</text>
					<picker mode="date" :value="diffStart" @change="onDiffStartChange">
						<view class="picker-wrap">
							<text class="picker-text">{{ diffStart || '请选择' }}</text>
							<text class="picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
				<view class="form-row">
					<text class="form-label">结束日期</text>
					<picker mode="date" :value="diffEnd" @change="onDiffEndChange">
						<view class="picker-wrap">
							<text class="picker-text">{{ diffEnd || '请选择' }}</text>
							<text class="picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
				<view class="form-row switch-row">
					<text class="form-label">包含结束日</text>
					<u-switch v-model="diffInclusive" @change="calcDiff" activeColor="#2B7DE9" inactiveColor="#d0d0d0" size="44" />
				</view>
			</view>

			<view class="result-card" v-if="diffResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ diffResult.days }}</text>
					<text class="result-main-label">相隔天数</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">约合周数</text>
						<text class="result-row-value">{{ diffResult.weeks }} 周 {{ diffResult.extraDays }} 天</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">约合月数</text>
						<text class="result-row-value">{{ diffResult.months }} 个月 {{ diffResult.extraDays2 }} 天</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">约合年数</text>
						<text class="result-row-value">{{ diffResult.years }} 年 {{ diffResult.extraDays3 }} 天</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">总小时数</text>
						<text class="result-row-value">{{ diffResult.hours }} 小时</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 1: 日期加减 -->
		<view v-show="mainTab === 1" class="tab-content">
			<view class="card">
				<view class="card-title">日期加减</view>
				<view class="form-row">
					<text class="form-label">起始日期</text>
					<picker mode="date" :value="addBase" @change="onAddBaseChange">
						<view class="picker-wrap">
							<text class="picker-text">{{ addBase || '请选择' }}</text>
							<text class="picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
				<view class="form-row">
					<text class="form-label">运算方向</text>
					<view class="seg-control">
						<view v-for="(m, i) in addDirections" :key="i" class="seg-item" :class="{ active: addDirection === i }" @tap="addDirection = i; calcAdd()">
							<text class="seg-text" :class="{ active: addDirection === i }">{{ m }}</text>
						</view>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">时间单位</text>
					<view class="seg-control">
						<view v-for="(u, i) in addUnits" :key="i" class="seg-item" :class="{ active: addUnit === i }" @tap="addUnit = i; calcAdd()">
							<text class="seg-text" :class="{ active: addUnit === i }">{{ u }}</text>
						</view>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">数量</text>
					<view class="input-wrap">
						<input class="form-input" type="number" v-model="addAmount" placeholder="请输入" @input="calcAdd" />
					</view>
				</view>
			</view>

			<view class="result-card" v-if="addResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">{{ addDirections[addDirection] }}{{ addAmount }}{{ addUnits[addUnit] }}</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ addResult.date }}</text>
					<text class="result-main-label">目标日期</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">星期</text>
						<text class="result-row-value">{{ addResult.weekday }}</text>
					</view>
					<view class="result-row" v-if="addResult.lunar">
						<text class="result-row-label">农历</text>
						<text class="result-row-value">{{ addResult.lunar }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 2: 倒计时 -->
		<view v-show="mainTab === 2" class="tab-content">
			<view class="card">
				<view class="card-title">设置目标</view>
				<view class="form-row">
					<text class="form-label">目标日期</text>
					<picker mode="date" :value="countdownTarget" @change="onCountdownTargetChange">
						<view class="picker-wrap">
							<text class="picker-text">{{ countdownTarget || '请选择' }}</text>
							<text class="picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
				<view class="form-row">
					<text class="form-label">目标名称</text>
					<view class="input-wrap">
						<input class="form-input" type="text" v-model="countdownName" placeholder="如：春节、考试" />
					</view>
				</view>
			</view>

			<view class="result-card" v-if="countdownResult.show">
				<view class="result-header">
					<text class="result-title">{{ countdownName || '目标日期' }}</text>
					<text class="result-tag">{{ countdownResult.direction }}</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ countdownResult.days }}</text>
					<text class="result-main-label">{{ countdownResult.direction === '距今' ? '天' : '天已过' }}</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">目标日期</text>
						<text class="result-row-value">{{ countdownTarget }}</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">星期</text>
						<text class="result-row-value">{{ countdownResult.weekday }}</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">约合</text>
						<text class="result-row-value">{{ countdownResult.months }} 个月 {{ countdownResult.extraDays }} 天</text>
					</view>
				</view>
			</view>

			<view class="card" v-if="savedCountdowns.length > 0">
				<view class="card-title">已保存的倒计时</view>
				<view class="countdown-list">
					<view class="countdown-item" v-for="(item, idx) in savedCountdowns" :key="idx">
						<view class="countdown-info">
							<text class="countdown-name">{{ item.name }}</text>
							<text class="countdown-date">{{ item.target }}</text>
						</view>
						<view class="countdown-days" :class="item.past ? 'past' : 'future'">
							<text class="countdown-days-num">{{ item.days }}</text>
							<text class="countdown-days-unit">{{ item.past ? '天前' : '天后' }}</text>
						</view>
						<text class="countdown-delete" @click="deleteCountdown(idx)">&#x2715;</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 3: 农历查询 -->
		<view v-show="mainTab === 3" class="tab-content">
			<view class="card">
				<view class="card-title">公历转农历</view>
				<view class="form-row">
					<text class="form-label">选择日期</text>
					<picker mode="date" :value="lunarDate" @change="onLunarDateChange">
						<view class="picker-wrap">
							<text class="picker-text">{{ lunarDate || '请选择' }}</text>
							<text class="picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
			</view>

			<view class="result-card" v-if="lunarResult.show">
				<view class="result-header">
					<text class="result-title">农历信息</text>
				</view>
				<view class="lunar-display">
					<text class="lunar-big">{{ lunarResult.dateStr }}</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">农历</text>
						<text class="result-row-value">{{ lunarResult.lunarYear }} {{ lunarResult.dateStr }}</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">生肖</text>
						<text class="result-row-value">{{ lunarResult.zodiac }}</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">干支纪年</text>
						<text class="result-row-value">{{ lunarResult.lunarYear }}</text>
					</view>
					<view class="result-row" v-if="lunarResult.solarTerm">
						<text class="result-row-label">节气</text>
						<text class="result-row-value">{{ lunarResult.solarTerm }}</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">星期</text>
						<text class="result-row-value">{{ lunarResult.weekday }}</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">今日农历</view>
				<view class="today-lunar" v-if="todayLunar.show">
					<view class="today-row">
						<text class="today-label">公历</text>
						<text class="today-value">{{ todayLunar.solar }}</text>
					</view>
					<view class="today-row">
						<text class="today-label">农历</text>
						<text class="today-value">{{ todayLunar.lunarYear }} {{ todayLunar.dateStr }}</text>
					</view>
					<view class="today-row">
						<text class="today-label">生肖</text>
						<text class="today-value">{{ todayLunar.zodiac }}</text>
					</view>
					<view class="today-row" v-if="todayLunar.solarTerm">
						<text class="today-label">节气</text>
						<text class="today-value">{{ todayLunar.solarTerm }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const { getLunar } = require('@/components/chinese_lunar_calendar/lunar_calendar.js');
import { fmt0 as fmt } from '@/utils/helpers.js';

export default {
	data() {
		return {
			mainTab: 0,
			mainTabs: ['日期差', '日期加减', '倒计时', '农历查询'],
			weekdays: ['日', '一', '二', '三', '四', '五', '六'],

			// 日期差
			diffStart: '',
			diffEnd: '',
			diffInclusive: false,
			diffResult: { show: false, days: 0, weeks: 0, extraDays: 0, months: 0, extraDays2: 0, years: 0, extraDays3: 0, hours: 0 },

			// 日期加减
			addBase: '',
			addDirection: 0,
			addDirections: ['加', '减'],
			addUnit: 0,
			addUnits: ['天', '周', '月', '年'],
			addAmount: '',
			addResult: { show: false, date: '', weekday: '', lunar: '' },

			// 倒计时
			countdownTarget: '',
			countdownName: '',
			countdownResult: { show: false, days: 0, direction: '', weekday: '', months: 0, extraDays: 0 },
			savedCountdowns: [],

			// 农历
			lunarDate: '',
			lunarResult: { show: false, dateStr: '', lunarYear: '', zodiac: '', solarTerm: '', weekday: '' },
			todayLunar: { show: false, solar: '', dateStr: '', lunarYear: '', zodiac: '', solarTerm: '' }
		};
	},
	mounted() {
		this.loadCountdowns();
		this.calcTodayLunar();
	},
	methods: {
		getWeekday(dateStr) {
			var d = new Date(dateStr);
			return '星期' + this.weekdays[d.getDay()];
		},

		// === 日期差 ===
		onDiffStartChange(e) {
			this.diffStart = e.detail.value;
			this.calcDiff();
		},
		onDiffEndChange(e) {
			this.diffEnd = e.detail.value;
			this.calcDiff();
		},
		calcDiff() {
			if (!this.diffStart || !this.diffEnd) {
				this.diffResult.show = false;
				return;
			}
			var start = new Date(this.diffStart);
			var end = new Date(this.diffEnd);
			var diff = Math.abs(end - start);
			var days = Math.floor(diff / (1000 * 60 * 60 * 24));
			if (this.diffInclusive) days += 1;

			var weeks = Math.floor(days / 7);
			var extraDays = days % 7;

			var months = Math.floor(days / 30);
			var extraDays2 = days % 30;

			var years = Math.floor(days / 365);
			var extraDays3 = days % 365;

			var hours = days * 24;

			this.diffResult = {
				show: true,
				days: fmt(days),
				weeks: weeks,
				extraDays: extraDays,
				months: months,
				extraDays2: extraDays2,
				years: years,
				extraDays3: extraDays3,
				hours: fmt(hours)
			};
		},

		// === 日期加减 ===
		onAddBaseChange(e) {
			this.addBase = e.detail.value;
			this.calcAdd();
		},
		calcAdd() {
			if (!this.addBase || !this.addAmount) {
				this.addResult.show = false;
				return;
			}
			var base = new Date(this.addBase);
			var amount = parseInt(this.addAmount) || 0;
			if (this.addDirection === 1) amount = -amount;

			var result = new Date(base);
			switch (this.addUnit) {
				case 0: result.setDate(result.getDate() + amount); break;
				case 1: result.setDate(result.getDate() + amount * 7); break;
				case 2: result.setMonth(result.getMonth() + amount); break;
				case 3: result.setFullYear(result.getFullYear() + amount); break;
			}

			var y = result.getFullYear();
			var m = String(result.getMonth() + 1).padStart(2, '0');
			var d = String(result.getDate()).padStart(2, '0');
			var dateStr = y + '-' + m + '-' + d;
			var weekday = this.getWeekday(dateStr);

			var lunar = '';
			try {
				var lunarInfo = getLunar(y, result.getMonth() + 1, result.getDate());
				lunar = lunarInfo.dateStr;
			} catch (e) {}

			this.addResult = {
				show: true,
				date: dateStr,
				weekday: weekday,
				lunar: lunar
			};
		},

		// === 倒计时 ===
		onCountdownTargetChange(e) {
			this.countdownTarget = e.detail.value;
			this.calcCountdown();
		},
		calcCountdown() {
			if (!this.countdownTarget) {
				this.countdownResult.show = false;
				return;
			}
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var target = new Date(this.countdownTarget);
			target.setHours(0, 0, 0, 0);
			var diff = target - today;
			var days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
			var direction = diff >= 0 ? '距今' : '已过';
			var months = Math.floor(days / 30);
			var extraDays = days % 30;

			this.countdownResult = {
				show: true,
				days: fmt(days),
				direction: direction,
				weekday: this.getWeekday(this.countdownTarget),
				months: months,
				extraDays: extraDays
			};
		},
		saveCountdown() {
			if (!this.countdownTarget) return;
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var target = new Date(this.countdownTarget);
			target.setHours(0, 0, 0, 0);
			var days = Math.floor(Math.abs(target - today) / (1000 * 60 * 60 * 24));
			var past = target < today;
			this.savedCountdowns.push({
				name: this.countdownName || '未命名',
				target: this.countdownTarget,
				days: days,
				past: past
			});
			uni.setStorageSync('savedCountdowns', JSON.stringify(this.savedCountdowns));
			uni.showToast({ title: '已保存', icon: 'none' });
		},
		deleteCountdown(idx) {
			this.savedCountdowns.splice(idx, 1);
			uni.setStorageSync('savedCountdowns', JSON.stringify(this.savedCountdowns));
		},
		loadCountdowns() {
			var data = uni.getStorageSync('savedCountdowns');
			if (data) {
				try { this.savedCountdowns = JSON.parse(data); } catch (e) { this.savedCountdowns = []; }
			}
		},

		// === 农历 ===
		onLunarDateChange(e) {
			this.lunarDate = e.detail.value;
			this.calcLunar();
		},
		calcLunar() {
			if (!this.lunarDate) {
				this.lunarResult.show = false;
				return;
			}
			var d = new Date(this.lunarDate);
			try {
				var info = getLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
				this.lunarResult = {
					show: true,
					dateStr: info.dateStr,
					lunarYear: info.lunarYear,
					zodiac: info.zodiac,
					solarTerm: info.solarTerm || '',
					weekday: this.getWeekday(this.lunarDate)
				};
			} catch (e) {
				uni.showToast({ title: '日期超出范围', icon: 'none' });
			}
		},
		calcTodayLunar() {
			var today = new Date();
			var y = today.getFullYear();
			var m = today.getMonth() + 1;
			var d = today.getDate();
			var solar = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
			try {
				var info = getLunar(y, m, d);
				this.todayLunar = {
					show: true,
					solar: solar,
					dateStr: info.dateStr,
					lunarYear: info.lunarYear,
					zodiac: info.zodiac,
					solarTerm: info.solarTerm || ''
				};
			} catch (e) {}
		}
	}
};
</script>

<style lang="scss" scoped>
$primary: #E74C3C;
$primary-light: #e74c3c;
$bg: #F2F5FA;
$text: #1a1a2e;
$text-sec: #666;
$text-light: #999;
$border: #f0f0f5;
$radius: 20rpx;

@import '@/common/tool-styles.scss';

.date-page { min-height: 100vh; background: $bg; padding-bottom: 60rpx; }
.tab-content { padding: 24rpx; }

/* Page-specific overrides */
.result-card { background: linear-gradient(135deg, $primary, #c0392b); box-shadow: 0 8rpx 24rpx rgba(231,76,60,0.25); }

.input-wrap { display: flex; align-items: center; flex: 1; justify-content: flex-end; }

.picker-wrap { display: flex; align-items: center; flex: 1; justify-content: flex-end; }
.picker-text { font-size: 28rpx; color: $text; }
.picker-arrow { font-size: 20rpx; color: $text-light; margin-left: 8rpx; }

.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.result-title { font-size: 30rpx; font-weight: 700; }
.result-tag { font-size: 24rpx; opacity: 0.85; background: rgba(255,255,255,0.2); padding: 6rpx 16rpx; border-radius: 20rpx; }
.result-main { text-align: center; margin-bottom: 28rpx; }
.result-main-value { font-size: 52rpx; font-weight: 700; display: block; }
.result-main-label { font-size: 24rpx; opacity: 0.8; margin-top: 8rpx; display: block; }
.result-rows { background: rgba(255,255,255,0.12); border-radius: 16rpx; padding: 8rpx 20rpx; }
.result-row { display: flex; justify-content: space-between; align-items: center; padding: 14rpx 0; border-bottom: 1rpx solid rgba(255,255,255,0.1); &:last-child { border-bottom: none; } }
.result-row-label { font-size: 26rpx; opacity: 0.85; }
.result-row-value { font-size: 26rpx; font-weight: 600; }

.lunar-display { text-align: center; margin-bottom: 24rpx; }
.lunar-big { font-size: 48rpx; font-weight: 700; }

.today-lunar { padding: 8rpx 0; }
.today-row { display: flex; justify-content: space-between; padding: 16rpx 0; border-bottom: 1rpx solid $border; &:last-child { border-bottom: none; } }
.today-label { font-size: 28rpx; color: $text-sec; }
.today-value { font-size: 28rpx; color: $text; font-weight: 600; }

.countdown-list { }
.countdown-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid $border; &:last-child { border-bottom: none; } }
.countdown-info { flex: 1; }
.countdown-name { font-size: 28rpx; color: $text; font-weight: 600; display: block; }
.countdown-date { font-size: 24rpx; color: $text-light; margin-top: 4rpx; display: block; }
.countdown-days { margin-right: 20rpx; text-align: center; &.future .countdown-days-num { color: $primary; } &.past .countdown-days-num { color: $text-light; } }
.countdown-days-num { font-size: 36rpx; font-weight: 700; display: block; }
.countdown-days-unit { font-size: 22rpx; color: $text-light; }
.countdown-delete { font-size: 28rpx; color: $text-light; padding: 12rpx; }
.result-actions {
	padding: 0 24rpx 20rpx;
}
.btn-save {
	background: linear-gradient(135deg, #2B7DE9, #5BA3F5);
	border-radius: 16rpx;
	padding: 20rpx 0;
	text-align: center;
}
.btn-save-text {
	color: #fff;
	font-size: 28rpx;
	font-weight: bold;
}
</style>
