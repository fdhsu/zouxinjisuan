<template>
	<view class="tax-page">
		<view class="tab-bar">
			<view v-for="(tab, idx) in mainTabs" :key="idx" class="tab-bar-item" :class="{ active: mainTab === idx }" @tap="mainTab = idx">
				<text class="tab-bar-text">{{ tab }}</text>
				<view v-if="mainTab === idx" class="tab-bar-indicator"></view>
			</view>
		</view>

		<!-- Tab 0: 个人所得税 -->
		<view v-show="mainTab === 0" class="tab-content">
			<view class="card">
				<view class="card-title">收入信息</view>
				<view class="form-row">
					<text class="form-label">月收入(税前)</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="salary" placeholder="请输入" @input="calcIncomeTax" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">三险一金(月)</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="socialInsurance" placeholder="个人缴纳" @input="calcIncomeTax" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">起征点</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="threshold" placeholder="5000" @input="calcIncomeTax" />
						<text class="unit">元/月</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">专项附加扣除(月)</view>
				<view class="form-row" v-for="(item, idx) in deductionItems" :key="idx">
					<text class="form-label">{{ item.label }}</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="item.value" placeholder="0" @input="calcIncomeTax" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="deduction-hint">
					<text class="hint-text">* 大病医疗为年度金额，系统自动除以12摊入月度</text>
				</view>
			</view>

			<view class="result-card" v-if="incomeResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">年度汇算</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ fmt(incomeResult.annualTax) }}</text>
					<text class="result-main-label">年度应缴个税(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">月均个税</text>
						<text class="result-row-value">{{ fmt(incomeResult.monthlyTax) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">年度税前收入</text>
						<text class="result-row-value">{{ fmt(incomeResult.annualIncome) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">年度税后收入</text>
						<text class="result-row-value">{{ fmt(incomeResult.afterTax) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">应纳税所得额</text>
						<text class="result-row-value">{{ fmt(incomeResult.taxable) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">适用税率 / 速算扣除数</text>
						<text class="result-row-value">{{ incomeResult.rate }}% / {{ incomeResult.quickDeduction }}</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">综合所得个税税率表</view>
				<view class="table-wrap">
					<view class="table-header">
						<text class="col-level">级数</text>
						<text class="col-range">应纳税所得额</text>
						<text class="col-rate">税率</text>
						<text class="col-deduction">速算扣除数</text>
					</view>
					<view class="table-row" v-for="(r, i) in taxBrackets" :key="i">
						<text class="col-level">{{ i + 1 }}</text>
						<text class="col-range">{{ r.range }}</text>
						<text class="col-rate">{{ r.rate }}%</text>
						<text class="col-deduction">{{ r.qd }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 1: 年终奖 -->
		<view v-show="mainTab === 1" class="tab-content">
			<view class="card">
				<view class="card-title">年终奖信息</view>
				<view class="form-row">
					<text class="form-label">年终奖金额</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="bonus.amount" placeholder="请输入" @input="calcBonus" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">当月工资(税前)</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="bonus.salary" placeholder="请输入" @input="calcBonus" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">计税方式</text>
					<view class="seg-control">
						<view v-for="(m, i) in bonus.methods" :key="i" class="seg-item" :class="{ active: bonus.method === i }" @tap="bonus.method = i; calcBonus()">
							<text class="seg-text" :class="{ active: bonus.method === i }">{{ m }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="result-card" v-if="bonusResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">{{ bonus.methods[bonus.method] }}</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ fmt(bonusResult.tax) }}</text>
					<text class="result-main-label">应缴个税(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">税后奖金</text>
						<text class="result-row-value">{{ fmt(bonusResult.afterTax) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">适用税率</text>
						<text class="result-row-value">{{ bonusResult.rate }}%</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">实际税负率</text>
						<text class="result-row-value">{{ bonusResult.effectiveRate }}%</text>
					</view>
				</view>
				<view class="warning-box" v-if="bonusResult.warning">
					<text class="warning-text">{{ bonusResult.warning }}</text>
				</view>
			</view>

			<view class="compare-card" v-if="bonusCompare.show">
				<view class="card-title">两种计税方式对比</view>
				<view class="compare-row">
					<text class="compare-label">单独计税</text>
					<text class="compare-value">{{ fmt(bonusCompare.separate) }} 元</text>
					<text class="compare-tag" :class="{ better: bonusCompare.better === 0 }">更优</text>
				</view>
				<view class="compare-row">
					<text class="compare-label">并入综合</text>
					<text class="compare-value">{{ fmt(bonusCompare.merged) }} 元</text>
					<text class="compare-tag" :class="{ better: bonusCompare.better === 1 }">更优</text>
				</view>
				<view class="compare-save">
					<text class="compare-save-text">选择{{ bonusCompare.better === 0 ? '单独计税' : '并入综合' }}可节省 {{ fmt(Math.abs(bonusCompare.separate - bonusCompare.merged)) }} 元</text>
				</view>
			</view>

			<view class="card">
				<view class="card-title">年终奖盲区提示</view>
				<view class="blind-table">
					<view class="table-header">
						<text class="bt-col1">临界点</text>
						<text class="bt-col2">盲区范围</text>
					</view>
					<view class="table-row" v-for="(b, i) in blindSpots" :key="i">
						<text class="bt-col1">{{ b.critical }}</text>
						<text class="bt-col2">{{ b.range }}</text>
					</view>
				</view>
				<view class="tip-box">
					<text class="tip-text">年终奖多发1元可能导致多缴数千税款，建议避开盲区发放。</text>
				</view>
			</view>
		</view>

		<!-- Tab 2: 增值税 -->
		<view v-show="mainTab === 2" class="tab-content">
			<view class="card">
				<view class="card-title">纳税人信息</view>
				<view class="form-row">
					<text class="form-label">纳税人类型</text>
					<view class="seg-control">
						<view v-for="(t, i) in vat.types" :key="i" class="seg-item" :class="{ active: vat.type === i }" @tap="vat.type = i; onVatRateChange(); calcVAT()">
							<text class="seg-text" :class="{ active: vat.type === i }">{{ t }}</text>
						</view>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">金额类型</text>
					<view class="seg-control">
						<view v-for="(t, i) in vat.amountTypes" :key="i" class="seg-item" :class="{ active: vat.amountType === i }" @tap="vat.amountType = i; calcVAT()">
							<text class="seg-text" :class="{ active: vat.amountType === i }">{{ t }}</text>
						</view>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">金额</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="vat.amount" placeholder="请输入" @input="calcVAT" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">税率</text>
					<view class="seg-control wrap">
						<view v-for="(r, i) in currentVatRates" :key="i" class="seg-item" :class="{ active: vat.rateIdx === i }" @tap="vat.rateIdx = i; calcVAT()">
							<text class="seg-text" :class="{ active: vat.rateIdx === i }">{{ r.label }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">附加税费</view>
				<view class="form-row switch-row" v-for="(s, i) in vat.surcharges" :key="i">
					<text class="form-label">{{ s.label }}</text>
					<u-switch v-model="s.enabled" @change="calcVAT" activeColor="#2B7DE9" inactiveColor="#d0d0d0" size="44" />
				</view>
				<view class="form-row" v-if="vat.surcharges[0].enabled">
					<text class="form-label">城建税税率</text>
					<view class="seg-control">
						<view v-for="(r, i) in vat.cityRates" :key="i" class="seg-item" :class="{ active: vat.cityRateIdx === i }" @tap="vat.cityRateIdx = i; calcVAT()">
							<text class="seg-text" :class="{ active: vat.cityRateIdx === i }">{{ r.label }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="result-card" v-if="vatResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ fmt(vatResult.vat) }}</text>
					<text class="result-main-label">增值税额(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">不含税金额</text>
						<text class="result-row-value">{{ fmt(vatResult.exclTax) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">含税金额</text>
						<text class="result-row-value">{{ fmt(vatResult.inclTax) }} 元</text>
					</view>
					<view class="result-row" v-if="vatResult.surchargeTotal > 0">
						<text class="result-row-label">附加税费合计</text>
						<text class="result-row-value">{{ fmt(vatResult.surchargeTotal) }} 元</text>
					</view>
					<view class="result-row" v-if="vatResult.surchargeTotal > 0">
						<text class="result-row-label">税费总计</text>
						<text class="result-row-value">{{ fmt(vatResult.totalTax) }} 元</text>
					</view>
				</view>
				<view class="result-detail" v-if="vatResult.surchargeDetail.length > 0">
					<view class="detail-row" v-for="(d, i) in vatResult.surchargeDetail" :key="i">
						<text class="detail-label">{{ d.name }}</text>
						<text class="detail-value">{{ fmt(d.amount) }} 元</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 3: 企业所得税 -->
		<view v-show="mainTab === 3" class="tab-content">
			<view class="card">
				<view class="card-title">企业信息</view>
				<view class="form-row">
					<text class="form-label">企业类型</text>
					<view class="seg-control">
						<view v-for="(t, i) in corp.types" :key="i" class="seg-item" :class="{ active: corp.type === i }" @tap="corp.type = i; calcCorp()">
							<text class="seg-text" :class="{ active: corp.type === i }">{{ t }}</text>
						</view>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">年度营业收入</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="corp.revenue" placeholder="请输入" @input="calcCorp" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">年度成本费用</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="corp.cost" placeholder="请输入" @input="calcCorp" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">纳税调整增加额</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="corp.adjustAdd" placeholder="调增为正数" @input="calcCorp" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">纳税调整减少额</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="corp.adjustSub" placeholder="调减为正数" @input="calcCorp" />
						<text class="unit">元</text>
					</view>
				</view>
				<view class="form-row">
					<text class="form-label">免税收入</text>
					<view class="input-wrap">
						<input class="form-input" type="digit" v-model="corp.exemptIncome" placeholder="如国债利息" @input="calcCorp" />
						<text class="unit">元</text>
					</view>
				</view>
			</view>

			<view class="result-card" v-if="corpResult.show">
				<view class="result-header">
					<text class="result-title">计算结果</text>
					<text class="result-tag">{{ corp.types[corp.type] }}</text>
				</view>
				<view class="result-main">
					<text class="result-main-value">{{ fmt(corpResult.tax) }}</text>
					<text class="result-main-label">应纳企业所得税(元)</text>
				</view>
				<view class="result-rows">
					<view class="result-row">
						<text class="result-row-label">应纳税所得额</text>
						<text class="result-row-value">{{ fmt(corpResult.taxable) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">适用税率</text>
						<text class="result-row-value">{{ corpResult.rate }}%</text>
					</view>
					<view class="result-row" v-if="corpResult.reduction > 0">
						<text class="result-row-label">减免税额</text>
						<text class="result-row-value">{{ fmt(corpResult.reduction) }} 元</text>
					</view>
					<view class="result-row">
						<text class="result-row-label">税后利润</text>
						<text class="result-row-value">{{ fmt(corpResult.afterTax) }} 元</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title">小型微利企业优惠条件</view>
				<view class="policy-list">
					<view class="policy-item">
						<text class="policy-dot">1</text>
						<text class="policy-text">年度应纳税所得额不超过 300 万元</text>
					</view>
					<view class="policy-item">
						<text class="policy-dot">2</text>
						<text class="policy-text">从业人数不超过 300 人</text>
					</view>
					<view class="policy-item">
						<text class="policy-dot">3</text>
						<text class="policy-text">资产总额不超过 5000 万元</text>
					</view>
				</view>
				<view class="highlight-box">
					<text class="highlight-text">符合小微企业条件：实际税负 5%（应纳税所得额 x 25% x 20%）</text>
				</view>
			</view>

			<view class="card">
				<view class="card-title">企业所得税税率一览</view>
				<view class="table-wrap">
					<view class="table-header">
						<text class="ct-col1">类型</text>
						<text class="ct-col2">税率</text>
						<text class="ct-col3">适用条件</text>
					</view>
					<view class="table-row">
						<text class="ct-col1">一般企业</text>
						<text class="ct-col2">25%</text>
						<text class="ct-col3">法定基本税率</text>
					</view>
					<view class="table-row">
						<text class="ct-col1">小微企业</text>
						<text class="ct-col2">5%</text>
						<text class="ct-col3">所得≤300万</text>
					</view>
					<view class="table-row">
						<text class="ct-col1">高新技术企业</text>
						<text class="ct-col2">15%</text>
						<text class="ct-col3">需认定资质</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mainTab: 0,
			mainTabs: ['个人所得税', '年终奖', '增值税', '企业所得税'],

			// === 个人所得税 ===
			salary: '',
			socialInsurance: '',
			threshold: '5000',
			deductionItems: [
				{ key: 'childEdu', label: '子女教育', value: '' },
				{ key: 'contEdu', label: '继续教育', value: '' },
				{ key: 'housingLoan', label: '住房贷款利息', value: '' },
				{ key: 'housingRent', label: '住房租金', value: '' },
				{ key: 'elderly', label: '赡养老人', value: '' },
				{ key: 'babyCare', label: '婴幼儿照护', value: '' },
				{ key: 'medical', label: '大病医疗(年)', value: '' }
			],
			incomeResult: { show: false, annualTax: 0, monthlyTax: 0, annualIncome: 0, afterTax: 0, taxable: 0, rate: 0, quickDeduction: 0 },
			taxBrackets: [
				{ max: 36000, range: '不超过36,000', rate: 3, qd: 0 },
				{ max: 144000, range: '36,000~144,000', rate: 10, qd: 2520 },
				{ max: 300000, range: '144,000~300,000', rate: 20, qd: 16920 },
				{ max: 420000, range: '300,000~420,000', rate: 25, qd: 31920 },
				{ max: 660000, range: '420,000~660,000', rate: 30, qd: 52920 },
				{ max: 960000, range: '660,000~960,000', rate: 35, qd: 85920 },
				{ max: Infinity, range: '超过960,000', rate: 45, qd: 181920 }
			],

			// === 年终奖 ===
			bonus: { amount: '', salary: '', method: 0, methods: ['单独计税', '并入综合'] },
			bonusResult: { show: false, tax: 0, afterTax: 0, rate: 0, effectiveRate: 0, warning: '' },
			bonusCompare: { show: false, separate: 0, merged: 0, better: 0 },
			bonusBrackets: [
				{ max: 3000, rate: 3, qd: 0 },
				{ max: 12000, rate: 10, qd: 210 },
				{ max: 25000, rate: 20, qd: 1410 },
				{ max: 35000, rate: 25, qd: 2660 },
				{ max: 55000, rate: 30, qd: 4410 },
				{ max: 80000, rate: 35, qd: 7160 },
				{ max: Infinity, rate: 45, qd: 15160 }
			],
			blindSpots: [
				{ critical: '36,000', range: '36,001 ~ 38,567' },
				{ critical: '144,000', range: '144,001 ~ 160,500' },
				{ critical: '300,000', range: '300,001 ~ 318,333' },
				{ critical: '420,000', range: '420,001 ~ 436,500' },
				{ critical: '660,000', range: '660,001 ~ 706,538' },
				{ critical: '960,000', range: '960,001 ~ 1,120,000' }
			],

			// === 增值税 ===
			vat: {
				type: 0,
				types: ['一般纳税人', '小规模纳税人'],
				amountType: 0,
				amountTypes: ['含税金额', '不含税金额'],
				amount: '',
				rateIdx: 0,
				generalRates: [
					{ label: '13%', value: 0.13 },
					{ label: '9%', value: 0.09 },
					{ label: '6%', value: 0.06 }
				],
				smallRates: [
					{ label: '3%', value: 0.03 },
					{ label: '1%', value: 0.01 }
				],
				surcharges: [
					{ key: 'city', label: '城市维护建设税', enabled: true },
					{ key: 'edu', label: '教育费附加(3%)', enabled: true },
					{ key: 'localEdu', label: '地方教育附加(2%)', enabled: true }
				],
				cityRateIdx: 0,
				cityRates: [
					{ label: '7%(市区)', value: 0.07 },
					{ label: '5%(县镇)', value: 0.05 },
					{ label: '1%(其他)', value: 0.01 }
				]
			},
			vatResult: { show: false, vat: 0, exclTax: 0, inclTax: 0, surchargeTotal: 0, totalTax: 0, surchargeDetail: [] },

			// === 企业所得税 ===
			corp: {
				type: 0,
				types: ['一般企业', '小微企业', '高新技术企业'],
				revenue: '',
				cost: '',
				adjustAdd: '',
				adjustSub: '',
				exemptIncome: ''
			},
			corpResult: { show: false, taxable: 0, tax: 0, rate: 0, reduction: 0, afterTax: 0 }
		};
	},
	computed: {
		currentVatRates() {
			return this.vat.type === 0 ? this.vat.generalRates : this.vat.smallRates;
		}
	},
	methods: {
		fmt(n) {
			if (n === 0 || n === undefined || n === null || isNaN(n)) return '0.00';
			return Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},

		getBracket(taxable) {
			for (var i = 0; i < this.taxBrackets.length; i++) {
				if (taxable <= this.taxBrackets[i].max) return this.taxBrackets[i];
			}
			return this.taxBrackets[this.taxBrackets.length - 1];
		},

		getDeductionVal(key) {
			for (var i = 0; i < this.deductionItems.length; i++) {
				if (this.deductionItems[i].key === key) return parseFloat(this.deductionItems[i].value) || 0;
			}
			return 0;
		},

		calcIncomeTax() {
			var salary = parseFloat(this.salary) || 0;
			var social = parseFloat(this.socialInsurance) || 0;
			var threshold = parseFloat(this.threshold) || 5000;
			var medical = this.getDeductionVal('medical');
			var monthlySpecial = 0;
			for (var i = 0; i < this.deductionItems.length; i++) {
				var item = this.deductionItems[i];
				if (item.key !== 'medical') {
					monthlySpecial += parseFloat(item.value) || 0;
				}
			}
			monthlySpecial += medical / 12;

			var annualIncome = salary * 12;
			var annualSocial = social * 12;
			var annualThreshold = threshold * 12;
			var annualSpecial = monthlySpecial * 12;
			var taxable = Math.max(0, annualIncome - annualThreshold - annualSocial - annualSpecial);
			var bracket = this.getBracket(taxable);
			var annualTax = Math.max(0, taxable * bracket.rate / 100 - bracket.qd);

			this.incomeResult = {
				show: true,
				annualTax: Math.round(annualTax * 100) / 100,
				monthlyTax: Math.round(annualTax / 12 * 100) / 100,
				annualIncome: Math.round(annualIncome * 100) / 100,
				afterTax: Math.round((annualIncome - annualSocial - annualTax) * 100) / 100,
				taxable: Math.round(taxable * 100) / 100,
				rate: bracket.rate,
				quickDeduction: bracket.qd
			};
		},

		calcBonusSeparate(amount) {
			var monthly = amount / 12;
			var bracket = this.bonusBrackets[0];
			for (var i = 0; i < this.bonusBrackets.length; i++) {
				if (monthly <= this.bonusBrackets[i].max) { bracket = this.bonusBrackets[i]; break; }
			}
			var tax = Math.max(0, amount * bracket.rate / 100 - bracket.qd);
			var effectiveRate = amount > 0 ? (tax / amount * 100) : 0;
			var warning = '';
			for (var j = 0; j < this.blindSpots.length; j++) {
				var critical = parseFloat(this.blindSpots[j].critical.replace(/,/g, ''));
				if (amount > critical && amount <= critical * 1.05) {
					warning = '奖金金额接近临界点 ' + this.blindSpots[j].critical + ' 元，可能存在税负盲区！';
					break;
				}
			}
			return { tax: Math.round(tax * 100) / 100, afterTax: Math.round((amount - tax) * 100) / 100, rate: bracket.rate, effectiveRate: Math.round(effectiveRate * 100) / 100, warning: warning };
		},

		calcBonusMerged(amount, monthSalary) {
			var annualSalary = monthSalary * 12;
			var totalIncome = annualSalary + amount;
			var threshold = 60000;
			var taxableTotal = Math.max(0, totalIncome - threshold);
			var bracketTotal = this.getBracket(taxableTotal);
			var totalTax = Math.max(0, taxableTotal * bracketTotal.rate / 100 - bracketTotal.qd);
			var taxableSalary = Math.max(0, annualSalary - threshold);
			var bracketSalary = this.getBracket(taxableSalary);
			var salaryTax = Math.max(0, taxableSalary * bracketSalary.rate / 100 - bracketSalary.qd);
			var bonusTax = totalTax - salaryTax;
			var effectiveRate = amount > 0 ? (bonusTax / amount * 100) : 0;
			return { tax: Math.round(Math.max(0, bonusTax) * 100) / 100, afterTax: Math.round((amount - Math.max(0, bonusTax)) * 100) / 100, rate: bracketTotal.rate, effectiveRate: Math.round(effectiveRate * 100) / 100, warning: '' };
		},

		calcBonus() {
			var amount = parseFloat(this.bonus.amount) || 0;
			var salary = parseFloat(this.bonus.salary) || 5000;
			if (amount <= 0) {
				this.bonusResult = { show: false, tax: 0, afterTax: 0, rate: 0, effectiveRate: 0, warning: '' };
				this.bonusCompare = { show: false, separate: 0, merged: 0, better: 0 };
				return;
			}
			var separate = this.calcBonusSeparate(amount);
			var merged = this.calcBonusMerged(amount, salary);
			var current = this.bonus.method === 0 ? separate : merged;
			this.bonusResult = { show: true, tax: current.tax, afterTax: current.afterTax, rate: current.rate, effectiveRate: current.effectiveRate, warning: current.warning };
			this.bonusCompare = { show: true, separate: separate.tax, merged: merged.tax, better: separate.tax <= merged.tax ? 0 : 1 };
		},

		onVatRateChange() {
			this.vat.rateIdx = 0;
		},

		calcVAT() {
			var amount = parseFloat(this.vat.amount) || 0;
			var rates = this.vat.type === 0 ? this.vat.generalRates : this.vat.smallRates;
			var rate = rates[this.vat.rateIdx] ? rates[this.vat.rateIdx].value : 0.13;
			if (amount <= 0) {
				this.vatResult = { show: false, vat: 0, exclTax: 0, inclTax: 0, surchargeTotal: 0, totalTax: 0, surchargeDetail: [] };
				return;
			}
			var exclTax, inclTax, vatAmt;
			if (this.vat.amountType === 0) {
				inclTax = amount;
				exclTax = amount / (1 + rate);
				vatAmt = inclTax - exclTax;
			} else {
				exclTax = amount;
				vatAmt = amount * rate;
				inclTax = amount + vatAmt;
			}
			var detail = [];
			var surchargeTotal = 0;
			if (this.vat.surcharges[0].enabled) {
				var cityRate = this.vat.cityRates[this.vat.cityRateIdx].value;
				var cityAmt = vatAmt * cityRate;
				detail.push({ name: '城建税(' + (cityRate * 100) + '%)', amount: Math.round(cityAmt * 100) / 100 });
				surchargeTotal += cityAmt;
			}
			if (this.vat.surcharges[1].enabled) {
				var eduAmt = vatAmt * 0.03;
				detail.push({ name: '教育费附加(3%)', amount: Math.round(eduAmt * 100) / 100 });
				surchargeTotal += eduAmt;
			}
			if (this.vat.surcharges[2].enabled) {
				var localAmt = vatAmt * 0.02;
				detail.push({ name: '地方教育附加(2%)', amount: Math.round(localAmt * 100) / 100 });
				surchargeTotal += localAmt;
			}
			this.vatResult = {
				show: true,
				vat: Math.round(vatAmt * 100) / 100,
				exclTax: Math.round(exclTax * 100) / 100,
				inclTax: Math.round(inclTax * 100) / 100,
				surchargeTotal: Math.round(surchargeTotal * 100) / 100,
				totalTax: Math.round((vatAmt + surchargeTotal) * 100) / 100,
				surchargeDetail: detail
			};
		},

		calcCorp() {
			var revenue = parseFloat(this.corp.revenue) || 0;
			var cost = parseFloat(this.corp.cost) || 0;
			var addAdj = parseFloat(this.corp.adjustAdd) || 0;
			var subAdj = parseFloat(this.corp.adjustSub) || 0;
			var exempt = parseFloat(this.corp.exemptIncome) || 0;
			var taxable = revenue - cost + addAdj - subAdj - exempt;
			if (taxable <= 0 && revenue <= 0) {
				this.corpResult = { show: false, taxable: 0, tax: 0, rate: 0, reduction: 0, afterTax: 0 };
				return;
			}
			var rate = 25, reduction = 0, tax = 0;
			if (this.corp.type === 0) {
				rate = 25;
				tax = Math.max(0, taxable * 0.25);
			} else if (this.corp.type === 1) {
				rate = 25;
				if (taxable <= 3000000) {
					reduction = Math.max(0, taxable * 0.20);
					tax = Math.max(0, taxable * 0.05);
				} else {
					tax = Math.max(0, taxable * 0.25);
				}
			} else if (this.corp.type === 2) {
				rate = 15;
				tax = Math.max(0, taxable * 0.15);
			}
			this.corpResult = {
				show: true,
				taxable: Math.round(taxable * 100) / 100,
				tax: Math.round(tax * 100) / 100,
				rate: rate,
				reduction: Math.round(reduction * 100) / 100,
				afterTax: Math.round((taxable - tax) * 100) / 100
			};
		}
	}
};
</script>

<style lang="scss" scoped>
$primary: #27AE60;
$primary-light: #2ecc71;
$bg: #F2F5FA;
$card-bg: #fff;
$text: #1a1a2e;
$text-sec: #666;
$text-light: #999;
$border: #f0f0f5;
$radius: 20rpx;

.tax-page { min-height: 100vh; background: $bg; padding-bottom: 60rpx; }

/* Tab Bar */
.tab-bar { display: flex; background: #fff; padding: 0 8rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); position: sticky; top: 0; z-index: 100; }
.tab-bar-item { flex: 1; text-align: center; padding: 24rpx 0 20rpx; position: relative; }
.tab-bar-item.active .tab-bar-text { color: $primary; font-weight: 700; }
.tab-bar-text { font-size: 26rpx; color: $text-sec; }
.tab-bar-indicator { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 48rpx; height: 6rpx; background: $primary; border-radius: 3rpx; }

.tab-content { padding: 24rpx; }

/* Card */
.card { background: $card-bg; border-radius: $radius; padding: 28rpx; margin-bottom: 24rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); }
.card-title { font-size: 30rpx; font-weight: 700; color: $text; margin-bottom: 24rpx; padding-left: 16rpx; border-left: 6rpx solid $primary; }

/* Form */
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 18rpx 0; border-bottom: 1rpx solid $border; &:last-child { border-bottom: none; } }
.form-label { font-size: 28rpx; color: $text-sec; flex-shrink: 0; margin-right: 16rpx; }
.input-wrap { display: flex; align-items: center; flex: 1; justify-content: flex-end; }
.form-input { width: 260rpx; text-align: right; font-size: 28rpx; color: $text; padding: 8rpx 0; }
.unit { font-size: 26rpx; color: $text-light; margin-left: 8rpx; flex-shrink: 0; }
.deduction-hint { padding: 16rpx 0 0; }
.hint-text { font-size: 22rpx; color: $text-light; }

/* Segmented Control */
.seg-control { display: flex; background: #f5f5f5; border-radius: 12rpx; padding: 4rpx; &.wrap { flex-wrap: wrap; gap: 8rpx; } }
.seg-item { flex: 1; padding: 12rpx 16rpx; border-radius: 10rpx; text-align: center; &.active { background: #fff; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08); } }
.seg-text { font-size: 24rpx; color: $text-sec; &.active { color: $primary; font-weight: 600; } }

/* Switch Row */
.switch-row { }

/* Result Card */
.result-card { background: linear-gradient(135deg, $primary, $primary-light); border-radius: $radius; padding: 32rpx 28rpx; margin-bottom: 24rpx; color: #fff; box-shadow: 0 8rpx 24rpx rgba(39,174,96,0.25); }
.compare-card { background: $card-bg; border-radius: $radius; padding: 28rpx; margin-bottom: 24rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); }
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
.result-detail { margin-top: 16rpx; background: rgba(255,255,255,0.1); border-radius: 12rpx; padding: 12rpx 20rpx; }
.detail-row { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 24rpx; opacity: 0.85; }

/* Warning */
.warning-box { margin-top: 16rpx; padding: 16rpx 20rpx; background: rgba(255,255,255,0.2); border-radius: 12rpx; }
.warning-text { font-size: 24rpx; }

/* Compare */
.compare-row { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid $border; &:last-of-type { border-bottom: none; } }
.compare-label { flex: 1; font-size: 28rpx; color: $text-sec; }
.compare-value { font-size: 30rpx; font-weight: 700; color: $text; margin-right: 16rpx; }
.compare-tag { font-size: 22rpx; color: $text-light; padding: 4rpx 12rpx; border-radius: 8rpx; background: #f5f5f5; &.better { color: #fff; background: $primary; } }
.compare-save { margin-top: 16rpx; padding: 16rpx; background: #f0faf4; border-radius: 12rpx; text-align: center; }
.compare-save-text { font-size: 26rpx; color: $primary; font-weight: 600; }

/* Table */
.table-wrap { border: 1rpx solid $border; border-radius: 12rpx; overflow: hidden; }
.table-header { display: flex; background: #f8f9fa; padding: 16rpx 0; border-bottom: 1rpx solid $border; }
.table-row { display: flex; padding: 14rpx 0; border-bottom: 1rpx solid $border; &::last-child { border-bottom: none; } }
.col-level, .col-range, .col-rate, .col-deduction { flex: 1; text-align: center; font-size: 24rpx; color: $text-sec; }
.col-rate { color: $primary; font-weight: 600; }
.table-header .col-level, .table-header .col-range, .table-header .col-rate, .table-header .col-deduction { font-weight: 600; color: $text; }

/* Blind spot table */
.blind-table { border: 1rpx solid $border; border-radius: 12rpx; overflow: hidden; }
.bt-col1, .bt-col2 { flex: 1; text-align: center; font-size: 24rpx; color: $text-sec; }

/* Corp table */
.ct-col1, .ct-col2, .ct-col3 { flex: 1; text-align: center; font-size: 24rpx; color: $text-sec; }
.ct-col2 { color: $primary; font-weight: 600; }

/* Policy */
.policy-list { padding: 0 8rpx; }
.policy-item { display: flex; align-items: center; padding: 14rpx 0; }
.policy-dot { width: 40rpx; height: 40rpx; border-radius: 50%; background: $primary; color: #fff; font-size: 24rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-right: 16rpx; flex-shrink: 0; }
.policy-text { font-size: 26rpx; color: $text-sec; }
.highlight-box { margin-top: 20rpx; padding: 20rpx; background: #f0faf4; border-radius: 12rpx; border-left: 6rpx solid $primary; }
.highlight-text { font-size: 26rpx; color: $primary; font-weight: 600; line-height: 1.6; }

/* Tip */
.tip-box { margin-top: 20rpx; padding: 20rpx; background: #fff8e1; border-radius: 12rpx; border-left: 6rpx solid #ffc107; }
.tip-text { font-size: 24rpx; color: #795548; line-height: 1.6; }
</style>
