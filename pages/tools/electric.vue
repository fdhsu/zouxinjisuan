<template>
	<view class="tools container">
		<view class="display">{{ displayValue }}</view>
		    <view class="buttons">
		      <view class="row">
		        <button class="btn operator" @click="handleButtonClick('C')">C</button>
		        <button class="btn operator" @click="handleButtonClick('±')">±</button>
		        <button class="btn operator" @click="handleButtonClick('%')">%</button>
		        <button class="btn operator" @click="handleButtonClick('/')">÷</button>
		      </view>
		      <view class="row">
		        <button class="btn" @click="handleButtonClick('7')">7</button>
		        <button class="btn" @click="handleButtonClick('8')">8</button>
		        <button class="btn" @click="handleButtonClick('9')">9</button>
		        <button class="btn operator" @click="handleButtonClick('*')">×</button>
		      </view>
		      <view class="row">
		        <button class="btn" @click="handleButtonClick('4')">4</button>
		        <button class="btn" @click="handleButtonClick('5')">5</button>
		        <button class="btn" @click="handleButtonClick('6')">6</button>
		        <button class="btn operator" @click="handleButtonClick('-')">−</button>
		      </view>
		      <view class="row">
		        <button class="btn" @click="handleButtonClick('1')">1</button>
		        <button class="btn" @click="handleButtonClick('2')">2</button>
		        <button class="btn" @click="handleButtonClick('3')">3</button>
		        <button class="btn operator" @click="handleButtonClick('+')">+</button>
		      </view>
		      <view class="row">
		        <button class="btn zero" @click="handleButtonClick('0')">0</button>
		        <button class="btn" @click="handleButtonClick('.')">.</button>
		        <button class="btn operator equal" @click="calculateResult">=</button>
		      </view>
		    </view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
  data() {
    return {
      displayValue: '0',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false
    };
  },
  methods: {
    handleButtonClick(value) {
      if (value === 'C') {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        return;
      }

      if (value === '±') {
        this.displayValue = String(parseFloat(this.displayValue) * -1);
        return;
      }

      if (value === '%') {
        this.displayValue = String(parseFloat(this.displayValue) / 100);
        return;
      }

      if (/\d/.test(value)) {
        if (this.waitingForSecondOperand) {
          this.displayValue = value;
          this.waitingForSecondOperand = false;
        } else {
          this.displayValue = this.displayValue === '0' ? value : this.displayValue + value;
        }
      } else if (value === '.') {
        if (!this.displayValue.includes('.')) {
          this.displayValue += value;
        }
      } else {
        if (this.firstOperand === null) {
          this.firstOperand = parseFloat(this.displayValue);
        } else if (this.operator) {
          const result = this.calculate(this.firstOperand, parseFloat(this.displayValue), this.operator);
          this.displayValue = String(result);
          this.firstOperand = result;
        }
        this.operator = value;
        this.waitingForSecondOperand = true;
      }
    },
    calculateResult() {
      if (this.operator && !this.waitingForSecondOperand) {
        const result = this.calculate(this.firstOperand, parseFloat(this.displayValue), this.operator);
        this.displayValue = String(result);
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = true;
      }
    },
    calculate(firstOperand, secondOperand, operator) {
      switch (operator) {
        case '+':
          return firstOperand + secondOperand;
        case '-':
          return firstOperand - secondOperand;
        case '*':
          return firstOperand * secondOperand;
        case '/':
          return firstOperand / secondOperand;
        default:
          return secondOperand;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  	background-color: #F5F5FA;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.display {
  width: 100%;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.buttons {
  width: 100%;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.btn {
  width: 22%;
  height: 80px;
  font-size: 28px;
  border: none;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn:active {
  background-color: rgba(255, 255, 255, 0.7);
}

.zero {
  width: 48%;
}

.operator {
  background-color: #ff9500;
  color: white;
}

.operator:active {
  background-color: #e08900;
}

.equal {
  background-color: #0076FF;
  color: white;
}

.equal:active {
  background-color: #0095FF;
}
</style>