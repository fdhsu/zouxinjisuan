<template>
	<view class="page">
		<!-- 输入卡片 -->
		<view class="card">
			<view class="card-title">宝宝信息</view>
			<view class="form-row">
				<text class="form-label">宝宝出生日期</text>
				<picker mode="date" :value="birthDate" :end="today" @change="onBirthDateChange">
					<view class="picker-wrap">
						<text class="picker-text">{{ birthDate || '请选择' }}</text>
						<text class="picker-arrow">&#x25BE;</text>
					</view>
				</picker>
			</view>
			<view class="gen-btn" @tap="generatePlan">
				<text class="gen-btn-text">生成接种计划</text>
			</view>
		</view>

		<!-- 统计摘要 -->
		<view class="summary-row" v-if="planGenerated">
			<view class="summary-item">
				<text class="summary-num">{{ summary.total }}</text>
				<text class="summary-label">总剂次</text>
			</view>
			<view class="summary-item">
				<text class="summary-num done">{{ summary.done }}</text>
				<text class="summary-label">已接种</text>
			</view>
			<view class="summary-item">
				<text class="summary-num wait">{{ summary.waiting }}</text>
				<text class="summary-label">待接种</text>
			</view>
			<view class="summary-item">
				<text class="summary-num overdue">{{ summary.overdue }}</text>
				<text class="summary-label">已过期</text>
			</view>
		</view>

		<!-- 接种计划列表 -->
		<view v-if="planGenerated" class="plan-list">
			<view v-for="(group, gIdx) in vaccineGroups" :key="gIdx" class="group-card card">
				<view class="group-header">
					<text class="group-age">{{ group.ageLabel }}</text>
					<text class="group-count">{{ group.items.length }} 剂</text>
				</view>
				<view
					class="vaccine-item"
					:class="{ 'vaccine-overdue': item.status === 'overdue', 'vaccine-done': item.done }"
					v-for="(item, iIdx) in group.items"
					:key="gIdx + '-' + iIdx"
					@tap="toggleDone(item)"
				>
					<view class="vaccine-check">
						<view class="check-circle" :class="{ checked: item.done }">
							<text v-if="item.done" class="check-icon">&#x2713;</text>
						</view>
					</view>
					<view class="vaccine-info">
						<text class="vaccine-name">{{ item.name }}</text>
						<text class="vaccine-date">{{ item.dueDateStr }}</text>
					</view>
					<view class="vaccine-status" :class="'status-' + item.status">
						<text class="status-text">{{ statusLabel(item.status) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="!planGenerated" class="empty-hint">
			<text class="empty-icon">&#x1F489;</text>
			<text class="empty-text">请选择宝宝出生日期并生成接种计划</text>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { formatDate, toast } from '@/utils/helpers.js';

// 国家免疫规划疫苗接种程序
const VACCINE_SCHEDULE = [
	{ ageLabel: '出生时', monthOffset: 0, vaccines: ['乙肝疫苗(第1剂)', '卡介苗'] },
	{ ageLabel: '1月龄', monthOffset: 1, vaccines: ['乙肝疫苗(第2剂)'] },
	{ ageLabel: '2月龄', monthOffset: 2, vaccines: ['脊灰疫苗(第1剂)'] },
	{ ageLabel: '3月龄', monthOffset: 3, vaccines: ['脊灰疫苗(第2剂)', '百白破(第1剂)'] },
	{ ageLabel: '4月龄', monthOffset: 4, vaccines: ['脊灰疫苗(第3剂)', '百白破(第2剂)'] },
	{ ageLabel: '5月龄', monthOffset: 5, vaccines: ['百白破(第3剂)'] },
	{ ageLabel: '6月龄', monthOffset: 6, vaccines: ['乙肝疫苗(第3剂)', 'A群流脑(第1剂)'] },
	{ ageLabel: '8月龄', monthOffset: 8, vaccines: ['麻腮风(第1剂)', '乙脑减毒活(第1剂)'] },
	{ ageLabel: '9月龄', monthOffset: 9, vaccines: ['A群流脑(第2剂)'] },
	{ ageLabel: '18月龄', monthOffset: 18, vaccines: ['百白破(第4剂)', '麻腮风(第2剂)', '甲肝减毒活'] },
	{ ageLabel: '2岁', monthOffset: 24, vaccines: ['乙脑减毒活(第2剂)'] },
	{ ageLabel: '3岁', monthOffset: 36, vaccines: ['A群C群流脑(第1剂)'] },
	{ ageLabel: '4岁', monthOffset: 48, vaccines: ['脊灰疫苗(第4剂)'] },
	{ ageLabel: '6岁', monthOffset: 72, vaccines: ['白破', 'A群C群流脑(第2剂)'] }
];

var STORAGE_KEY = 'vaccine_plan_status';

export default {
	data() {
		return {
			birthDate: '',
			today: formatDate(new Date()),
			planGenerated: false,
			vaccineGroups: [],
			statusMap: {} // { 'groupIdx-itemIdx': true/false }
		};
	},
	computed: {
		summary() {
			var total = 0;
			var done = 0;
			var waiting = 0;
			var overdue = 0;
			var todayTs = new Date();
			todayTs.setHours(0, 0, 0, 0);

			this.vaccineGroups.forEach(function(group) {
				group.items.forEach(function(item) {
					total++;
					if (item.done) {
						done++;
					} else if (item.status === 'overdue') {
						overdue++;
					} else {
						waiting++;
					}
				});
			});

			return { total: total, done: done, waiting: waiting, overdue: overdue };
		}
	},
	mounted() {
		this.loadStatus();
	},
	methods: {
		onBirthDateChange(e) {
			this.birthDate = e.detail.value;
		},

		generatePlan() {
			if (!this.birthDate) {
				toast('请先选择宝宝出生日期');
				return;
			}

			var birth = new Date(this.birthDate);
			var todayTs = new Date();
			todayTs.setHours(0, 0, 0, 0);

			var groups = [];
			VACCINE_SCHEDULE.forEach(function(schedule, gIdx) {
				var dueDate = new Date(birth);
				dueDate.setMonth(dueDate.getMonth() + schedule.monthOffset);

				var items = [];
				schedule.vaccines.forEach(function(name, iIdx) {
					var key = gIdx + '-' + iIdx;
					var done = !!this.statusMap[key];
					var dueTs = new Date(dueDate);
					dueTs.setHours(0, 0, 0, 0);

					var status = 'waiting';
					if (done) {
						status = 'done';
					} else if (dueTs < todayTs) {
						status = 'overdue';
					}

					items.push({
						name: name,
						dueDate: dueDate,
						dueDateStr: formatDate(dueDate),
						done: done,
						status: status,
						key: key
					});
				}.bind(this));

				groups.push({
					ageLabel: schedule.ageLabel,
					items: items
				});
			}.bind(this));

			this.vaccineGroups = groups;
			this.planGenerated = true;
			toast('接种计划已生成');
		},

		toggleDone(item) {
			item.done = !item.done;
			if (item.done) {
				item.status = 'done';
			} else {
				// recalculate status
				var todayTs = new Date();
				todayTs.setHours(0, 0, 0, 0);
				var dueTs = new Date(item.dueDate);
				dueTs.setHours(0, 0, 0, 0);
				item.status = dueTs < todayTs ? 'overdue' : 'waiting';
			}
			this.statusMap[item.key] = item.done;
			this.saveStatus();

			// force reactivity for summary
			this.vaccineGroups = this.vaccineGroups.slice();
		},

		statusLabel(status) {
			switch (status) {
				case 'done': return '已接种';
				case 'overdue': return '已过期';
				default: return '待接种';
			}
		},

		saveStatus() {
			uni.setStorageSync(STORAGE_KEY, JSON.stringify(this.statusMap));
		},

		loadStatus() {
			var data = uni.getStorageSync(STORAGE_KEY);
			if (data) {
				try {
					this.statusMap = JSON.parse(data);
				} catch (e) {
					this.statusMap = {};
				}
			}
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
$danger: #E54D42;
$danger-light: #FEF0EE;
$success: #19BE6B;
$success-light: #E8F8EE;

@import '@/common/tool-styles.scss';

page {
	background-color: $bg;
}

.page {
	min-height: 100vh;
	background: $bg;
	padding: 24rpx;
	padding-bottom: 60rpx;
	box-sizing: border-box;
}

/* ========== 生成按钮 ========== */
.gen-btn {
	margin-top: 24rpx;
	background: $primary;
	border-radius: 16rpx;
	padding: 22rpx 0;
	text-align: center;

	&:active {
		opacity: 0.85;
	}
}

.gen-btn-text {
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}

/* ========== Picker ========== */
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
	color: #bbb;
	margin-left: 8rpx;
}

/* ========== 统计摘要 ========== */
.summary-row {
	display: flex;
	background: $card-bg;
	border-radius: $radius;
	padding: 28rpx 16rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.summary-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.summary-num {
	font-size: 44rpx;
	font-weight: 700;
	color: $text-main;
	line-height: 1.2;
}

.summary-num.done {
	color: $success;
}

.summary-num.wait {
	color: $primary;
}

.summary-num.overdue {
	color: $danger;
}

.summary-label {
	font-size: 24rpx;
	color: $text-sec;
	margin-top: 8rpx;
}

/* ========== 分组卡片 ========== */
.group-card {
	padding: 0;
	overflow: hidden;
}

.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 28rpx;
	background: $primary-light;
	border-bottom: 1rpx solid rgba(43, 125, 233, 0.1);
}

.group-age {
	font-size: 30rpx;
	font-weight: 700;
	color: $primary;
}

.group-count {
	font-size: 24rpx;
	color: $text-sec;
	background: rgba(43, 125, 233, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

/* ========== 疫苗条目 ========== */
.vaccine-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #f0f0f5;
	transition: background 0.2s;

	&:last-child {
		border-bottom: none;
	}

	&:active {
		background: #f8f8fc;
	}
}

.vaccine-overdue {
	background: $danger-light;
	border-left: 6rpx solid $danger;

	&:active {
		background: #fde8e5;
	}
}

.vaccine-done {
	opacity: 0.7;
}

.vaccine-check {
	flex-shrink: 0;
	margin-right: 20rpx;
}

.check-circle {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	border: 3rpx solid #d0d0d0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: $card-bg;

	&.checked {
		background: $success;
		border-color: $success;
	}
}

.check-icon {
	font-size: 26rpx;
	color: #fff;
	font-weight: 700;
	line-height: 1;
}

.vaccine-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.vaccine-name {
	font-size: 28rpx;
	color: $text-main;
	font-weight: 500;
}

.vaccine-date {
	font-size: 24rpx;
	color: $text-sec;
}

.vaccine-status {
	flex-shrink: 0;
	padding: 6rpx 18rpx;
	border-radius: 20rpx;
	margin-left: 16rpx;
}

.status-waiting {
	background: $primary-light;
}

.status-waiting .status-text {
	font-size: 24rpx;
	color: $primary;
	font-weight: 500;
}

.status-overdue {
	background: $danger-light;
}

.status-overdue .status-text {
	font-size: 24rpx;
	color: $danger;
	font-weight: 500;
}

.status-done {
	background: $success-light;
}

.status-done .status-text {
	font-size: 24rpx;
	color: $success;
	font-weight: 500;
}

/* ========== 空状态 ========== */
.empty-hint {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0 60rpx;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: $text-sec;
}
</style>
