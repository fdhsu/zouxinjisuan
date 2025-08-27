<template>
  <view class="container">
    <view class="title">育儿补贴计算器</view>
    
    <view class="input-section">
      <view class="label">婴幼儿出生日期</view>
      <picker 
        mode="date" 
        :value="birthDate" 
        start="2000-01-01"
        end="2030-12-31"
        fields="day"
        @change="onDateChange"
        class="date-picker"
      >
        <view class="picker-content">
          <text class="picker-text">{{ birthDate || '请选择' }}</text>
          <uni-icons type="arrowdown" size="16" color="#666"></uni-icons>
        </view>
      </picker>
    </view>
    
    <view class="button-section">
      <button 
        class="calculate-btn" 
        @click="calculateSubsidy"
        :disabled="!birthDate"
      >
        计算补贴金额
      </button>
    </view>
    
    <view class="result-section" v-if="showResult">
      <view class="result-title">计算结果</view>
      
      <view class="total-amount">
        <text>婴幼儿可获得的育儿补贴总额为：</text>
        <text class="amount">{{ totalAmount }}元</text>
      </view>
      
      <view class="breakdown">
        <text class="breakdown-title">其中：</text>
        <view class="breakdown-item">
          <text>补贴月数：{{ subsidyMonths }}个月</text>
        </view>
        <view class="breakdown-item">
          <text>每月补贴标准：{{ monthlySubsidy }}元</text>
        </view>
        <view class="breakdown-item">
          <text>总补贴金额：{{ monthlySubsidy }}元 × {{ subsidyMonths }}个月 = {{ totalAmount }}元</text>
        </view>
      </view>
      
      <view class="issuance-info">
        <text>补贴将按年发放，直至孩子年满3周岁。</text>
      </view>
      
      <view class="deadline">
        <text>补贴发放截止日期：{{ deadlineDate }}</text>
      </view>
    </view>
    
    <view class="policy-info">
      <text class="policy-title">政策说明：</text>
      <text class="policy-text">
        国家育儿补贴制度实施方案7月28日公布。从2025年1月1日起，对符合法律法规规定生育的3周岁以下婴幼儿发放补贴，至其年满3周岁。育儿补贴按年发放，现阶段国家基础标准为每孩每年3600元。其中，对2025年1月1日之前出生、不满3周岁的婴幼儿，按应补贴月数折算计发补贴。
        <br>
        <br>
        <b>补贴对象和标准</b><br>
        （一）补贴对象。从2025年1月1日起，对符合法律法规规定生育的3周岁以下婴幼儿发放补贴，至其年满3周岁。
        <br>
        （二）补贴标准。育儿补贴按年发放，现阶段国家基础标准为每孩每年3600元。其中，对2025年1月1日之前出生、不满3周岁的婴幼儿，按应补贴月数折算计发补贴。对按照育儿补贴制度规定发放的育儿补贴免征个人所得税。在最低生活保障对象、特困人员等救助对象认定时，育儿补贴不计入家庭或个人收入。
        <br>
        <br>
        <b>申领程序</b><br>
        育儿补贴由婴幼儿的父母一方或其他监护人按规定向婴幼儿户籍所在地申领。具体程序如下：
        <br>
        （一）申请。申领人填写有关信息，提供婴幼儿的出生医学证明、户口簿等材料，并对所提供信息及材料的真实性、完整性作出承诺。申领人主要通过育儿补贴信息管理系统线上申请，也可线下申请。
        <br>
        （二）初审。婴幼儿户籍所在地乡镇政府（街道办事处）对申请信息进行初审，村（居）民委员会协助做好相关工作。
        <br>
        （三）审核确认。县级卫生健康部门进行审核确认，并将相关信息提供给同级财政部门。<br>
        <br>
        （四）抽查。市级卫生健康部门按一定比例，对补贴对象信息进行抽查。省级卫生健康部门根据需要开展抽查，实行动态监管，确保资金安全。
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      birthDate: '',
      showResult: false,
      totalAmount: 0,
      subsidyMonths: 0,
      monthlySubsidy: 0,
      deadlineDate: ''
    }
  },
  methods: {
    onDateChange(e) {
      this.birthDate = e.detail.value
      this.showResult = false
      // uni.showToast({
      //   title: '已选择日期: ' + this.birthDate,
      //   icon: 'none',
      //   duration: 1000
      // })
    },
    
    calculateSubsidy() {
      if (!this.birthDate) {
        uni.showToast({
          title: '请选择出生日期',
          icon: 'none'
        })
        return
      }
      
      const birthDate = new Date(this.birthDate)
      const policyStartDate = new Date('2025-01-01')
      const now = new Date()
      const threeYearsLater = new Date(birthDate)
      threeYearsLater.setFullYear(birthDate.getFullYear() + 3)
      
      // 计算补贴月数和金额
      let months = 0
      let totalAmount = 0
      
      // 如果孩子出生在2025年1月1日之前
      if (birthDate < policyStartDate) {
        // 计算从2025年1月1日到3周岁的月数
        let currentDate = new Date(policyStartDate)
        while (currentDate < threeYearsLater) {
          months++
          currentDate.setMonth(currentDate.getMonth() + 1)
        }
        
        // 如果孩子已经超过3岁，补贴月数为从2025年1月1日到3周岁的月数
        if (now > threeYearsLater) {
          months = 0
          let tempDate = new Date(policyStartDate)
          while (tempDate < threeYearsLater) {
            months++
            tempDate.setMonth(tempDate.getMonth() + 1)
          }
        }
        
        // 按年标准3600元折算月标准
        const monthlySubsidy = 3600 / 12
        totalAmount = months * monthlySubsidy
        this.monthlySubsidy = monthlySubsidy
      } else {
        // 如果孩子出生在2025年1月1日之后
        let currentDate = new Date(birthDate)
        while (currentDate < threeYearsLater) {
          months++
          currentDate.setMonth(currentDate.getMonth() + 1)
        }
        
        // 如果孩子已经超过3岁，补贴月数为36个月
        if (now > threeYearsLater) {
          months = 36
        }
        
        // 按年标准3600元折算月标准
        const monthlySubsidy = 3600 / 12
        totalAmount = months * monthlySubsidy
        this.monthlySubsidy = monthlySubsidy
      }
      
      this.subsidyMonths = months
      this.totalAmount = Math.round(totalAmount)
      this.deadlineDate = this.formatDate(threeYearsLater)
      this.showResult = true
    },
    
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}/${month}/${day}`
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #007AFF;
  text-align: center;
  margin-bottom: 60rpx;
}

.input-section {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.label {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.picker-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #f8f8f8;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 32rpx;
  color: #333;
}

.picker-text {
  flex: 1;
}

.button-section {
  margin-bottom: 40rpx;
}

.calculate-btn {
  flex: 1;
  text-align: center;
  color: #fff;
  background-color: #3280fc;
  border-color: #1970fc;
  padding: 10upx 0;
}

.calculate-btn[disabled] {
  background-color: #ccc;
  color: #999;
}

.result-section {
  background-color: #e8f4fd;
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.result-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.total-amount {
  margin-bottom: 30rpx;
  font-size: 32rpx;
  color: #333;
}

.amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff4444;
  margin-left: 10rpx;
}

.breakdown {
  margin-bottom: 30rpx;
}

.breakdown-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 20rpx;
}

.breakdown-item {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  padding-left: 20rpx;
}

.issuance-info {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.deadline {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  margin-bottom: 30rpx;
}

.policy-info {
  margin-top: 30rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #e0e0e0;
}

.policy-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.policy-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}
</style>