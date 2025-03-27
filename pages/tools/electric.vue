<template>
	<view class="tools container">
		<view class="strClass">{{str}}</view>
		<view class="display">
			<view class="inner">{{ number }}</view>
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
     	moreAdd:false,//判断是否连续计算
     	current: -1,
     	number:'0',
     	str:'',
     	symbol:'',
	  FontSize: 24
    };
  },
   
  methods: {
	  
    handleButtonClick(value,type,params) {
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
					console.log(111)
      				that.number = '0';
      				that.complete = false;
					console.log(that.complete)
      			}
      			if (that.symbol) {
					if(that.numberTwo.length>=16){
						this.$refs.uToast.show({
							title: '不能超过16个数字',
							type: 'warning'
						})
						break;
					}
      				that.numberTwo += params;
      				that.number = that.numberTwo;
					console.log(222)
					console.log(that.number)
      			} else {
					
      				if (that.number == '0') {
      					that.number = params;
						console.log(333)
						console.log(that.number)
      				} else {
						if(that.number.length>=16){
							this.$refs.uToast.show({
								title: '不能超过16个数字',
								type: 'warning'
							})
							break;
						}
						console.log(444)
      					that.number += params;
						
						console.log(that.number)
      				}
      			}
      			break;
      		case 'operator':
      		    if(that.moreAdd){
      				that.jsqResult();
      			 }else{
      				that.moreAdd=true; 
      			 }
      			//运算符
      			that.symbol = value;
      			// 改变正负
      			// 负负得正
      			if (params == "opposite") {
      				that.number = -that.number;
      				break;
      			} 
      			if (value != '%') {
      				that.numberOne = that.number;
      				that.numberTwo = '';
      			} else {
      				that.number = parseFloat(that.number) / 100;
      			}
      			break;
      		case 'equal': //等号 
      				that.jsqResult();
      				that.moreAdd=false;
      			break;
      		case 'clear': //清除符
      				that.clear();
      			break;
      	}
      	if(!this.numberOne && !this.complete){
      		this.str = this.number
      	}else if(!this.complete){
      		this.str = this.numberOne + this.symbol + this.numberTwo
      	}
    },
    /*** 计算结果* */
    jsqResult(){
          let that = this;
    	if (that.symbol == '-') {
    		that.number = that.subtraction(that.numberOne, that.numberTwo);
    	} else if (that.symbol == '+') {
    		that.number = that.addition(that.numberOne, that.numberTwo);
    	} else if (that.symbol == '*') {
    		that.number = that.multiplication(that.numberOne, that.numberTwo);
    	} else if (that.symbol == '/') {
    		that.number = that.division(that.numberOne, that.numberTwo);
    	} else if (that.symbol == '%') {
    		that.number = parseFloat(that.number) / 1;
    	}
    	this.str = this.numberOne + this.symbol + this.numberTwo + '='
    	that.complete = true;
    	that.numberOne = '';
    	that.numberTwo = '';
    	that.symbol = '';
    },
    /*** 清除* */
    clear() {
    	let that = this;
    	that.number = '0';
    	that.str = '0';
    	that.numberOne = '';
    	that.numberTwo = '';
    	that.symbol = '';
    	that.compile = false;
    },
    division(arg1, arg2) {
    	 return new Decimal(arg1).div(new Decimal(arg2))
    },
    /*** 乘法* */
    multiplication(arg1, arg2) {
    	return new Decimal(arg1).mul(new Decimal(arg2))
    },
    /*** 加法* */
    addition(arg1, arg2) {
    	return new Decimal(arg1).add(new Decimal(arg2))
    },
    /*** 减法* */
    subtraction(arg1, arg2) {
    	 return new Decimal(arg1).sub(new Decimal(arg2))
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