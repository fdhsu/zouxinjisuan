<template>
	<view class="mortgage-page">
		<!-- Custom Tab Bar -->
		<view class="tab-bar">
			<view
				v-for="(tab, idx) in mainTabs"
				:key="idx"
				class="tab-bar-item"
				:class="{ active: mainTab === idx }"
				@tap="mainTab = idx"
			>
				<text class="tab-bar-text">{{ tab }}</text>
				<view v-if="mainTab === idx" class="tab-bar-indicator"></view>
			</view>
		</view>

		<!-- ==================== Tab 1: 贷款计算 ==================== -->
		<view v-show="mainTab === 0" class="tab-content">
			<!-- LPR 利率展示 -->
			<view class="lpr-card">
				<view class="lpr-header">
					<text class="lpr-title">LPR 贷款市场报价利率</text>
					<text class="lpr-date">更新于 2025年10月</text>
				</view>
				<view class="lpr-body">
					<view class="lpr-item">
						<text class="lpr-label">1年期 LPR</text>
						<text class="lpr-value">3.10%</text>
					</view>
					<view class="lpr-divider"></view>
					<view class="lpr-item">
						<text class="lpr-label">5年期以上 LPR</text>
						<text class="lpr-value">3.60%</text>
					</view>
				</view>
			</view>

			<!-- 输入卡片 -->
			<view class="card">
				<view class="card-title">贷款信息</view>

				<!-- 贷款类型 -->
				<view class="form-row">
					<text class="form-label">贷款类型</text>
					<view class="seg-control">
						<view
							v-for="(t, i) in loanTypeOptions"
							:key="i"
							class="seg-item"
							:class="{ active: loanType === i }"
							@tap="loanType = i"
						>
							<text class="seg-text" :class="{ active: loanType === i }">{{ t }}</text>
						</view>
					</view>
				</view>

				<!-- 还款方式 -->
				<view class="form-row">
					<text class="form-label">还款方式</text>
					<view class="seg-control">
						<view
							v-for="(m, i) in methodOptions"
							:key="i"
							class="seg-item"
							:class="{ active: method === i }"
							@tap="method = i"
						>
							<text class="seg-text" :class="{ active: method === i }">{{ m }}</text>
						</view>
					</view>
				</view>

				<!-- 商贷金额 -->
				<view class="form-row" v-if="loanType === 0 || loanType === 2">
					<text class="form-label">商业贷款金额</text>
					<view class="input-suffix-wrap">
						<input
							class="form-input"
							type="digit"
							v-model="form.amount"
							placeholder="请输入金额"
							placeholder-class="placeholder"
						/>
						<text class="input-suffix">万元</text>
					</view>
				</view>

				<!-- 公积金金额 -->
				<view class="form-row" v-if="loanType === 1 || loanType === 2">
					<text class="form-label">公积金贷款金额</text>
					<view class="input-suffix-wrap">
						<input
							class="form-input"
							type="digit"
							v-model="form.gjjAmount"
							placeholder="请输入金额"
							placeholder-class="placeholder"
						/>
						<text class="input-suffix">万元</text>
					</view>
				</view>

				<!-- 贷款期限 -->
				<view class="form-row" @tap="showPeriodPicker = true">
					<text class="form-label">贷款期限</text>
					<view class="picker-value">
						<text>{{ periodDisplay }}</text>
						<text class="arrow">></text>
					</view>
				</view>

				<!-- 商贷利率 -->
				<view class="form-row" v-if="loanType === 0 || loanType === 2">
					<text class="form-label">商贷年利率</text>
					<view class="input-suffix-wrap">
						<input
							class="form-input"
							type="digit"
							v-model="form.rateDisplay"
							placeholder="请输入利率"
							placeholder-class="placeholder"
						/>
						<text class="input-suffix">%</text>
					</view>
				</view>

				<!-- 公积金利率 -->
				<view class="form-row" v-if="loanType === 1 || loanType === 2">
					<text class="form-label">公积金年利率</text>
					<view class="input-suffix-wrap">
						<input
							class="form-input"
							type="digit"
							v-model="form.gjjRateDisplay"
							placeholder="请输入利率"
							placeholder-class="placeholder"
						/>
						<text class="input-suffix">%</text>
					</view>
				</view>
			</view>

			<!-- 计算按钮 -->
			<view class="btn-primary" @tap="calcLoan">
				<text class="btn-primary-text">开始计算</text>
			</view>

			<!-- 结果卡片 -->
			<view class="result-card" v-if="calcResult.show">
				<view class="result-hero">
					<text class="result-hero-label">{{ method === 0 ? '每月月供' : '首月月供' }}（元）</text>
					<text class="result-hero-value">{{ calcResult.monthPayment }}</text>
					<text class="result-hero-sub" v-if="method === 1">末月月供: {{ calcResult.lastMonthPayment }} 元</text>
				</view>
				<view class="result-grid">
					<view class="result-grid-item">
						<text class="result-grid-label">贷款总额</text>
						<text class="result-grid-value">{{ calcResult.totalLoan }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
					<view class="result-grid-item">
						<text class="result-grid-label">还款总额</text>
						<text class="result-grid-value">{{ calcResult.totalRepay }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
					<view class="result-grid-item highlight">
						<text class="result-grid-label">支付利息</text>
						<text class="result-grid-value">{{ calcResult.totalInterest }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
				</view>
				<view class="result-actions">
					<view class="btn-outline" @tap="showDetail = !showDetail">
						<text class="btn-outline-text">{{ showDetail ? '收起明细' : '查看明细' }}</text>
					</view>
					<view class="btn-outline" @tap="resetLoan">
						<text class="btn-outline-text">重新计算</text>
					</view>
				</view>

				<!-- 按月还款明细 -->
				<view class="detail-section" v-if="showDetail">
					<view class="detail-title">
						<text>按月还款明细</text>
					</view>
					<scroll-view scroll-y class="detail-scroll" :scroll-top="0">
						<view class="detail-table">
							<view class="detail-row detail-header">
								<text class="detail-cell">期数</text>
								<text class="detail-cell">月供(元)</text>
								<text class="detail-cell">本金(元)</text>
								<text class="detail-cell">利息(元)</text>
								<text class="detail-cell">剩余本金(元)</text>
							</view>
							<view
								class="detail-row"
								v-for="(row, idx) in calcResult.detailList"
								:key="idx"
							>
								<text class="detail-cell">{{ row.month }}</text>
								<text class="detail-cell">{{ row.payment }}</text>
								<text class="detail-cell">{{ row.principal }}</text>
								<text class="detail-cell">{{ row.interest }}</text>
								<text class="detail-cell">{{ row.remain }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 科普说明 -->
			<view class="edu-card">
				<view class="edu-title"><text>还款方式科普</text></view>
				<view class="edu-item">
					<view class="edu-label-row">
						<view class="edu-dot" style="background:#2979ff;"></view>
						<text class="edu-label">等额本息</text>
					</view>
					<text class="edu-text">每月还款额固定不变，其中本金逐月递增、利息逐月递减。适合收入稳定、预算固定的家庭，便于规划每月支出。</text>
				</view>
				<view class="edu-item">
					<view class="edu-label-row">
						<view class="edu-dot" style="background:#ff7043;"></view>
						<text class="edu-label">等额本金</text>
					</view>
					<text class="edu-text">每月还款额逐月递减，其中本金固定、利息逐月递减。总利息较少，但前期还款压力较大，适合当前收入较高或计划提前还款的人群。</text>
				</view>
			</view>
		</view>

		<!-- ==================== Tab 2: 提前还款 ==================== -->
		<view v-show="mainTab === 1" class="tab-content">
			<view class="card">
				<view class="card-title">原贷款信息</view>

				<view class="form-row">
					<text class="form-label">还款方式</text>
					<view class="seg-control">
						<view
							v-for="(m, i) in methodOptions"
							:key="i"
							class="seg-item"
							:class="{ active: early.method === i }"
							@tap="early.method = i"
						>
							<text class="seg-text" :class="{ active: early.method === i }">{{ m }}</text>
						</view>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">原贷款总额</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="early.amount" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">万元</text>
					</view>
				</view>

				<view class="form-row" @tap="showEarlyPeriodPicker = true">
					<text class="form-label">原贷款期限</text>
					<view class="picker-value">
						<text>{{ early.period }}年（{{ early.period * 12 }}期）</text>
						<text class="arrow">></text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">年利率</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="early.rateDisplay" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">%</text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">已还月数</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="number" v-model="early.paidMonths" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">个月</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">提前还款信息</view>

				<view class="form-row">
					<text class="form-label">提前还款金额</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="early.prepayAmount" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">万元</text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">剩余期限处理</text>
					<view class="seg-control">
						<view
							class="seg-item"
							:class="{ active: early.remainType === 0 }"
							@tap="early.remainType = 0"
						>
							<text class="seg-text" :class="{ active: early.remainType === 0 }">缩短年限</text>
						</view>
						<view
							class="seg-item"
							:class="{ active: early.remainType === 1 }"
							@tap="early.remainType = 1"
						>
							<text class="seg-text" :class="{ active: early.remainType === 1 }">减少月供</text>
						</view>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcEarly">
				<text class="btn-primary-text">计算提前还款</text>
			</view>

			<view class="result-card" v-if="earlyResult.show">
				<view class="result-hero">
					<text class="result-hero-label">{{ early.remainType === 0 ? '新贷款期限' : '新月供金额' }}</text>
					<text class="result-hero-value">
						{{ early.remainType === 0 ? earlyResult.newTermDisplay : earlyResult.newMonthPayment }}
					</text>
					<text class="result-hero-sub" v-if="early.remainType === 1">原月供: {{ earlyResult.oldMonthPayment }} 元</text>
				</view>
				<view class="result-grid">
					<view class="result-grid-item">
						<text class="result-grid-label">原方案总利息</text>
						<text class="result-grid-value">{{ earlyResult.originalTotalInterest }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
					<view class="result-grid-item">
						<text class="result-grid-label">提前还款后利息</text>
						<text class="result-grid-value">{{ earlyResult.newTotalInterest }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
					<view class="result-grid-item highlight">
						<text class="result-grid-label">节省利息</text>
						<text class="result-grid-value">{{ earlyResult.savedInterest }}</text>
						<text class="result-grid-unit">万元</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ==================== Tab 3: 方案对比 ==================== -->
		<view v-show="mainTab === 2" class="tab-content">
			<view class="card" v-for="(s, idx) in compareScenarios" :key="idx">
				<view class="card-title">方案{{ idx + 1 }}</view>

				<view class="form-row">
					<text class="form-label">还款方式</text>
					<view class="seg-control">
						<view
							v-for="(m, mi) in methodOptions"
							:key="mi"
							class="seg-item"
							:class="{ active: s.method === mi }"
							@tap="s.method = mi"
						>
							<text class="seg-text" :class="{ active: s.method === mi }">{{ m }}</text>
						</view>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">贷款金额</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="s.amount" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">万元</text>
					</view>
				</view>

				<view class="form-row" @tap="openComparePeriod(idx)">
					<text class="form-label">贷款期限</text>
					<view class="picker-value">
						<text>{{ s.period }}年（{{ s.period * 12 }}期）</text>
						<text class="arrow">></text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">年利率</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="s.rateDisplay" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">%</text>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcCompare">
				<text class="btn-primary-text">对比方案</text>
			</view>

			<view class="compare-result" v-if="compareResults.length > 0">
				<view class="compare-cards">
					<view class="compare-card" v-for="(r, idx) in compareResults" :key="idx">
						<view class="compare-card-head" :style="{ background: compareColors[idx] }">
							<text class="compare-card-title">方案{{ idx + 1 }}</text>
							<text class="compare-card-method">{{ r.methodName }}</text>
						</view>
						<view class="compare-card-body">
							<view class="compare-row">
								<text class="compare-label">月供</text>
								<text class="compare-val">{{ r.monthPayment }}<text class="compare-unit"> 元</text></text>
							</view>
							<view class="compare-row">
								<text class="compare-label">总利息</text>
								<text class="compare-val">{{ r.totalInterest }}<text class="compare-unit"> 万</text></text>
							</view>
							<view class="compare-row">
								<text class="compare-label">还款总额</text>
								<text class="compare-val">{{ r.totalRepay }}<text class="compare-unit"> 万</text></text>
							</view>
						</view>
					</view>
				</view>

				<!-- 柱状对比条 -->
				<view class="bar-section">
					<view class="bar-title"><text>月供对比</text></view>
					<view class="bar-row" v-for="(r, idx) in compareResults" :key="'mp' + idx">
						<text class="bar-label">方案{{ idx + 1 }}</text>
						<view class="bar-track">
							<view class="bar-fill" :style="{ width: r.monthBarWidth + '%', background: compareColors[idx] }"></view>
						</view>
						<text class="bar-value">{{ r.monthPayment }}</text>
					</view>
				</view>

				<view class="bar-section">
					<view class="bar-title"><text>总利息对比</text></view>
					<view class="bar-row" v-for="(r, idx) in compareResults" :key="'ti' + idx">
						<text class="bar-label">方案{{ idx + 1 }}</text>
						<view class="bar-track">
							<view class="bar-fill" :style="{ width: r.interestBarWidth + '%', background: compareColors[idx] }"></view>
						</view>
						<text class="bar-value">{{ r.totalInterest }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ==================== Tab 4: 还款能力评估 ==================== -->
		<view v-show="mainTab === 3" class="tab-content">
			<view class="card">
				<view class="card-title">家庭财务信息</view>

				<view class="form-row">
					<text class="form-label">家庭月收入</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="assess.income" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">元</text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">月固定支出</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="assess.expense" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">元</text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">目标月供占比</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="assess.ratioDisplay" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">%</text>
					</view>
				</view>

				<view class="form-row">
					<text class="form-label">参考年利率</text>
					<view class="input-suffix-wrap">
						<input class="form-input" type="digit" v-model="assess.rateDisplay" placeholder="请输入" placeholder-class="placeholder" />
						<text class="input-suffix">%</text>
					</view>
				</view>

				<view class="form-row" @tap="showAssessPeriodPicker = true">
					<text class="form-label">期望贷款期限</text>
					<view class="picker-value">
						<text>{{ assess.period }}年（{{ assess.period * 12 }}期）</text>
						<text class="arrow">></text>
					</view>
				</view>
			</view>

			<view class="btn-primary" @tap="calcAssess">
				<text class="btn-primary-text">评估还款能力</text>
			</view>

			<view class="result-card" v-if="assessResult.show">
				<view class="result-hero">
					<text class="result-hero-label">建议最高贷款额度</text>
					<text class="result-hero-value">{{ assessResult.maxLoan }}</text>
					<text class="result-hero-sub">万元</text>
				</view>
				<view class="result-grid">
					<view class="result-grid-item">
						<text class="result-grid-label">建议月供上限</text>
						<text class="result-grid-value">{{ assessResult.maxPayment }}</text>
						<text class="result-grid-unit">元/月</text>
					</view>
					<view class="result-grid-item">
						<text class="result-grid-label">月供收入比</text>
						<text class="result-grid-value">{{ assessResult.actualRatio }}</text>
						<text class="result-grid-unit">%</text>
					</view>
				</view>

				<!-- 压力评级 -->
				<view class="rating-section">
					<view class="rating-title"><text>还款压力评级</text></view>
					<view class="rating-meter">
						<view class="rating-bar">
							<view class="rating-seg" v-for="(seg, i) in ratingSegments" :key="i" :style="{ background: seg.color }"></view>
						</view>
						<view class="rating-indicator" :style="{ left: assessResult.indicatorPosition + '%' }">
							<view class="rating-dot"></view>
						</view>
					</view>
					<view class="rating-labels">
						<text class="rating-label-item">舒适</text>
						<text class="rating-label-item">适中</text>
						<text class="rating-label-item">紧张</text>
						<text class="rating-label-item">超限</text>
					</view>
					<view class="rating-badge" :style="{ background: assessResult.ratingColor, color: '#fff' }">
						<text class="rating-badge-text">{{ assessResult.rating }}</text>
					</view>
					<view class="rating-desc">
						<text class="rating-desc-text">{{ assessResult.ratingDesc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ==================== Pickers ==================== -->

		<!-- Period Picker Mask - Loan Calc -->
		<view class="picker-mask" v-if="showPeriodPicker" @tap="showPeriodPicker = false">
			<view class="picker-panel" @tap.stop>
				<view class="picker-header">
					<text class="picker-cancel" @tap="showPeriodPicker = false">取消</text>
					<text class="picker-confirm" @tap="confirmPeriod">确定</text>
				</view>
				<scroll-view scroll-y class="picker-scroll">
					<view
						v-for="(p, i) in periodRange"
						:key="i"
						class="picker-option"
						:class="{ active: periodPickerTemp === i }"
						@tap="periodPickerTemp = i"
					>
						<text class="picker-option-text">{{ p.label }}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- Period Picker Mask - Early Repayment -->
		<view class="picker-mask" v-if="showEarlyPeriodPicker" @tap="showEarlyPeriodPicker = false">
			<view class="picker-panel" @tap.stop>
				<view class="picker-header">
					<text class="picker-cancel" @tap="showEarlyPeriodPicker = false">取消</text>
					<text class="picker-confirm" @tap="confirmEarlyPeriod">确定</text>
				</view>
				<scroll-view scroll-y class="picker-scroll">
					<view
						v-for="(p, i) in periodRange"
						:key="i"
						class="picker-option"
						:class="{ active: earlyPeriodPickerTemp === i }"
						@tap="earlyPeriodPickerTemp = i"
					>
						<text class="picker-option-text">{{ p.label }}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- Period Picker Mask - Compare -->
		<view class="picker-mask" v-if="showComparePeriodPicker" @tap="showComparePeriodPicker = false">
			<view class="picker-panel" @tap.stop>
				<view class="picker-header">
					<text class="picker-cancel" @tap="showComparePeriodPicker = false">取消</text>
					<text class="picker-confirm" @tap="confirmComparePeriod">确定</text>
				</view>
				<scroll-view scroll-y class="picker-scroll">
					<view
						v-for="(p, i) in periodRange"
						:key="i"
						class="picker-option"
						:class="{ active: comparePeriodPickerTemp === i }"
						@tap="comparePeriodPickerTemp = i"
					>
						<text class="picker-option-text">{{ p.label }}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- Period Picker Mask - Assess -->
		<view class="picker-mask" v-if="showAssessPeriodPicker" @tap="showAssessPeriodPicker = false">
			<view class="picker-panel" @tap.stop>
				<view class="picker-header">
					<text class="picker-cancel" @tap="showAssessPeriodPicker = false">取消</text>
					<text class="picker-confirm" @tap="confirmAssessPeriod">确定</text>
				</view>
				<scroll-view scroll-y class="picker-scroll">
					<view
						v-for="(p, i) in periodRange"
						:key="i"
						class="picker-option"
						:class="{ active: assessPeriodPickerTemp === i }"
						@tap="assessPeriodPickerTemp = i"
					>
						<text class="picker-option-text">{{ p.label }}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mainTab: 0,
			mainTabs: ['贷款计算', '提前还款', '方案对比', '能力评估'],
			loanTypeOptions: ['商业贷款', '公积金贷款', '组合贷款'],
			methodOptions: ['等额本息', '等额本金'],
			loanType: 0,
			method: 0,
			showDetail: false,

			form: {
				amount: '',
				gjjAmount: '',
				period: 20,
				rateDisplay: '3.60',
				gjjRateDisplay: '3.10',
			},

			showPeriodPicker: false,
			showEarlyPeriodPicker: false,
			showComparePeriodPicker: false,
			showAssessPeriodPicker: false,
			periodPickerIndex: 19,
			periodPickerTemp: 19,
			earlyPeriodPickerTemp: 19,
			comparePeriodPickerTemp: 19,
			comparePeriodTarget: 0,
			assessPeriodPickerTemp: 19,

			calcResult: {
				show: false,
				monthPayment: '0',
				lastMonthPayment: '0',
				totalLoan: '0',
				totalRepay: '0',
				totalInterest: '0',
				detailList: [],
			},

			early: {
				method: 0,
				amount: '',
				period: 20,
				rateDisplay: '3.60',
				paidMonths: '',
				prepayAmount: '',
				remainType: 0,
			},

			earlyResult: {
				show: false,
				newTermDisplay: '',
				newMonthPayment: '',
				oldMonthPayment: '',
				originalTotalInterest: '0',
				newTotalInterest: '0',
				savedInterest: '0',
			},

			compareScenarios: [
				{ method: 0, amount: '', period: 20, rateDisplay: '3.60' },
				{ method: 0, amount: '', period: 25, rateDisplay: '3.60' },
				{ method: 0, amount: '', period: 30, rateDisplay: '3.60' },
			],
			compareResults: [],
			compareColors: ['#2979ff', '#ff7043', '#66bb6a'],

			assess: {
				income: '',
				expense: '',
				ratioDisplay: '30',
				rateDisplay: '3.60',
				period: 20,
			},

			assessResult: {
				show: false,
				maxLoan: '0',
				maxPayment: '0',
				actualRatio: '0',
				rating: '',
				ratingColor: '',
				ratingDesc: '',
				indicatorPosition: 0,
			},

			ratingSegments: [
				{ color: '#66bb6a' },
				{ color: '#2979ff' },
				{ color: '#ff9800' },
				{ color: '#f44336' },
			],
		};
	},

	computed: {
		periodRange() {
			const list = [];
			for (let i = 1; i <= 30; i++) {
				list.push({ value: i, label: i + '年（' + (i * 12) + '期）' });
			}
			return list;
		},
		periodDisplay() {
			return this.form.period + '年（' + (this.form.period * 12) + '期）';
		},
	},

	methods: {
		// ========== 核心计算函数 ==========

		// 等额本息月供
		calcEqualInstallment(principal, annualRate, months) {
			const r = annualRate / 12;
			if (r === 0) return principal / months;
			return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
		},

		// 等额本金第k月还款额 (k从0开始)
		calcEqualPrincipalMonth(principal, annualRate, months, k) {
			const r = annualRate / 12;
			const monthlyPrincipal = principal / months;
			const remain = principal - monthlyPrincipal * k;
			return monthlyPrincipal + remain * r;
		},

		// 生成等额本息明细
		genEqualInstallmentDetail(principal, annualRate, months) {
			const r = annualRate / 12;
			const payment = this.calcEqualInstallment(principal, r === 0 ? 0 : annualRate, months);
			const list = [];
			let remain = principal;
			for (let k = 0; k < months; k++) {
				const interest = remain * r;
				const prin = payment - interest;
				remain -= prin;
				if (remain < 0) remain = 0;
				list.push({
					month: k + 1,
					payment: payment.toFixed(2),
					principal: prin.toFixed(2),
					interest: interest.toFixed(2),
					remain: remain.toFixed(2),
				});
			}
			return list;
		},

		// 生成等额本金明细
		genEqualPrincipalDetail(principal, annualRate, months) {
			const r = annualRate / 12;
			const list = [];
			const monthlyPrincipal = principal / months;
			for (let k = 0; k < months; k++) {
				const remain = principal - monthlyPrincipal * k;
				const interest = remain * r;
				const payment = monthlyPrincipal + interest;
				const newRemain = remain - monthlyPrincipal;
				list.push({
					month: k + 1,
					payment: payment.toFixed(2),
					principal: monthlyPrincipal.toFixed(2),
					interest: interest.toFixed(2),
					remain: (newRemain < 0 ? 0 : newRemain).toFixed(2),
				});
			}
			return list;
		},

		// 计算总利息
		calcTotalInterest(principal, annualRate, months, method) {
			if (method === 0) {
				const mp = this.calcEqualInstallment(principal, annualRate, months);
				return mp * months - principal;
			} else {
				const r = annualRate / 12;
				return principal * r * (months + 1) / 2;
			}
		},

		// ========== Tab 1: 贷款计算 ==========

		calcLoan() {
			const amount = parseFloat(this.form.amount) || 0;
			const gjjAmount = parseFloat(this.form.gjjAmount) || 0;
			const rate = parseFloat(this.form.rateDisplay) / 100 || 0;
			const gjjRate = parseFloat(this.form.gjjRateDisplay) / 100 || 0;
			const months = this.form.period * 12;

			let totalPrincipal = 0;
			let detailList = [];

			if (this.loanType === 0) {
				if (amount <= 0) { this.toast('请输入商业贷款金额'); return; }
				totalPrincipal = amount * 10000;
				detailList = this.method === 0
					? this.genEqualInstallmentDetail(totalPrincipal, rate, months)
					: this.genEqualPrincipalDetail(totalPrincipal, rate, months);
			} else if (this.loanType === 1) {
				if (gjjAmount <= 0) { this.toast('请输入公积金贷款金额'); return; }
				totalPrincipal = gjjAmount * 10000;
				detailList = this.method === 0
					? this.genEqualInstallmentDetail(totalPrincipal, gjjRate, months)
					: this.genEqualPrincipalDetail(totalPrincipal, gjjRate, months);
			} else {
				if (amount <= 0 || gjjAmount <= 0) { this.toast('请输入商贷和公积金贷款金额'); return; }
				const syPrincipal = amount * 10000;
				const gjjPrincipal = gjjAmount * 10000;
				totalPrincipal = syPrincipal + gjjPrincipal;
				const syDetail = this.method === 0
					? this.genEqualInstallmentDetail(syPrincipal, rate, months)
					: this.genEqualPrincipalDetail(syPrincipal, rate, months);
				const gjjDetail = this.method === 0
					? this.genEqualInstallmentDetail(gjjPrincipal, gjjRate, months)
					: this.genEqualPrincipalDetail(gjjPrincipal, gjjRate, months);
				for (let i = 0; i < months; i++) {
					detailList.push({
						month: i + 1,
						payment: (parseFloat(syDetail[i].payment) + parseFloat(gjjDetail[i].payment)).toFixed(2),
						principal: (parseFloat(syDetail[i].principal) + parseFloat(gjjDetail[i].principal)).toFixed(2),
						interest: (parseFloat(syDetail[i].interest) + parseFloat(gjjDetail[i].interest)).toFixed(2),
						remain: (parseFloat(syDetail[i].remain) + parseFloat(gjjDetail[i].remain)).toFixed(2),
					});
				}
			}

			const totalInterest = this.calcTotalInterest(totalPrincipal, this.loanType === 1 ? gjjRate : (this.loanType === 2 ? rate : rate), months, this.method);
			// 组合贷款需要分别计算
			let finalTotalInterest;
			if (this.loanType === 2) {
				const syPrincipal = amount * 10000;
				const gjjPrincipal = gjjAmount * 10000;
				const syInterest = this.calcTotalInterest(syPrincipal, rate, months, this.method);
				const gjjInterest = this.calcTotalInterest(gjjPrincipal, gjjRate, months, this.method);
				finalTotalInterest = syInterest + gjjInterest;
			} else {
				finalTotalInterest = totalInterest;
			}

			const totalRepay = finalTotalInterest + totalPrincipal;

			let monthPayment, lastMonthPayment;
			if (this.method === 0) {
				monthPayment = this.calcEqualInstallment(totalPrincipal, this.loanType === 1 ? gjjRate : rate, months);
				lastMonthPayment = monthPayment;
			} else {
				if (this.loanType === 2) {
					// 组合贷款等额本金需要分开算
					const syMonthly = (amount * 10000) / months;
					const gjjMonthly = (gjjAmount * 10000) / months;
					monthPayment = syMonthly + (amount * 10000) * (rate / 12) + gjjMonthly + (gjjAmount * 10000) * (gjjRate / 12);
					lastMonthPayment = syMonthly + (amount * 10000) / months * (rate / 12) + gjjMonthly + (gjjAmount * 10000) / months * (gjjRate / 12);
				} else {
					const p = this.loanType === 0 ? amount * 10000 : gjjAmount * 10000;
					const rt = this.loanType === 0 ? rate : gjjRate;
					monthPayment = this.calcEqualPrincipalMonth(p, rt, months, 0);
					lastMonthPayment = this.calcEqualPrincipalMonth(p, rt, months, months - 1);
				}
			}

			this.calcResult = {
				show: true,
				monthPayment: monthPayment.toFixed(2),
				lastMonthPayment: lastMonthPayment.toFixed(2),
				totalLoan: (totalPrincipal / 10000).toFixed(2),
				totalRepay: (totalRepay / 10000).toFixed(2),
				totalInterest: (finalTotalInterest / 10000).toFixed(2),
				detailList: detailList,
			};
			this.showDetail = false;
		},

		resetLoan() {
			this.form = {
				amount: '',
				gjjAmount: '',
				period: 20,
				rateDisplay: '3.60',
				gjjRateDisplay: '3.10',
			};
			this.calcResult.show = false;
			this.showDetail = false;
		},

		// ========== Tab 2: 提前还款 ==========

		calcEarly() {
			const amount = parseFloat(this.early.amount) || 0;
			const rate = parseFloat(this.early.rateDisplay) / 100 || 0;
			const months = this.early.period * 12;
			const paidM = parseInt(this.early.paidMonths) || 0;
			const prepay = parseFloat(this.early.prepayAmount) * 10000 || 0;

			if (amount <= 0) { this.toast('请输入原贷款总额'); return; }
			if (paidM <= 0) { this.toast('请输入已还月数'); return; }
			if (prepay <= 0) { this.toast('请输入提前还款金额'); return; }
			if (paidM >= months) { this.toast('已还月数不能超过贷款期限'); return; }

			const principal = amount * 10000;
			const r = rate / 12;
			const remainMonths = months - paidM;

			// 计算已还M个月后的剩余本金
			let remainAfterM;
			if (this.early.method === 0) {
				// 等额本息
				const payment = this.calcEqualInstallment(principal, rate, months);
				if (r === 0) {
					remainAfterM = principal - (principal / months) * paidM;
				} else {
					remainAfterM = payment * (1 - Math.pow(1 + r, -remainMonths)) / r;
				}
			} else {
				// 等额本金
				const monthlyP = principal / months;
				remainAfterM = principal - monthlyP * paidM;
			}

			const newRemain = remainAfterM - prepay;
			if (newRemain <= 0) {
				this.toast('提前还款金额已超过剩余本金');
				return;
			}

			// 原方案总利息
			const originalTotalInterest = this.calcTotalInterest(principal, rate, months, this.early.method);

			// 已付利息
			let paidInterest;
			if (this.early.method === 0) {
				// 等额本息已付利息
				const payment = this.calcEqualInstallment(principal, rate, months);
				let paidPr = 0;
				let tmpRemain = principal;
				for (let i = 0; i < paidM; i++) {
					const intPart = tmpRemain * r;
					const prinPart = payment - intPart;
					paidPr += prinPart;
					tmpRemain -= prinPart;
				}
				paidInterest = payment * paidM - paidPr;
			} else {
				// 等额本金已付利息
				const monthlyP = principal / months;
				let paidInt = 0;
				for (let i = 0; i < paidM; i++) {
					const bal = principal - monthlyP * i;
					paidInt += bal * r;
				}
				paidInterest = paidInt;
			}

			// 提前还款后新方案
			let newTotalInterest, newMonthPayment, newTermDisplay;

			if (this.early.remainType === 0) {
				// 缩短年限（月供基本不变）
				if (this.early.method === 0) {
					// 等额本息：保持原月供不变，计算新期限
					const payment = this.calcEqualInstallment(principal, rate, months);
					if (r === 0) {
						const newK = Math.ceil(newRemain / (principal / months));
						newTermDisplay = newK + '个月（' + (newK / 12).toFixed(1) + '年）';
						newTotalInterest = paidInterest + 0; // 无利息
					} else {
						if (payment <= newRemain * r) {
							this.toast('月供不足以覆盖利息，请调整参数');
							return;
						}
						const newK = Math.ceil(-Math.log(1 - newRemain * r / payment) / Math.log(1 + r));
						newTermDisplay = newK + '个月（' + (newK / 12).toFixed(1) + '年）';
						// 新方案总利息（剩余部分）
						let tmpRemain = newRemain;
						let totalIntRemain = 0;
						for (let i = 0; i < newK; i++) {
							const intPart = tmpRemain * r;
							const prinPart = payment - intPart;
							totalIntRemain += intPart;
							tmpRemain -= prinPart;
							if (tmpRemain < 0) tmpRemain = 0;
						}
						newTotalInterest = paidInterest + totalIntRemain;
					}
					newMonthPayment = payment.toFixed(2);
				} else {
					// 等额本金：保持每月本金不变，缩短期限
					const monthlyP = principal / months;
					const newK = Math.ceil(newRemain / monthlyP);
					newTermDisplay = newK + '个月（' + (newK / 12).toFixed(1) + '年）';
					// 新剩余利息
					let totalIntRemain = 0;
					let tmpRemain = newRemain;
					for (let i = 0; i < newK; i++) {
						totalIntRemain += tmpRemain * r;
						tmpRemain -= monthlyP;
						if (tmpRemain < 0) tmpRemain = 0;
					}
					newTotalInterest = paidInterest + totalIntRemain;
					newMonthPayment = (monthlyP + newRemain * r).toFixed(2);
				}
			} else {
				// 减少月供（期限不变）
				if (this.early.method === 0) {
					// 等额本息：期限不变，重新计算月供
					const newPayment = this.calcEqualInstallment(newRemain, rate, remainMonths);
					newMonthPayment = newPayment.toFixed(2);
					let totalIntRemain = newPayment * remainMonths - newRemain;
					newTotalInterest = paidInterest + totalIntRemain;
					newTermDisplay = remainMonths + '个月（不变）';
				} else {
					// 等额本金：期限不变，减少每月本金
					const newMonthlyP = newRemain / remainMonths;
					newMonthPayment = (newMonthlyP + newRemain * r).toFixed(2);
					let totalIntRemain = 0;
					let tmpRemain = newRemain;
					for (let i = 0; i < remainMonths; i++) {
						totalIntRemain += tmpRemain * r;
						tmpRemain -= newMonthlyP;
						if (tmpRemain < 0) tmpRemain = 0;
					}
					newTotalInterest = paidInterest + totalIntRemain;
					newTermDisplay = remainMonths + '个月（不变）';
				}
			}

			const savedInterest = originalTotalInterest - newTotalInterest;

			// 原月供
			let oldMonthPayment;
			if (this.early.method === 0) {
				oldMonthPayment = this.calcEqualInstallment(principal, rate, months);
			} else {
				oldMonthPayment = this.calcEqualPrincipalMonth(principal, rate, months, paidM);
			}

			this.earlyResult = {
				show: true,
				newTermDisplay: newTermDisplay,
				newMonthPayment: newMonthPayment,
				oldMonthPayment: oldMonthPayment.toFixed(2),
				originalTotalInterest: (originalTotalInterest / 10000).toFixed(2),
				newTotalInterest: (newTotalInterest / 10000).toFixed(2),
				savedInterest: (savedInterest / 10000).toFixed(2),
			};
		},

		// ========== Tab 3: 方案对比 ==========

		openComparePeriod(idx) {
			this.comparePeriodTarget = idx;
			this.comparePeriodPickerTemp = this.compareScenarios[idx].period - 1;
			this.showComparePeriodPicker = true;
		},

		confirmComparePeriod() {
			this.compareScenarios[this.comparePeriodTarget].period = this.comparePeriodPickerTemp + 1;
			this.showComparePeriodPicker = false;
		},

		calcCompare() {
			const results = [];
			let validCount = 0;

			for (let i = 0; i < 3; i++) {
				const s = this.compareScenarios[i];
				const amt = parseFloat(s.amount) || 0;
				if (amt <= 0) continue;
				validCount++;

				const principal = amt * 10000;
				const rate = parseFloat(s.rateDisplay) / 100 || 0;
				const months = s.period * 12;

				let monthPayment, totalInterest, totalRepay;
				if (s.method === 0) {
					monthPayment = this.calcEqualInstallment(principal, rate, months);
					totalInterest = monthPayment * months - principal;
					totalRepay = monthPayment * months;
				} else {
					monthPayment = this.calcEqualPrincipalMonth(principal, rate, months, 0);
					const r = rate / 12;
					totalInterest = principal * r * (months + 1) / 2;
					totalRepay = principal + totalInterest;
				}

				results.push({
					methodName: s.method === 0 ? '等额本息' : '等额本金',
					monthPayment: monthPayment.toFixed(2),
					totalInterest: (totalInterest / 10000).toFixed(2),
					totalRepay: (totalRepay / 10000).toFixed(2),
					monthBarWidth: 0,
					interestBarWidth: 0,
				});
			}

			if (results.length === 0) {
				this.toast('请至少填写一个方案的贷款金额');
				return;
			}

			// 计算柱状条宽度
			const maxMP = Math.max(...results.map(r => parseFloat(r.monthPayment)));
			const maxTI = Math.max(...results.map(r => parseFloat(r.totalInterest)));

			for (const r of results) {
				r.monthBarWidth = maxMP > 0 ? Math.max(5, (parseFloat(r.monthPayment) / maxMP) * 100) : 0;
				r.interestBarWidth = maxTI > 0 ? Math.max(5, (parseFloat(r.totalInterest) / maxTI) * 100) : 0;
			}

			this.compareResults = results;
		},

		// ========== Tab 4: 还款能力评估 ==========

		calcAssess() {
			const income = parseFloat(this.assess.income) || 0;
			const expense = parseFloat(this.assess.expense) || 0;
			const ratio = parseFloat(this.assess.ratioDisplay) / 100 || 0;
			const rate = parseFloat(this.assess.rateDisplay) / 100 || 0;
			const months = this.assess.period * 12;

			if (income <= 0) { this.toast('请输入家庭月收入'); return; }

			const maxPayment = income * ratio;
			const actualRatio = income > 0 ? (maxPayment / income * 100) : 0;

			// 反推最高可贷金额（等额本息）
			const r = rate / 12;
			let maxLoan;
			if (r === 0) {
				maxLoan = maxPayment * months;
			} else {
				maxLoan = maxPayment * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
			}

			// 压力评级
			let rating, ratingColor, ratingDesc, indicatorPos;
			if (actualRatio <= 20) {
				rating = '舒适';
				ratingColor = '#66bb6a';
				ratingDesc = '月供占收入比低于20%，还款压力很小，生活质量不会受到明显影响。可以适当提高贷款额度。';
				indicatorPos = actualRatio / 20 * 12.5;
			} else if (actualRatio <= 30) {
				rating = '适中';
				ratingColor = '#2979ff';
				ratingDesc = '月供占收入比20%-30%，还款压力适中，日常生活基本不受影响，是比较理想的贷款状态。';
				indicatorPos = 12.5 + (actualRatio - 20) / 10 * 25;
			} else if (actualRatio <= 50) {
				rating = '紧张';
				ratingColor = '#ff9800';
				ratingDesc = '月供占收入比30%-50%，还款压力较大，可能需要压缩日常开支。建议适当降低贷款额度或延长贷款期限。';
				indicatorPos = 37.5 + (actualRatio - 30) / 20 * 25;
			} else {
				rating = '超限';
				ratingColor = '#f44336';
				ratingDesc = '月供占收入比超过50%，还款压力极大，严重影响生活质量，存在断供风险。强烈建议降低贷款额度。';
				indicatorPos = Math.min(95, 62.5 + (actualRatio - 50) / 50 * 37.5);
			}

			this.assessResult = {
				show: true,
				maxLoan: (maxLoan / 10000).toFixed(2),
				maxPayment: maxPayment.toFixed(2),
				actualRatio: actualRatio.toFixed(1),
				rating: rating,
				ratingColor: ratingColor,
				ratingDesc: ratingDesc,
				indicatorPosition: indicatorPos,
			};
		},

		// ========== Picker 相关 ==========

		onPeriodChange(e) {
			this.periodPickerTemp = e.detail.value;
		},

		confirmPeriod() {
			this.form.period = this.periodPickerTemp + 1;
			this.periodPickerIndex = this.periodPickerTemp;
			this.showPeriodPicker = false;
		},

		confirmEarlyPeriod() {
			this.early.period = this.earlyPeriodPickerTemp + 1;
			this.showEarlyPeriodPicker = false;
		},

		confirmAssessPeriod() {
			this.assess.period = this.assessPeriodPickerTemp + 1;
			this.showAssessPeriodPicker = false;
		},

		// ========== 工具方法 ==========

		toast(msg) {
			uni.showToast({ title: msg, icon: 'none', duration: 2000 });
		},

		formatMoney(num) {
			if (!num && num !== 0) return '0';
			const parts = num.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.');
		},
	},
};
</script>

<style lang="scss" scoped>
$primary: #2979ff;
$primary-dark: #1a5fc9;
$primary-light: #e8f0fe;
$bg: #f4f6fa;
$card-bg: #ffffff;
$text-primary: #1a1a2e;
$text-secondary: #666680;
$text-hint: #9999aa;
$border: #eaeaf0;
$radius: 16rpx;
$radius-sm: 10rpx;
$success: #66bb6a;
$warning: #ff9800;
$danger: #f44336;

.mortgage-page {
	min-height: 100vh;
	background: $bg;
	padding-bottom: 60rpx;
}

/* ========== Tab Bar ========== */
.tab-bar {
	display: flex;
	background: #fff;
	padding: 0 10rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
	position: sticky;
	top: 0;
	z-index: 100;
}
.tab-bar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx 0 20rpx;
	position: relative;
}
.tab-bar-text {
	font-size: 28rpx;
	color: $text-secondary;
	transition: all 0.3s;
}
.tab-bar-item.active .tab-bar-text {
	color: $primary;
	font-weight: 600;
}
.tab-bar-indicator {
	width: 40rpx;
	height: 6rpx;
	border-radius: 3rpx;
	background: $primary;
	margin-top: 8rpx;
}

/* ========== Tab Content ========== */
.tab-content {
	padding: 24rpx;
}

/* ========== Cards ========== */
.card {
	background: $card-bg;
	border-radius: $radius;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
}
.card-title {
	font-size: 32rpx;
	font-weight: 700;
	color: $text-primary;
	margin-bottom: 28rpx;
	padding-left: 16rpx;
	border-left: 6rpx solid $primary;
}

/* ========== Form ========== */
.form-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid $border;
}
.form-row:last-child {
	border-bottom: none;
}
.form-label {
	font-size: 28rpx;
	color: $text-primary;
	flex-shrink: 0;
	margin-right: 20rpx;
}
.input-suffix-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
}
.form-input {
	text-align: right;
	font-size: 28rpx;
	color: $text-primary;
	flex: 1;
	min-width: 0;
}
.input-suffix {
	font-size: 26rpx;
	color: $text-hint;
	margin-left: 10rpx;
	flex-shrink: 0;
}
.picker-value {
	display: flex;
	align-items: center;
}
.picker-value text {
	font-size: 28rpx;
	color: $text-primary;
}
.arrow {
	font-size: 28rpx;
	color: $text-hint;
	margin-left: 10rpx;
}
.placeholder {
	color: #ccc;
}

/* ========== Segmented Control ========== */
.seg-control {
	display: flex;
	background: #f0f2f5;
	border-radius: $radius-sm;
	padding: 4rpx;
}
.seg-item {
	padding: 12rpx 24rpx;
	border-radius: 8rpx;
	transition: all 0.3s;
}
.seg-item.active {
	background: $primary;
	box-shadow: 0 2rpx 8rpx rgba($primary, 0.3);
}
.seg-text {
	font-size: 24rpx;
	color: $text-secondary;
	white-space: nowrap;
}
.seg-text.active {
	color: #fff;
	font-weight: 600;
}

/* ========== LPR Card ========== */
.lpr-card {
	background: linear-gradient(135deg, $primary 0%, #5b9eff 100%);
	border-radius: $radius;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba($primary, 0.25);
}
.lpr-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}
.lpr-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #fff;
}
.lpr-date {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.75);
}
.lpr-body {
	display: flex;
	align-items: center;
}
.lpr-item {
	flex: 1;
	text-align: center;
}
.lpr-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	display: block;
	margin-bottom: 10rpx;
}
.lpr-value {
	font-size: 48rpx;
	font-weight: 800;
	color: #fff;
}
.lpr-divider {
	width: 2rpx;
	height: 70rpx;
	background: rgba(255, 255, 255, 0.25);
}

/* ========== Buttons ========== */
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
.btn-outline {
	border: 2rpx solid $primary;
	border-radius: 40rpx;
	padding: 16rpx 40rpx;
	text-align: center;
}
.btn-outline-text {
	color: $primary;
	font-size: 26rpx;
}

/* ========== Result Card ========== */
.result-card {
	background: $card-bg;
	border-radius: $radius;
	padding: 36rpx 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}
.result-hero {
	text-align: center;
	padding: 36rpx 0 44rpx;
	background: linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 100%);
	border-radius: $radius-sm;
	margin-bottom: 28rpx;
}
.result-hero-label {
	font-size: 26rpx;
	color: $text-secondary;
	display: block;
	margin-bottom: 14rpx;
}
.result-hero-value {
	font-size: 64rpx;
	font-weight: 800;
	color: $primary;
	display: block;
	line-height: 1.2;
}
.result-hero-sub {
	font-size: 24rpx;
	color: $text-hint;
	display: block;
	margin-top: 10rpx;
}
.result-grid {
	display: flex;
	justify-content: space-between;
	margin-bottom: 28rpx;
}
.result-grid-item {
	flex: 1;
	text-align: center;
	padding: 16rpx 8rpx;
}
.result-grid-label {
	font-size: 22rpx;
	color: $text-hint;
	display: block;
	margin-bottom: 10rpx;
}
.result-grid-value {
	font-size: 34rpx;
	font-weight: 700;
	color: $text-primary;
	display: block;
}
.result-grid-item.highlight .result-grid-value {
	color: $danger;
}
.result-grid-unit {
	font-size: 22rpx;
	color: $text-hint;
	display: block;
	margin-top: 4rpx;
}
.result-actions {
	display: flex;
	justify-content: space-around;
	padding-top: 24rpx;
	border-top: 1rpx solid $border;
}

/* ========== Detail Table ========== */
.detail-section {
	margin-top: 28rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid $border;
}
.detail-title {
	margin-bottom: 20rpx;
}
.detail-title text {
	font-size: 28rpx;
	font-weight: 600;
	color: $text-primary;
}
.detail-scroll {
	max-height: 600rpx;
	border: 1rpx solid $border;
	border-radius: $radius-sm;
}
.detail-table {
	min-width: 100%;
}
.detail-row {
	display: flex;
	border-bottom: 1rpx solid #f5f5f5;
}
.detail-header {
	background: #f8f9fc;
	position: sticky;
	top: 0;
}
.detail-cell {
	flex: 1;
	padding: 18rpx 10rpx;
	font-size: 22rpx;
	color: $text-secondary;
	text-align: center;
}
.detail-header .detail-cell {
	font-weight: 600;
	color: $text-primary;
	font-size: 22rpx;
}
.detail-row:nth-child(even) {
	background: #fafbfe;
}

/* ========== Education Card ========== */
.edu-card {
	background: $card-bg;
	border-radius: $radius;
	padding: 32rpx;
	margin-top: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
}
.edu-title {
	margin-bottom: 24rpx;
}
.edu-title text {
	font-size: 30rpx;
	font-weight: 700;
	color: $text-primary;
}
.edu-item {
	margin-bottom: 24rpx;
	padding: 20rpx;
	background: #f8f9fc;
	border-radius: $radius-sm;
}
.edu-item:last-child {
	margin-bottom: 0;
}
.edu-label-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}
.edu-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-right: 12rpx;
}
.edu-label {
	font-size: 28rpx;
	font-weight: 600;
	color: $text-primary;
}
.edu-text {
	font-size: 24rpx;
	color: $text-secondary;
	line-height: 1.7;
}

/* ========== Compare ========== */
.compare-cards {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 32rpx;
}
.compare-card {
	flex: 1;
	min-width: 200rpx;
	background: $card-bg;
	border-radius: $radius;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.compare-card-head {
	padding: 20rpx 24rpx;
}
.compare-card-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #fff;
	display: block;
}
.compare-card-method {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.85);
	display: block;
	margin-top: 6rpx;
}
.compare-card-body {
	padding: 20rpx 24rpx;
}
.compare-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
}
.compare-label {
	font-size: 24rpx;
	color: $text-hint;
}
.compare-val {
	font-size: 28rpx;
	font-weight: 700;
	color: $text-primary;
}
.compare-unit {
	font-size: 22rpx;
	font-weight: 400;
	color: $text-hint;
}

/* ========== Bar Chart ========== */
.bar-section {
	background: $card-bg;
	border-radius: $radius;
	padding: 28rpx 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}
.bar-title {
	margin-bottom: 20rpx;
}
.bar-title text {
	font-size: 28rpx;
	font-weight: 600;
	color: $text-primary;
}
.bar-row {
	display: flex;
	align-items: center;
	margin-bottom: 18rpx;
}
.bar-row:last-child {
	margin-bottom: 0;
}
.bar-label {
	font-size: 24rpx;
	color: $text-secondary;
	width: 100rpx;
	flex-shrink: 0;
}
.bar-track {
	flex: 1;
	height: 32rpx;
	background: #f0f2f5;
	border-radius: 16rpx;
	overflow: hidden;
	margin: 0 16rpx;
}
.bar-fill {
	height: 100%;
	border-radius: 16rpx;
	transition: width 0.5s ease;
	min-width: 10rpx;
}
.bar-value {
	font-size: 24rpx;
	font-weight: 600;
	color: $text-primary;
	width: 140rpx;
	text-align: right;
	flex-shrink: 0;
}

/* ========== Rating ========== */
.rating-section {
	margin-top: 28rpx;
	padding-top: 28rpx;
	border-top: 1rpx solid $border;
}
.rating-title {
	margin-bottom: 24rpx;
}
.rating-title text {
	font-size: 28rpx;
	font-weight: 600;
	color: $text-primary;
}
.rating-meter {
	position: relative;
	margin-bottom: 16rpx;
	padding: 0 8rpx;
}
.rating-bar {
	display: flex;
	height: 16rpx;
	border-radius: 8rpx;
	overflow: hidden;
}
.rating-seg {
	flex: 1;
	height: 100%;
}
.rating-indicator {
	position: absolute;
	top: -6rpx;
	transform: translateX(-50%);
}
.rating-dot {
	width: 28rpx;
	height: 28rpx;
	border-radius: 50%;
	background: #fff;
	border: 4rpx solid $primary;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}
.rating-labels {
	display: flex;
	justify-content: space-between;
	padding: 0 8rpx;
	margin-bottom: 24rpx;
}
.rating-label-item {
	font-size: 22rpx;
	color: $text-hint;
	flex: 1;
	text-align: center;
}
.rating-badge {
	display: inline-block;
	padding: 12rpx 40rpx;
	border-radius: 32rpx;
	margin-bottom: 20rpx;
}
.rating-badge-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #fff;
}
.rating-desc {
	background: #f8f9fc;
	border-radius: $radius-sm;
	padding: 20rpx 24rpx;
}
.rating-desc-text {
	font-size: 24rpx;
	color: $text-secondary;
	line-height: 1.7;
}

/* ========== Custom Picker ========== */
.picker-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
}
.picker-panel {
	width: 100%;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	max-height: 60vh;
	display: flex;
	flex-direction: column;
}
.picker-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 32rpx;
	border-bottom: 1rpx solid $border;
}
.picker-cancel {
	font-size: 30rpx;
	color: $text-hint;
}
.picker-confirm {
	font-size: 30rpx;
	color: $primary;
	font-weight: 600;
}
.picker-scroll {
	max-height: 50vh;
	padding: 0 32rpx;
}
.picker-option {
	padding: 28rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}
.picker-option.active {
	background: $primary-light;
	margin: 0 -32rpx;
	padding: 28rpx 32rpx;
	border-radius: 8rpx;
}
.picker-option-text {
	font-size: 30rpx;
	color: $text-primary;
}
.picker-option.active .picker-option-text {
	color: $primary;
	font-weight: 600;
}

/* ========== Compare Result Wrapper ========== */
.compare-result {
	margin-top: 8rpx;
}
</style>
