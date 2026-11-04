<template>
  <view class="page">
    <!-- Tab Bar -->
    <view class="tab-bar">
      <view class="tab-bar-inner">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @click="switchTab(index)"
        >
          <text class="tab-text">{{ tab }}</text>
        </view>
        <view class="tab-indicator" :style="indicatorStyle"></view>
      </view>
    </view>

    <!-- Tab Content -->
    <scroll-view scroll-y class="tab-content" :scroll-top="tabScrollTop">
      <!-- ==================== Tab 0: 补贴计算 ==================== -->
      <view v-if="currentTab === 0" class="tab-panel">
        <!-- 输入区域 -->
        <view class="card">
          <view class="card-title">补贴计算</view>

          <!-- 省份选择 -->
          <view class="form-group">
            <text class="form-label">选择省份</text>
            <picker
              mode="selector"
              :range="provinces"
              range-key="name"
              :value="selectedProvince"
              @change="onProvinceChange"
            >
              <view class="picker-box">
                <text class="picker-text">{{ provinces[selectedProvince].name }}</text>
                <text class="picker-arrow">&#x25BC;</text>
              </view>
            </picker>
          </view>

          <!-- 出生日期 -->
          <view class="form-group">
            <text class="form-label">婴幼儿出生日期</text>
            <picker
              mode="date"
              :value="birthDate"
              start="2016-01-01"
              :end="todayStr"
              fields="day"
              @change="onDateChange"
            >
              <view class="picker-box">
                <text class="picker-text" :class="{ placeholder: !birthDate }">{{
                  birthDate || '请选择出生日期'
                }}</text>
                <text class="picker-arrow">&#x25BC;</text>
              </view>
            </picker>
          </view>

          <!-- 生育孩次 -->
          <view class="form-group">
            <text class="form-label">生育孩次</text>
            <view class="radio-row">
              <view
                v-for="item in childOrderOptions"
                :key="item.value"
                class="radio-item"
                :class="{ checked: childOrder === item.value }"
                @click="childOrder = item.value"
              >
                <view class="radio-dot" :class="{ active: childOrder === item.value }">
                  <view v-if="childOrder === item.value" class="radio-inner"></view>
                </view>
                <text class="radio-label">{{ item.label }}</text>
              </view>
            </view>
          </view>

          <!-- 独生子女 -->
          <view class="form-group form-row">
            <text class="form-label">独生子女家庭</text>
            <u-switch v-model="isOnlyChild" activeColor="#2B7DE9" inactiveColor="#d0d0d0" size="44" />
          </view>

          <!-- 计算按钮 -->
          <view class="calc-btn" @click="calculate">
            <text class="calc-btn-text">计算补贴金额</text>
          </view>
        </view>

        <!-- 计算结果 -->
        <view v-if="hasResult" class="result-card">
          <view class="result-header">
            <text class="result-label">预计补贴总额</text>
            <view class="result-amount-row">
              <text class="result-symbol">&yen;</text>
              <text class="result-value">{{ formatMoney(result.total) }}</text>
            </view>
          </view>
          <view class="result-divider"></view>
          <view class="result-detail-row">
            <text class="result-detail-label">每月补贴</text>
            <text class="result-detail-value">&yen;{{ formatMoney(result.monthly) }}</text>
          </view>
          <view class="result-detail-row">
            <text class="result-detail-label">补贴月数</text>
            <text class="result-detail-value">{{ result.months }} 个月</text>
          </view>
          <view class="result-detail-row">
            <text class="result-detail-label">截止日期</text>
            <text class="result-detail-value">{{ result.deadline }}</text>
          </view>
        </view>

        <!-- 分项明细 -->
        <view v-if="hasResult" class="card">
          <view class="card-title">分项明细</view>
          <view class="detail-card detail-national">
            <view class="detail-card-label">国家基础补贴</view>
            <view class="detail-card-amount">&yen;{{ formatMoney(result.nationalTotal) }}</view>
            <view class="detail-card-sub">每月 &yen;{{ result.nationalMonthly }}/月</view>
          </view>
          <view class="detail-card detail-provincial">
            <view class="detail-card-label">地方额外补贴</view>
            <view class="detail-card-amount">&yen;{{ formatMoney(result.provincialTotal) }}</view>
            <view class="detail-card-sub"
              >每月 &yen;{{ result.provincialMonthly }}/月</view
            >
          </view>
          <view v-if="childOrder >= 3" class="bonus-row">
            <view class="bonus-tag">
              <text class="bonus-tag-text">三孩加成 &times;1.2</text>
            </view>
          </view>
          <view class="calc-note">
            <text class="calc-note-text"
              >* 实际金额按出生日至满3周岁的精确月数折算，2025年前出生的婴幼儿按政策起始日计算</text
            >
          </view>
        </view>

        <!-- 操作按钮 -->
        <view v-if="hasResult" class="action-row">
          <view class="action-btn action-share" @click="shareResult">
            <text class="action-btn-text">复制分享</text>
          </view>
          <view class="action-btn action-history" @click="openHistory">
            <text class="action-btn-text">查看历史</text>
          </view>
        </view>
      </view>

      <!-- ==================== Tab 1: 各地政策对比 ==================== -->
      <view v-if="currentTab === 1" class="tab-panel">
        <view class="card">
          <view class="card-header-row">
            <text class="card-title">各地补贴标准对比</text>
            <view class="sort-btn" @click="toggleSort">
              <text class="sort-btn-text"
                >{{ sortOrder === 'default' ? '默认' : sortOrder === 'desc' ? '金额从高到低' : '金额从低到高'
                }}{{ sortOrder !== 'asc' ? ' \u2193' : ' \u2191' }}</text
              >
            </view>
          </view>
        </view>

        <view
          v-for="(item, idx) in sortedProvinces"
          :key="idx"
          class="policy-card"
        >
          <view class="policy-card-top">
            <text class="policy-name">{{ item.name }}</text>
            <view class="policy-tag" :class="'tag-' + item.level">
              <text class="policy-tag-text">{{ item.level === 'high' ? '高' : item.level === 'mid' ? '中' : '低' }}</text>
            </view>
          </view>
          <view class="policy-amounts">
            <view class="policy-col">
              <text class="policy-col-label">月补贴</text>
              <text class="policy-col-value">&yen;{{ item.extra }}</text>
            </view>
            <view class="policy-col">
              <text class="policy-col-label">年补贴</text>
              <text class="policy-col-value">&yen;{{ item.extra * 12 }}</text>
            </view>
            <view class="policy-col">
              <text class="policy-col-label">含国家月总额</text>
              <text class="policy-col-value">&yen;{{ 300 + item.extra }}</text>
            </view>
          </view>
          <view v-if="item.note" class="policy-note">
            <text class="policy-note-text">{{ item.note }}</text>
          </view>
        </view>
      </view>

      <!-- ==================== Tab 2: 申领指南 ==================== -->
      <view v-if="currentTab === 2" class="tab-panel">
        <view class="card">
          <view class="card-title">申领流程</view>
          <view class="card-subtitle">按照以下步骤申请育儿补贴</view>
        </view>

        <!-- 所需材料 -->
        <view class="card">
          <view class="card-title">所需材料</view>
          <view class="material-list">
            <view
              v-for="(m, i) in materials"
              :key="i"
              class="material-item"
            >
              <view class="material-dot">
                <text class="material-dot-text">{{ i + 1 }}</text>
              </view>
              <text class="material-text">{{ m }}</text>
            </view>
          </view>
        </view>

        <!-- 申请步骤 -->
        <view v-for="(step, i) in steps" :key="i" class="step-card">
          <view class="step-circle">
            <text class="step-circle-text">{{ i + 1 }}</text>
          </view>
          <view class="step-body">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-desc">{{ step.desc }}</text>
          </view>
        </view>

        <!-- 咨询电话 -->
        <view class="card">
          <view class="card-title">各地卫健委咨询电话</view>
          <view
            v-for="(phone, i) in hotlines"
            :key="i"
            class="hotline-row"
          >
            <text class="hotline-city">{{ phone.city }}</text>
            <text class="hotline-num">{{ phone.tel }}</text>
          </view>
        </view>
      </view>

      <!-- ==================== Tab 3: 常见问题 ==================== -->
      <view v-if="currentTab === 3" class="tab-panel">
        <view v-for="(cat, ci) in faqData" :key="ci" class="faq-category">
          <view class="faq-cat-header">
            <view class="faq-cat-bar"></view>
            <text class="faq-cat-title">{{ cat.category }}</text>
          </view>
          <view
            v-for="(q, qi) in cat.questions"
            :key="qi"
            class="faq-item"
          >
            <view class="faq-q" @click="toggleFaq(ci + '-' + qi)">
              <text class="faq-q-text">{{ q.q }}</text>
              <text class="faq-arrow" :class="{ expanded: expandedFaq === ci + '-' + qi }">&#x25BC;</text>
            </view>
            <view v-if="expandedFaq === ci + '-' + qi" class="faq-a">
              <text class="faq-a-text">{{ q.a }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 历史弹窗 -->
    <view v-if="showHistoryPopup" class="overlay" @click="closeHistory">
      <view class="popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">计算历史</text>
          <text class="popup-close" @click="closeHistory">&#x2715;</text>
        </view>
        <scroll-view scroll-y class="popup-scroll">
          <view v-if="history.length === 0" class="popup-empty">
            <text class="popup-empty-text">暂无历史记录</text>
          </view>
          <view
            v-for="(item, i) in history"
            :key="i"
            class="history-item"
          >
            <view class="history-main">
              <text class="history-province">{{ item.province }}</text>
              <text class="history-date">{{ item.date }}</text>
              <text class="history-order">{{ item.childOrder === 1 ? '一孩' : item.childOrder === 2 ? '二孩' : '三孩' }}</text>
            </view>
            <text class="history-amount">&yen;{{ formatMoney(item.total) }}</text>
          </view>
        </scroll-view>
        <view v-if="history.length > 0" class="popup-footer">
          <view class="clear-btn" @click="clearHistory">
            <text class="clear-btn-text">清空历史</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatMoney, formatDate } from '@/utils/helpers.js';
import { provinces, childOrderOptions, materials, steps, hotlines, faqData } from '@/data/baby-data.js';
export default {
  data() {
    return {
      tabs: ['补贴计算', '政策对比', '申领指南', '常见问题'],
      currentTab: 0,
      provinces: provinces,
      selectedProvince: 0,
      birthDate: '',
      childOrder: 1,
      childOrderOptions: childOrderOptions,
      isOnlyChild: false,
      hasResult: false,
      result: {
        monthly: 0,
        months: 0,
        total: 0,
        nationalMonthly: 0,
        nationalTotal: 0,
        provincialMonthly: 0,
        provincialTotal: 0,
        deadline: '',
        province: '',
        multiplier: 1
      },
      showHistoryPopup: false,
      history: [],
      sortOrder: 'default',
      expandedFaq: '',
      tabScrollTop: 0,
      materials: materials,
      steps: steps,
      hotlines: hotlines,
      faqData: faqData
    }
  },
  computed: {
    todayStr() {
      return this.formatDate(new Date())
    },
    indicatorStyle() {
      return {
        width: 100 / this.tabs.length + '%',
        transform: 'translateX(' + this.currentTab * 100 + '%)'
      }
    },
    sortedProvinces() {
      var list = this.provinces.map(function (p) {
        return { name: p.name, extra: p.extra, note: p.note, level: p.level }
      })
      if (this.sortOrder === 'desc') {
        list.sort(function (a, b) {
          return b.extra - a.extra
        })
      } else if (this.sortOrder === 'asc') {
        list.sort(function (a, b) {
          return a.extra - b.extra
        })
      }
      return list
    }
  },
  onReady() {
    this.loadHistory()
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
      this.tabScrollTop = Date.now()
    },
    onProvinceChange(e) {
      this.selectedProvince = parseInt(e.detail.value)
    },
    onDateChange(e) {
      this.birthDate = e.detail.value
      this.hasResult = false
    },
    calculate() {
      if (!this.birthDate) {
        uni.showToast({ title: '请选择出生日期', icon: 'none' })
        return
      }
      var province = this.provinces[this.selectedProvince]
      var birth = new Date(this.birthDate.replace(/-/g, '/'))
      var policyStart = new Date('2025/01/01')
      var now = new Date()
      var endDate = new Date(birth.getTime())
      endDate.setFullYear(endDate.getFullYear() + 3)
      var effectiveStart = birth > policyStart ? new Date(birth.getTime()) : new Date(policyStart.getTime())
      var months = 0
      if (now >= endDate) {
        months = 0
      } else {
        var sy = effectiveStart.getFullYear()
        var sm = effectiveStart.getMonth()
        var ey = endDate.getFullYear()
        var em = endDate.getMonth()
        months = (ey - sy) * 12 + (em - sm)
        if (months < 0) months = 0
        if (months > 36) months = 36
      }
      var multiplier = this.childOrder >= 3 ? 1.2 : 1
      var nationalBase = 300
      var provincialExtra = province.extra
      var monthly = Math.round((nationalBase * multiplier + provincialExtra) * 100) / 100
      var total = Math.round(monthly * months * 100) / 100
      var nationalMonthly = Math.round(nationalBase * multiplier * 100) / 100
      var provincialMonthly = provincialExtra
      this.result = {
        monthly: monthly,
        months: months,
        total: total,
        nationalMonthly: nationalMonthly,
        nationalTotal: Math.round(nationalMonthly * months * 100) / 100,
        provincialMonthly: provincialMonthly,
        provincialTotal: Math.round(provincialMonthly * months * 100) / 100,
        deadline: this.formatDate(endDate),
        province: province.name,
        multiplier: multiplier
      }
      this.hasResult = true
      this.saveHistory({
        province: province.name,
        date: this.birthDate,
        childOrder: this.childOrder,
        total: total,
        months: months,
        monthly: monthly,
        time: new Date().toLocaleString()
      })
    },
    shareResult() {
      var text =
        '\u{1F476} \u80B2\u513F\u8865\u8D34\u8BA1\u7B97\u7ED3\u679C\n' +
        '\u7701\u4EFD\uFF1A' +
        this.result.province +
        '\n' +
        '\u5B69\u6B21\uFF1A' +
        (this.childOrder === 1 ? '\u4E00\u5B69' : this.childOrder === 2 ? '\u4E8C\u5B69' : '\u4E09\u5B69') +
        '\n' +
        '\u6BCF\u6708\u8865\u8D34\uFF1A' +
        this.result.monthly +
        '\u5143\n' +
        '\u8865\u8D34\u6708\u6570\uFF1A' +
        this.result.months +
        '\u4E2A\u6708\n' +
        '\u9884\u8BA1\u603B\u989D\uFF1A' +
        this.result.total +
        '\u5143\n' +
        '\u5176\u4E2D\u56FD\u5BB6\u57FA\u7840\uFF1A' +
        this.result.nationalTotal +
        '\u5143\uFF0C\u5730\u65B9\u989D\u5916\uFF1A' +
        this.result.provincialTotal +
        '\u5143\n' +
        '\u622A\u6B62\u65E5\u671F\uFF1A' +
        this.result.deadline
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: '\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF0C\u53EF\u7C98\u8D34\u5206\u4EAB', icon: 'none', duration: 2000 })
        }
      })
    },
    loadHistory() {
      try {
        var data = uni.getStorageSync('baby_calc_history')
        if (data) {
          this.history = JSON.parse(data)
        }
      } catch (e) {
        this.history = []
      }
    },
    saveHistory(record) {
      this.history.unshift(record)
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10)
      }
      try {
        uni.setStorageSync('baby_calc_history', JSON.stringify(this.history))
      } catch (e) {
        // ignore storage error
      }
    },
    openHistory() {
      this.showHistoryPopup = true
    },
    closeHistory() {
      this.showHistoryPopup = false
    },
    clearHistory() {
      var self = this
      uni.showModal({
        title: '\u63D0\u793A',
        content: '\u786E\u5B9A\u6E05\u7A7A\u6240\u6709\u8BA1\u7B97\u5386\u53F2\uFF1F',
        success: function (res) {
          if (res.confirm) {
            self.history = []
            uni.removeStorageSync('baby_calc_history')
            self.showHistoryPopup = false
          }
        }
      })
    },
    removeHistoryItem(index) {
      this.history.splice(index, 1)
      try {
        uni.setStorageSync('baby_calc_history', JSON.stringify(this.history))
      } catch (e) {
        // ignore
      }
    },
    toggleSort() {
      if (this.sortOrder === 'default') {
        this.sortOrder = 'desc'
      } else if (this.sortOrder === 'desc') {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = 'default'
      }
    },
    toggleFaq(key) {
      this.expandedFaq = this.expandedFaq === key ? '' : key
    },
    formatDate: formatDate,
    formatMoney: formatMoney
  }
}
</script>

<style lang="scss" scoped>
$primary: #ff6b6b;
$primary-dark: #e55a5a;
$primary-light: #ff8a8a;
$bg: #fef5f5;
$card-bg: #ffffff;
$text-dark: #333333;
$text-mid: #666666;
$text-light: #999999;
$border: #f0e0e0;
$radius: 20rpx;
$shadow: 0 4rpx 24rpx rgba(255, 107, 107, 0.08);

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
}

/* ===== Tab Bar ===== */
.tab-bar {
  flex-shrink: 0;
  background: $card-bg;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.tab-bar-inner {
  display: flex;
  position: relative;
  padding: 0 10rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0 28rpx;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: $text-light;
  transition: color 0.3s;
}

.tab-item.active .tab-text {
  color: $primary;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 6rpx;
  background: linear-gradient(90deg, $primary, $primary-light);
  border-radius: 3rpx;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== Tab Content ===== */
.tab-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-panel {
  padding: 24rpx 24rpx 60rpx;
}

/* ===== Card ===== */
.card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow;
}

.card-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 24rpx;
}

.card-subtitle {
  font-size: 26rpx;
  color: $text-light;
  margin-top: -16rpx;
  margin-bottom: 8rpx;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-title {
    margin-bottom: 0;
  }
}

/* ===== Form ===== */
.form-group {
  margin-bottom: 28rpx;
}

.form-label {
  font-size: 28rpx;
 color: $text-dark;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .form-label {
    margin-bottom: 0;
  }
}

.picker-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #faf5f5;
  border: 2rpx solid $border;
  border-radius: 14rpx;
}

.picker-text {
  font-size: 28rpx;
  color: $text-dark;
  &.placeholder {
    color: $text-light;
  }
}

.picker-arrow {
  font-size: 22rpx;
  color: $text-light;
}

::v-deep picker {
  width: 100%;
}

/* ===== Radio ===== */
.radio-row {
  display: flex;
  gap: 20rpx;
}

.radio-item {
  display: flex;
  align-items: center;
  padding: 18rpx 28rpx;
  background: #faf5f5;
  border: 2rpx solid $border;
  border-radius: 14rpx;
  flex: 1;
  justify-content: center;
  transition: all 0.2s;
  &.checked {
    background: rgba(255, 107, 107, 0.08);
    border-color: $primary;
  }
}

.radio-dot {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 3rpx solid #ccc;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  &.active {
    border-color: $primary;
  }
}

.radio-inner {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: $primary;
}

.radio-label {
  font-size: 28rpx;
  color: $text-dark;
}

/* ===== Switch ===== */

/* ===== Calculate Button ===== */
.calc-btn {
  background: linear-gradient(135deg, $primary, $primary-dark);
  border-radius: 16rpx;
  padding: 28rpx;
  text-align: center;
  margin-top: 8rpx;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 107, 0.3);
  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.calc-btn-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
}

/* ===== Result Card ===== */
.result-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffaaaa 100%);
  border-radius: $radius;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 107, 0.25);
}

.result-header {
  text-align: center;
}

.result-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  display: block;
  margin-bottom: 16rpx;
}

.result-amount-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.result-symbol {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
  margin-right: 4rpx;
}

.result-value {
  font-size: 64rpx;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 2rpx;
}

.result-divider {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.25);
  margin: 28rpx 0;
}

.result-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
}

.result-detail-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.result-detail-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

/* ===== Detail Cards ===== */
.detail-card {
  border-radius: 14rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.detail-national {
  background: linear-gradient(135deg, #fff5f5, #ffebeb);
  border-left: 6rpx solid $primary;
}

.detail-provincial {
  background: linear-gradient(135deg, #f0f7ff, #e6f0ff);
  border-left: 6rpx solid #5b8def;
}

.detail-card-label {
  font-size: 26rpx;
  color: $text-mid;
  margin-bottom: 8rpx;
}

.detail-card-amount {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 4rpx;
}

.detail-card-sub {
  font-size: 24rpx;
  color: $text-light;
}

.bonus-row {
  display: flex;
  margin-top: 8rpx;
  margin-bottom: 8rpx;
}

.bonus-tag {
  background: linear-gradient(135deg, #ff9a56, #ff7a28);
  border-radius: 8rpx;
  padding: 10rpx 24rpx;
}

.bonus-tag-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.calc-note {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid $border;
}

.calc-note-text {
  font-size: 22rpx;
  color: $text-light;
  line-height: 1.6;
}

/* ===== Action Buttons ===== */
.action-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.action-btn {
  flex: 1;
  border-radius: 14rpx;
  padding: 24rpx;
  text-align: center;
  &:active {
    opacity: 0.8;
  }
}

.action-share {
  background: linear-gradient(135deg, $primary, $primary-dark);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.25);
}

.action-share .action-btn-text {
  color: #ffffff;
  font-weight: 600;
  font-size: 28rpx;
}

.action-history {
  background: $card-bg;
  border: 2rpx solid $primary;
}

.action-history .action-btn-text {
  color: $primary;
  font-weight: 600;
  font-size: 28rpx;
}

/* ===== Policy Comparison ===== */
.sort-btn {
  padding: 10rpx 24rpx;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 24rpx;
}

.sort-btn-text {
  font-size: 24rpx;
  color: $primary;
}

.policy-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: $shadow;
}

.policy-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.policy-name {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-dark;
}

.policy-tag {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.tag-high {
  background: rgba(255, 107, 107, 0.12);
}
.tag-high .policy-tag-text {
  color: $primary;
}

.tag-mid {
  background: rgba(255, 170, 50, 0.12);
}
.tag-mid .policy-tag-text {
  color: #e69500;
}

.tag-low {
  background: rgba(100, 180, 100, 0.12);
}
.tag-low .policy-tag-text {
  color: #4caf50;
}

.policy-tag-text {
  font-size: 24rpx;
  font-weight: 600;
}

.policy-amounts {
  display: flex;
  justify-content: space-around;
  padding: 16rpx 0;
  border-top: 1rpx solid $border;
  border-bottom: 1rpx solid $border;
  margin-bottom: 16rpx;
}

.policy-col {
  text-align: center;
}

.policy-col-label {
  font-size: 22rpx;
  color: $text-light;
  display: block;
  margin-bottom: 8rpx;
}

.policy-col-value {
  font-size: 32rpx;
  font-weight: 700;
  color: $primary;
}

.policy-note {
  padding: 4rpx 0;
}

.policy-note-text {
  font-size: 24rpx;
  color: $text-mid;
  line-height: 1.5;
}

/* ===== Guide / Steps ===== */
.material-list {
  padding: 0;
}

.material-item {
  display: flex;
  align-items: flex-start;
  padding: 14rpx 0;
  border-bottom: 1rpx solid #faf0f0;
  &:last-child {
    border-bottom: none;
  }
}

.material-dot {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.material-dot-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}

.material-text {
  font-size: 28rpx;
  color: $text-dark;
  line-height: 1.6;
  flex: 1;
  padding-top: 6rpx;
}

.step-card {
  display: flex;
  background: $card-bg;
  border-radius: $radius;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: $shadow;
}

.step-circle {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

.step-circle-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
}

.step-body {
  flex: 1;
}

.step-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-dark;
  display: block;
  margin-bottom: 10rpx;
}

.step-desc {
  font-size: 26rpx;
  color: $text-mid;
  line-height: 1.7;
}

.hotline-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #faf0f0;
  &:last-child {
    border-bottom: none;
  }
}

.hotline-city {
  font-size: 28rpx;
  color: $text-dark;
  font-weight: 500;
}

.hotline-num {
  font-size: 28rpx;
  color: $primary;
  font-weight: 600;
}

/* ===== FAQ ===== */
.faq-category {
  margin-bottom: 28rpx;
}

.faq-cat-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 0 8rpx;
}

.faq-cat-bar {
  width: 8rpx;
  height: 36rpx;
  background: linear-gradient(180deg, $primary, $primary-light);
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.faq-cat-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-dark;
}

.faq-item {
  background: $card-bg;
  border-radius: 14rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
  box-shadow: $shadow;
}

.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx;
  &:active {
    background: #fef8f8;
  }
}

.faq-q-text {
  font-size: 28rpx;
  color: $text-dark;
  font-weight: 500;
  flex: 1;
  line-height: 1.5;
  margin-right: 16rpx;
}

.faq-arrow {
  font-size: 20rpx;
  color: $text-light;
  transition: transform 0.3s;
  transform: rotate(0deg);
  &.expanded {
    transform: rotate(180deg);
  }
}

.faq-a {
  padding: 0 28rpx 28rpx;
  border-top: 1rpx solid #faf0f0;
}

.faq-a-text {
  font-size: 26rpx;
  color: $text-mid;
  line-height: 1.8;
  padding-top: 20rpx;
}

/* ===== History Popup ===== */
.overlay {
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

.popup {
  width: 100%;
  background: $card-bg;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid $border;
  flex-shrink: 0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-dark;
}

.popup-close {
  font-size: 36rpx;
  color: $text-light;
  padding: 8rpx 16rpx;
}

.popup-scroll {
  flex: 1;
  padding: 24rpx 32rpx;
  max-height: 50vh;
}

.popup-empty {
  text-align: center;
  padding: 80rpx 0;
}

.popup-empty-text {
  font-size: 28rpx;
  color: $text-light;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #faf0f0;
  &:last-child {
    border-bottom: none;
  }
}

.history-main {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.history-province {
  font-size: 28rpx;
  color: $text-dark;
  font-weight: 600;
}

.history-date {
  font-size: 24rpx;
  color: $text-light;
}

.history-order {
  font-size: 22rpx;
  color: $primary;
  background: rgba(255, 107, 107, 0.1);
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.history-amount {
  font-size: 32rpx;
  color: $primary;
  font-weight: 700;
}

.popup-footer {
  padding: 24rpx 32rpx;
  border-top: 1rpx solid $border;
  flex-shrink: 0;
}

.clear-btn {
  text-align: center;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  &:active {
    background: #eee;
  }
}

.clear-btn-text {
  font-size: 28rpx;
  color: $text-mid;
}
</style>
