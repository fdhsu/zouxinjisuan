<template>
	<view class="tools container">
		<view class="display">
			<view class="inner">{{ formattedNumber }}</view>
		</view>
		
		<view class="buttons">
			<view class="row">
				<button class="btn operator" @click="handleButtonClick('C','clear','clear')">C</button>
				<button class="btn operator" @click="handleButtonClick('±','operator','opposite')">±</button>
				<button class="btn operator" @click="handleButtonClick('%','operator','percent')">%</button>
				<button class="btn operator" @click="handleButtonClick('/','operator','divide')">÷</button>
			</view>
			<view class="row">
				<button class="btn" @click="handleButtonClick('7','num','7')">7</button>
				<button class="btn" @click="handleButtonClick('8','num','8')">8</button>
				<button class="btn" @click="handleButtonClick('9','num','9')">9</button>
				<button class="btn operator" @click="handleButtonClick('*','operator','multiply')">×</button>
			</view>
			<view class="row">
				<button class="btn" @click="handleButtonClick('4','num','4')">4</button>
				<button class="btn" @click="handleButtonClick('5','num','5')">5</button>
				<button class="btn" @click="handleButtonClick('6','num','6')">6</button>
				<button class="btn operator" @click="handleButtonClick('-','operator','minus')">−</button>
			</view>
			<view class="row">
				<button class="btn" @click="handleButtonClick('1','num','1')">1</button>
				<button class="btn" @click="handleButtonClick('2','num','2')">2</button>
				<button class="btn" @click="handleButtonClick('3','num','3')">3</button>
				<button class="btn operator" @click="handleButtonClick('+','operator','plus')">+</button>
			</view>
			<view class="row">
				<button class="btn zero" @click="handleButtonClick('0','num','0')">0</button>
				<button class="btn" @click="handleButtonClick('.','string','.')">.</button>
				<button class="btn operator equal" @click="handleButtonClick('=','equal','result')">=</button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import Decimal from 'decimal.js';
export default {
  data() {
    return {
      displayValue: '0',
      numberOne: '', //变量一
      numberTwo: '', //变量二
      symbol: '', //运算符
      complete: false, //判断是否完成一次计算
      moreAdd: false, //判断是否连续计算
      current: -1,
      number: '0',
      str: '',
      symbol: '',
      maxDisplayLength: 30 // 最大显示位数
    };
  },
  
  computed: {
    // 格式化显示的数字，避免科学计数法
    formattedNumber() {
      if (this.number === '') return '0';
      
      // 如果是Decimal对象，转换为字符串
      let numStr = this.number instanceof Decimal ? this.number.toString() : String(this.number);
      
      // 处理科学计数法
      if (numStr.includes('e')) {
        try {
          // 尝试转换为普通数字格式
          numStr = new Decimal(numStr).toFixed(20).replace(/\.?0+$/, '');
        } catch (e) {
          console.error('格式化数字错误:', e);
        }
      }
      
      // 限制显示长度
      if (numStr.length > this.maxDisplayLength) {
        // 如果是小数，优先保留整数部分
        if (numStr.includes('.')) {
          const [integer, decimal] = numStr.split('.');
          if (integer.length >= this.maxDisplayLength) {
            numStr = integer.substring(0, this.maxDisplayLength);
          } else {
            const remaining = this.maxDisplayLength - integer.length - 1;
            numStr = integer + '.' + decimal.substring(0, remaining);
          }
        } else {
          numStr = numStr.substring(0, this.maxDisplayLength);
        }
      }
      
      return numStr;
    }
  },
   
  methods: {
    handleButtonClick(value, type, params) {
      let that = this;
      //判断输入的第一位是否是小数点
      switch (type) {
        case 'string':
          //小数点
          if (that.complete) {
            that.number = '0';
            that.complete = false;
          }
          if (that.symbol) {
            if ((that.number).indexOf('.') == -1) {
              that.numberTwo = that.numberTwo + '.';
              that.number = that.numberTwo;
            }
          } else {
            if ((that.number).indexOf('.') == -1) {
              that.number = that.number + '.';
            }
          }
          break;
        case 'num':
          //数字
          if (that.complete) {
            that.number = '0';
            that.complete = false;
          }
          if (that.symbol) {
            that.numberTwo += params;
            that.number = that.numberTwo;
          } else {
            if (that.number == '0') {
              that.number = params;
            } else {
              if(that.number.length >= this.maxDisplayLength){
                this.$refs.uToast.show({
                  title: `不能超过${this.maxDisplayLength}个数字`,
                  type: 'warning'
                })
                break;
              }
              that.number += params;
            }
          }
          break;
        case 'operator':
          if(that.moreAdd){
            that.jsqResult();
          } else {
            that.moreAdd = true; 
          }
          //运算符
          that.symbol = value;
          // 改变正负
          // 负负得正
          if (params == "opposite") {
            that.number = new Decimal(that.number).negated();
            break;
          } 
          if (value != '%') {
            that.numberOne = that.number;
            that.numberTwo = '';
          } else {
            that.number = new Decimal(that.number).div(100);
          }
          break;
        case 'equal': //等号 
          that.jsqResult();
          that.moreAdd = false;
          break;
        case 'clear': //清除符
          that.clear();
          break;
      }
      
      if(!this.numberOne && !this.complete){
        this.str = this.number
      } else if(!this.complete) {
        this.str = this.numberOne + this.symbol + this.numberTwo
      }
    },
    
    /*** 计算结果* */
    jsqResult() {
      let that = this;
      let result;
      
      // 确保所有操作数都是Decimal类型
      const num1 = new Decimal(that.numberOne || 0);
      const num2 = new Decimal(that.numberTwo || 0);
      
      try {
        if (that.symbol == '-') {
          result = num1.sub(num2);
        } else if (that.symbol == '+') {
          result = num1.add(num2);
        } else if (that.symbol == '*') {
          result = num1.mul(num2);
        } else if (that.symbol == '/') {
          if (num2.equals(0)) {
            this.$refs.uToast.show({
              title: '除数不能为零',
              type: 'error'
            });
            return;
          }
          result = num1.div(num2);
        } else if (that.symbol == '%') {
          result = num1.div(100);
        } else {
          result = new Decimal(that.number);
        }
        
        // 处理结果
        that.number = result;
        this.str = this.numberOne + this.symbol + this.numberTwo + '='
        that.complete = true;
        that.numberOne = '';
        that.numberTwo = '';
        that.symbol = '';
      } catch (error) {
        console.error('计算错误:', error);
        this.$refs.uToast.show({
          title: '计算错误',
          type: 'error'
        });
      }
    },
    
    /*** 清除* */
    clear() {
      let that = this;
      that.number = '0';
      that.str = '0';
      that.numberOne = '';
      that.numberTwo = '';
      that.symbol = '';
      that.complete = false;
    },
    
    division(arg1, arg2) {
      return new Decimal(arg1).div(new Decimal(arg2));
    },
    
    /*** 乘法* */
    multiplication(arg1, arg2) {
      return new Decimal(arg1).mul(new Decimal(arg2));
    },
    
    /*** 加法* */
    addition(arg1, arg2) {
      return new Decimal(arg1).add(new Decimal(arg2));
    },
    
    /*** 减法* */
    subtraction(arg1, arg2) {
      return new Decimal(arg1).sub(new Decimal(arg2));
    },
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #F5F5FA;
}
.strClass{
  position: absolute;
  top:10px;
  right:10px;
  font-size: 16px;
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
  padding: 0 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.inner{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 24px;/* 默认字体大小 */
  width: 100%;
  height: 100px;
  overflow: hidden; /* 防止溢出 */
  text-overflow: ellipsis; /* 超长显示为省略号 */
  white-space: nowrap; /* 禁止换行 */
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