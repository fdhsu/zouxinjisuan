<template>
	<view class="deposit-page">
		<view class="tab-bar">
			<view v-for="(tab, idx) in mainTabs" :key="idx" class="tab-bar-item" :class="{ active: mainTab === idx }" @tap="mainTab = idx">
				<text class="tab-bar-text">{{ tab }}</text>
				<view v-if="mainTab === idx" class="tab-bar-indicator"></view>
			</view>
		</view>

		<!-- Tab 0: 整存整取 -->
		<view v-show="mainTab === 0" class="tab-content">
			<view class="card">
				<view class="card-title">整存整取</view>
				<view class="form-row">
					<text class="form-label">本金</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="zz.amount" placeholder="请输入" @input="calcZZ" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row" @tap="showZZPeriodPicker = true">
					<text class="form-label">存期</text>
					<view class="picker-value">
						<text>{{ zzPeriodDisplay }}</text>
						<text class="arrow">></text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">年利率</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="zz.rate" placeholder="请输入" @input="calcZZ" />
						<text class="unit">%</text>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcZZ">
				<text class="btn-primary-text">计算</text>
			</view>

			<view class="result-card" v-if="zzResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">整存整取</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ formatMoney(zzResult.total) }}</text>
					<text class="result-main-label">到期本息(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">本金</text>
						<text class="result-row-value">{{ formatMoney(zzResult.principal) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">利息</text>
						<text class="result-row-value">{{ formatMoney(zzResult.interest) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">本息合计</text>
						<text class="result-row-value">{{ formatMoney(zzResult.total) }} 元</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 1: 零存整取 -->
		<view v-show="mainTab === 1" class="tab-content">
			<view class="card">
				<view class="card-title">零存整取</view>
				<view class="form-row">
					<text class="form-label">每月定投</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="zl.monthlyAmount" placeholder="请输入" @input="calcZL" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row" @tap="showZLPeriodPicker = true">
					<text class="form-label">存期</text>
					<view class="picker-value">
						<text>{{ zlPeriodDisplay }}</text>
						<text class="arrow">></text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">年利率</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="zl.rate" placeholder="请输入" @input="calcZL" />
						<text class="unit">%</text>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcZL">
				<text class="btn-primary-text">计算</text>
			</view>

			<view class="result-card" v-if="zlResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">零存整取</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ formatMoney(zlResult.total) }}</text>
					<text class="result-main-label">本息合计(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">总投入</text>
						<text class="result-row-value">{{ formatMoney(zlResult.totalInput) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">利息</text>
						<text class="result-row-value">{{ formatMoney(zlResult.interest) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">本息合计</text>
						<text class="result-row-value">{{ formatMoney(zlResult.total) }} 元</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 2: 活期 -->
		<view v-show="mainTab === 2" class="tab-content">
			<view class="card">
				<view class="card-title">活期存款</view>
				<view class="form-row">
					<text class="form-label">本金</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="hq.amount" placeholder="请输入" @input="calcHQ" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">存款天数</text>
					<view class="input-wrap">
						<input class="form-input" type="number" v-model="hq.days" placeholder="请输入" @input="calcHQ" />
						<text class="unit">天</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">年利率</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="hq.rate" placeholder="请输入" @input="calcHQ" />
						<text class="unit">%</text>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcHQ">
				<text class="btn-primary-text">计算</text>
			</view>

			<view class="result-card" v-if="hqResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">活期存款</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ formatMoney(hqResult.total) }}</text>
					<text class="result-main-label">本息合计(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">本金</text>
						<text class="result-row-value">{{ formatMoney(hqResult.principal) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">利息</text>
						<text class="result-row-value">{{ formatMoney(hqResult.interest) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">本息合计</text>
						<text class="result-row-value">{{ formatMoney(hqResult.total) }} 元</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 整存整取 - 存期选择器 -->
		<u-picker
			v-if="showZZPeriodPicker"
			mode="selector"
			:defaultIndex="zz.periodIdx"
			:range="zzPeriodOptions"
			rangeKey="label"
			@confirm="onZZPeriodConfirm"
			@cancel="showZZPeriodPicker = false"
		/>

		<!-- 零存整取 - 存期选择器 -->
		<u-picker
			v-if="showZLPeriodPicker"
			mode="selector"
			:defaultIndex="zl.periodIdx"
			:range="zlPeriodOptions"
			rangeKey="label"
			@confirm="onZLPeriodConfirm"
			@cancel="showZLPeriodPicker = false"
		/>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
import Decimal from 'decimal.js';
import { formatMoney, toast } from '@/utils/helpers.js';

export default {
	data() {
		return {
			mainTab: 0,
			mainTabs: ['整存整取', '零存整取', '活期'],

			// 整存整取
			zz: {
				amount: '',
				periodIdx: 2,
				rate: '1.45'
			},
			zzPeriodOptions: [
				{ label: '3个月', months: 3, rate: '1.15' },
				{ label: '6个月', months: 6, rate: '1.35' },
				{ label: '1年', months: 12, rate: '1.45' },
				{ label: '2年', months: 24, rate: '1.65' },
				{ label: '3年', months: 36, rate: '1.95' },
				{ label: '5年', months: 60, rate: '2.0' }
			],
			showZZPeriodPicker: false,
			zzResult: { show: false, principal: 0, interest: 0, total: 0 },

			// 零存整取
			zl: {
				monthlyAmount: '',
				periodIdx: 0,
				rate: '1.15'
			},
			zlPeriodOptions: [
				{ label: '1年', months: 12, rate: '1.15' },
				{ label: '3年', months: 36, rate: '1.35' },
				{ label: '5年', months: 60, rate: '1.45' }
			],
			showZLPeriodPicker: false,
			zlResult: { show: false, totalInput: 0, interest: 0, total: 0 },

			// 活期
			hq: {
				amount: '',
				days: '',
				rate: '0.2'
			},
			hqResult: { show: false, principal: 0, interest: 0, total: 0 }
		};
	},
	computed: {
		zzPeriodDisplay() {
			return this.zzPeriodOptions[this.zz.periodIdx].label;
		},
		zlPeriodDisplay() {
			return this.zlPeriodOptions[this.zl.periodIdx].label;
		}
	},
	methods: {
		formatMoney: formatMoney,

		// ========== 整存整取 ==========
		onZZPeriodConfirm(e) {
			var idx = e.value[0];
			this.zz.periodIdx = idx;
			this.zz.rate = this.zzPeriodOptions[idx].rate;
			this.showZZPeriodPicker = false;
			this.calcZZ();
		},
		calcZZ() {
			var amount = parseFloat(this.zz.amount) || 0;
			var rate = parseFloat(this.zz.rate) || 0;
			if (amount <= 0) {
				this.zzResult = { show: false, principal: 0, interest: 0, total: 0 };
				return;
			}
			var months = this.zzPeriodOptions[this.zz.periodIdx].months;
			var years = months / 12;
			var interest = new Decimal(amount).mul(new Decimal(rate).div(100)).mul(new Decimal(years));
			var total = new Decimal(amount).add(interest);
			this.zzResult = {
				show: true,
				principal: Number(new Decimal(amount).toFixed(2)),
				interest: Number(interest.toFixed(2)),
				total: Number(total.toFixed(2))
			};
		},

		// ========== 零存整取 ==========
		onZLPeriodConfirm(e) {
			var idx = e.value[0];
			this.zl.periodIdx = idx;
			this.zl.rate = this.zlPeriodOptions[idx].rate;
			this.showZLPeriodPicker = false;
			this.calcZL();
		},
		calcZL() {
			var monthly = parseFloat(this.zl.monthlyAmount) || 0;
			var rate = parseFloat(this.zl.rate) || 0;
			if (monthly <= 0) {
				this.zlResult = { show: false, totalInput: 0, interest: 0, total: 0 };
				return;
			}
			var months = this.zlPeriodOptions[this.zl.periodIdx].months;
			var monthlyRate = new Decimal(rate).div(100).div(12);
			// 零存整取公式: 本息 = 月存额×月数 + 月存额×(月数+1)/2×月利率
			var totalInput = new Decimal(monthly).mul(new Decimal(months));
			var interest = new Decimal(monthly).mul(new Decimal(months).plus(1)).div(2).mul(monthlyRate);
			var total = totalInput.add(interest);
			this.zlResult = {
				show: true,
				totalInput: Number(totalInput.toFixed(2)),
				interest: Number(interest.toFixed(2)),
				total: Number(total.toFixed(2))
			};
		},

		// ========== 活期 ==========
		calcHQ() {
			var amount = parseFloat(this.hq.amount) || 0;
			var days = parseFloat(this.hq.days) || 0;
			var rate = parseFloat(this.hq.rate) || 0;
			if (amount <= 0 || days <= 0) {
				this.hqResult = { show: false, principal: 0, interest: 0, total: 0 };
				return;
			}
			var interest = new Decimal(amount).mul(new Decimal(rate).div(100)).mul(new Decimal(days)).div(365);
			var total = new Decimal(amount).add(interest);
			this.hqResult = {
				show: true,
				principal: Number(new Decimal(amount).toFixed(2)),
				interest: Number(interest.toFixed(2)),
				total: Number(total.toFixed(2))
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

.deposit-page { min-height: 100vh; background: $bg; padding-bottom: 60rpx; }
.tab-content { padding: 24rpx; }

/* Page-specific overrides */
.result-card { background: linear-gradient(135deg, $primary, #5b9eff); box-shadow: 0 8rpx 24rpx rgba(43,125,233,0.25); }

.input-wrap { display: flex; align-items: center; flex: 1; justify-content: flex-end; }
.unit { font-size: 26rpx; color: $text-sec; margin-left: 8rpx; flex-shrink: 0; }

.picker-value { display: flex; align-items: center; flex: 1; justify-content: flex-end; }
.picker-value text { font-size: 28rpx; color: $text-main; }
.arrow { font-size: 28rpx; color: $text-sec; margin-left: 8rpx; }

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

/* ========== Buttons ========== */
.btn-primary {
	background: linear-gradient(135deg, $primary 0%, #5b9eff 100%);
	border-radius: 48rpx;
	padding: 24rpx 0;
	text-align: center;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba($primary, 0.3);
}
.btn-primary-text {
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
}
</style>
