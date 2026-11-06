<template>
	<view class="unit-page">
		<!-- Category Tabs (horizontal scrollable) -->
		<scroll-view class="cat-bar" scroll-x :show-scrollbar="false">
			<view class="cat-bar-inner">
				<view
					v-for="(cat, idx) in categories"
					:key="idx"
					class="cat-item"
					:class="{ active: currentCat === idx }"
					@tap="switchCat(idx)"
				>
					<text class="cat-text">{{ cat.name }}</text>
					<view v-if="currentCat === idx" class="cat-indicator"></view>
				</view>
			</view>
		</scroll-view>

		<!-- Conversion Card -->
		<view class="tab-content">
			<view class="card convert-card">
				<view class="card-title">单位换算</view>

				<!-- From Row -->
				<view class="convert-row">
					<text class="convert-label">从</text>
					<input
						class="convert-input"
						type="digit"
						v-model="inputValue"
						placeholder="请输入数值"
						@input="onInput"
					/>
					<picker :range="fromUnitNames" @change="onFromUnitChange">
						<view class="unit-picker">
							<text class="unit-picker-text">{{ fromUnitNames[fromUnitIndex] }}</text>
							<text class="unit-picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>

				<!-- Swap Button -->
				<view class="swap-row" @tap="doSwap">
					<view class="swap-btn">
						<text class="swap-icon">&#x21C5;</text>
					</view>
				</view>

				<!-- To Row -->
				<view class="convert-row">
					<text class="convert-label">到</text>
					<view class="convert-result-wrap">
						<text class="convert-result">{{ resultDisplay }}</text>
					</view>
					<picker :range="toUnitNames" @change="onToUnitChange">
						<view class="unit-picker">
							<text class="unit-picker-text">{{ toUnitNames[toUnitIndex] }}</text>
							<text class="unit-picker-arrow">&#x25BE;</text>
						</view>
					</picker>
				</view>
			</view>

			<!-- Formula Hint for Temperature -->
			<view class="card hint-card" v-if="categories[currentCat].name === '温度'">
				<view class="card-title">换算公式</view>
				<view class="formula-list">
					<text class="formula-text">°F = °C × 9/5 + 32</text>
					<text class="formula-text">K = °C + 273.15</text>
					<text class="formula-text">°C = (°F − 32) × 5/9</text>
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { fmt2, toast } from '@/utils/helpers.js';

var unitData = {
	length: {
		name: '长度',
		base: '米',
		units: [
			{ name: '毫米 (mm)', factor: 0.001 },
			{ name: '厘米 (cm)', factor: 0.01 },
			{ name: '米 (m)', factor: 1 },
			{ name: '千米 (km)', factor: 1000 },
			{ name: '英寸 (in)', factor: 0.0254 },
			{ name: '英尺 (ft)', factor: 0.3048 },
			{ name: '码 (yd)', factor: 0.9144 },
			{ name: '英里 (mi)', factor: 1609.344 }
		]
	},
	weight: {
		name: '重量',
		base: '克',
		units: [
			{ name: '毫克 (mg)', factor: 0.001 },
			{ name: '克 (g)', factor: 1 },
			{ name: '千克 (kg)', factor: 1000 },
			{ name: '吨 (t)', factor: 1000000 },
			{ name: '盎司 (oz)', factor: 28.3495 },
			{ name: '磅 (lb)', factor: 453.592 },
			{ name: '斤', factor: 500 },
			{ name: '公斤', factor: 1000 }
		]
	},
	temperature: {
		name: '温度',
		base: '特殊',
		units: [
			{ name: '摄氏度 (°C)', key: 'C' },
			{ name: '华氏度 (°F)', key: 'F' },
			{ name: '开尔文 (K)', key: 'K' }
		]
	},
	area: {
		name: '面积',
		base: '平方米',
		units: [
			{ name: '平方厘米 (cm²)', factor: 0.0001 },
			{ name: '平方米 (m²)', factor: 1 },
			{ name: '平方千米 (km²)', factor: 1000000 },
			{ name: '亩', factor: 666.667 },
			{ name: '公顷', factor: 10000 },
			{ name: '平方英尺 (ft²)', factor: 0.0929 },
			{ name: '平方码 (yd²)', factor: 0.8361 }
		]
	},
	volume: {
		name: '体积',
		base: '升',
		units: [
			{ name: '毫升 (mL)', factor: 0.001 },
			{ name: '升 (L)', factor: 1 },
			{ name: '立方米 (m³)', factor: 1000 },
			{ name: '加仑(US)', factor: 3.7854 },
			{ name: '加仑(UK)', factor: 4.5461 },
			{ name: '毫升', factor: 0.001 }
		]
	},
	speed: {
		name: '速度',
		base: '米/秒',
		units: [
			{ name: '米/秒 (m/s)', factor: 1 },
			{ name: '千米/时 (km/h)', factor: 0.2778 },
			{ name: '英里/时 (mph)', factor: 0.44704 },
			{ name: '节 (kn)', factor: 0.51444 },
			{ name: '马赫 (Ma)', factor: 343 }
		]
	},
	time: {
		name: '时间',
		base: '秒',
		units: [
			{ name: '毫秒 (ms)', factor: 0.001 },
			{ name: '秒 (s)', factor: 1 },
			{ name: '分钟 (min)', factor: 60 },
			{ name: '小时 (h)', factor: 3600 },
			{ name: '天', factor: 86400 },
			{ name: '周', factor: 604800 },
			{ name: '月', factor: 2592000 },
			{ name: '年', factor: 31536000 }
		]
	},
	data: {
		name: '数据存储',
		base: '字节',
		units: [
			{ name: '比特 (bit)', factor: 0.125 },
			{ name: '字节 (B)', factor: 1 },
			{ name: 'KB', factor: 1024 },
			{ name: 'MB', factor: 1048576 },
			{ name: 'GB', factor: 1073741824 },
			{ name: 'TB', factor: 1099511627776 }
		]
	}
};

var catKeys = ['length', 'weight', 'temperature', 'area', 'volume', 'speed', 'time', 'data'];

export default {
	data() {
		return {
			currentCat: 0,
			categories: catKeys.map(function(k) { return unitData[k]; }),
			inputValue: '1',
			fromUnitIndex: 0,
			toUnitIndex: 1,
			resultDisplay: '0.00'
		};
	},
	computed: {
		currentCatData() {
			return unitData[catKeys[this.currentCat]];
		},
		fromUnitNames() {
			return this.currentCatData.units.map(function(u) { return u.name; });
		},
		toUnitNames() {
			return this.currentCatData.units.map(function(u) { return u.name; });
		}
	},
	mounted() {
		this.convert();
	},
	methods: {
		switchCat(idx) {
			this.currentCat = idx;
			this.fromUnitIndex = 0;
			this.toUnitIndex = 1;
			this.inputValue = '1';
			this.convert();
		},

		onInput() {
			this.convert();
		},

		onFromUnitChange(e) {
			this.fromUnitIndex = Number(e.detail.value);
			this.convert();
		},

		onToUnitChange(e) {
			this.toUnitIndex = Number(e.detail.value);
			this.convert();
		},

		doSwap() {
			var tmp = this.fromUnitIndex;
			this.fromUnitIndex = this.toUnitIndex;
			this.toUnitIndex = tmp;
			this.convert();
		},

		convert() {
			var val = parseFloat(this.inputValue);
			if (isNaN(val)) {
				this.resultDisplay = '0.00';
				return;
			}

			var cat = this.currentCatData;
			var fromUnit = cat.units[this.fromUnitIndex];
			var toUnit = cat.units[this.toUnitIndex];

			if (!fromUnit || !toUnit) {
				this.resultDisplay = '0.00';
				return;
			}

			var result;

			if (cat.name === '温度') {
				result = this.convertTemperature(val, fromUnit.key, toUnit.key);
			} else {
				// Standard factor conversion: value * fromFactor / toFactor
				var baseValue = val * fromUnit.factor;
				result = baseValue / toUnit.factor;
			}

			if (Math.abs(result) < 0.005 && result !== 0) {
				// For very small numbers, show more precision
				this.resultDisplay = result.toPrecision(4);
			} else if (Math.abs(result) >= 1e12) {
				// For very large numbers, use exponential notation
				this.resultDisplay = result.toExponential(4);
			} else {
				this.resultDisplay = fmt2(result);
			}
		},

		convertTemperature(val, from, to) {
			if (from === to) return val;

			// Step 1: Convert to Celsius
			var celsius;
			switch (from) {
				case 'C':
					celsius = val;
					break;
				case 'F':
					celsius = (val - 32) * 5 / 9;
					break;
				case 'K':
					celsius = val - 273.15;
					break;
			}

			// Step 2: Convert from Celsius to target
			switch (to) {
				case 'C':
					return celsius;
				case 'F':
					return celsius * 9 / 5 + 32;
				case 'K':
					return celsius + 273.15;
			}

			return celsius;
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

.unit-page {
	min-height: 100vh;
	background: $bg;
	padding-bottom: 60rpx;
}

/* ─── Category Tab Bar (horizontal scroll) ─── */
.cat-bar {
	background: #fff;
	white-space: nowrap;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	position: sticky;
	top: 0;
	z-index: 100;
}
.cat-bar-inner {
	display: flex;
	padding: 0 8rpx;
}
.cat-item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx 28rpx 20rpx;
	position: relative;
	flex-shrink: 0;
}
.cat-text {
	font-size: 26rpx;
	color: #666;
}
.cat-item.active .cat-text {
	color: $primary;
	font-weight: 700;
}
.cat-indicator {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 6rpx;
	background: $primary;
	border-radius: 3rpx;
}

/* ─── Content ─── */
.tab-content {
	padding: 24rpx;
}

/* ─── Convert Card ─── */
.convert-card {
	padding: 28rpx;
}

.convert-row {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f5;
}
.convert-row:last-child {
	border-bottom: none;
}

.convert-label {
	font-size: 28rpx;
	color: $text-sec;
	flex-shrink: 0;
	width: 60rpx;
}

.convert-input {
	flex: 1;
	font-size: 32rpx;
	color: $text-main;
	padding: 8rpx 12rpx;
	min-width: 0;
}

.convert-result-wrap {
	flex: 1;
	padding: 8rpx 12rpx;
	min-width: 0;
}

.convert-result {
	font-size: 36rpx;
	font-weight: 700;
	color: $primary;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* ─── Unit Picker ─── */
.unit-picker {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	background: $primary-light;
	padding: 12rpx 20rpx;
	border-radius: 12rpx;
	margin-left: 12rpx;
}
.unit-picker-text {
	font-size: 24rpx;
	color: $primary;
	font-weight: 500;
	max-width: 160rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.unit-picker-arrow {
	font-size: 20rpx;
	color: $primary;
	margin-left: 8rpx;
	opacity: 0.7;
}

/* ─── Swap Button ─── */
.swap-row {
	display: flex;
	justify-content: center;
	padding: 8rpx 0;
}
.swap-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: $primary-light;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx solid $primary;
}
.swap-icon {
	font-size: 32rpx;
	color: $primary;
	font-weight: 700;
	line-height: 1;
}

/* ─── Hint Card ─── */
.hint-card {
	margin-top: 0;
}
.formula-list {
	padding: 8rpx 0;
}
.formula-text {
	font-size: 26rpx;
	color: $text-sec;
	display: block;
	padding: 8rpx 0;
	font-family: monospace;
}
</style>
