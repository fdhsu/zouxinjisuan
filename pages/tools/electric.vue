<template>
	<view class="tools container">
		<!-- 表达式显示 -->
		<view class="expression">{{ expression }}</view>
		
		<!-- 主显示区 -->
		<view class="display">
			<view class="inner">{{ formattedNumber }}</view>
		</view>
		
		<!-- 科学函数面板（可折叠） -->
		<view v-if="showScientific" class="sci-panel">
			<view class="row sci-row">
				<button class="btn sci" @click="handleSci('deg')">DEG</button>
				<button class="btn sci" @click="handleSci('sin')">sin</button>
				<button class="btn sci" @click="handleSci('cos')">cos</button>
				<button class="btn sci" @click="handleSci('tan')">tan</button>
				<button class="btn sci" @click="handleSci('backspace')" style="font-size:20px;">⌫</button>
			</view>
			<view class="row sci-row">
				<button class="btn sci" @click="handleSci('rad')">RAD</button>
				<button class="btn sci" @click="handleSci('log')">log</button>
				<button class="btn sci" @click="handleSci('ln')">ln</button>
				<button class="btn sci" @click="handleSci('sqrt')">√</button>
				<button class="btn sci" @click="handleSci('pow')">xʸ</button>
			</view>
			<view class="row sci-row">
				<button class="btn sci" @click="handleSci('pi')">π</button>
				<button class="btn sci" @click="handleSci('e')">e</button>
				<button class="btn sci" @click="handleSci('lparen')">(</button>
				<button class="btn sci" @click="handleSci('rparen')">)</button>
				<button class="btn sci" @click="handleSci('fact')">n!</button>
			</view>
			<view class="row sci-row">
				<button class="btn sci" @click="handleSci('sq')">x²</button>
				<button class="btn sci" @click="handleSci('exp')">eˣ</button>
				<button class="btn sci" @click="handleSci('tenx')">10ˣ</button>
				<button class="btn sci" @click="handleSci('inv')">1/x</button>
				<button class="btn sci" @click="handleSci('abs')">|x|</button>
			</view>
		</view>
		
		<!-- 基本计算器按钮 -->
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
			<!-- 科学模式切换按钮 -->
			<view class="row">
				<button class="btn toggle-btn" @click="toggleScientific">
					{{ showScientific ? '收起' : '科学' }}
				</button>
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
			number: '0',
			numberOne: '',
			numberTwo: '',
			symbol: '',
			complete: false,
			moreAdd: false,
			str: '',
			maxDisplayLength: 30,
			showScientific: false,
			angleMode: 'deg', // 'deg' or 'rad'
			expression: ''
		};
	},
	
	computed: {
		formattedNumber() {
			if (this.number === '') return '0';
			
			let numStr = this.number instanceof Decimal ? this.number.toString() : String(this.number);
			
			if (numStr.includes('e')) {
				try {
					numStr = new Decimal(numStr).toFixed(20).replace(/\.?0+$/, '');
				} catch (e) {
					console.error('格式化数字错误:', e);
				}
			}
			
			if (numStr.length > this.maxDisplayLength) {
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
		toggleScientific() {
			this.showScientific = !this.showScientific;
		},
		
		handleSci(func) {
			switch (func) {
				case 'deg':
					this.angleMode = 'deg';
					break;
				case 'rad':
					this.angleMode = 'rad';
					break;
				case 'backspace':
					this.backspace();
					break;
				case 'sin':
				case 'cos':
				case 'tan':
				case 'log':
				case 'ln':
				case 'sqrt':
				case 'sq':
				case 'exp':
				case 'tenx':
				case 'inv':
				case 'abs':
				case 'fact':
					this.applyUnaryFunction(func);
					break;
				case 'pi':
					this.insertConstant('3.14159265358979323846');
					break;
				case 'e':
					this.insertConstant('2.71828182845904523536');
					break;
				case 'lparen':
					this.insertChar('(');
					break;
				case 'rparen':
					this.insertChar(')');
					break;
				case 'pow':
					this.handleButtonClick('^', 'operator', 'power');
					break;
			}
		},
		
		backspace() {
			if (this.complete) {
				this.clear();
				return;
			}
			if (this.symbol && this.numberTwo !== '') {
				this.numberTwo = this.numberTwo.slice(0, -1);
				this.number = this.numberTwo || '0';
			} else if (!this.symbol) {
				this.number = this.number.slice(0, -1) || '0';
			}
		},
		
		insertConstant(val) {
			if (this.complete) {
				this.number = val;
				this.complete = false;
			} else if (this.symbol) {
				this.numberTwo = val;
				this.number = val;
			} else {
				this.number = val;
			}
		},
		
		insertChar(ch) {
			if (this.complete) {
				this.number = ch;
				this.complete = false;
			} else if (this.symbol) {
				this.numberTwo += ch;
				this.number = this.numberTwo;
			} else {
				this.number += ch;
			}
		},
		
		applyUnaryFunction(func) {
			let that = this;
			let val = new Decimal(that.number);
			let result;
			
			try {
				switch (func) {
					case 'sin':
						result = that.angleMode === 'deg' 
							? Decimal.sin(val.mul(Math.PI / 180)) 
							: Decimal.sin(val);
						break;
					case 'cos':
						result = that.angleMode === 'deg' 
							? Decimal.cos(val.mul(Math.PI / 180)) 
							: Decimal.cos(val);
						break;
					case 'tan':
						result = that.angleMode === 'deg' 
							? Decimal.tan(val.mul(Math.PI / 180)) 
							: Decimal.tan(val);
						break;
					case 'log':
						result = Decimal.log10(val);
						break;
					case 'ln':
						result = Decimal.ln(val);
						break;
					case 'sqrt':
						result = Decimal.sqrt(val);
						break;
					case 'sq':
						result = val.pow(2);
						break;
					case 'exp':
						result = Decimal.exp(val);
						break;
					case 'tenx':
						result = new Decimal(10).pow(val);
						break;
					case 'inv':
						if (val.equals(0)) {
							that.$refs.uToast.show({ title: '除数不能为零', type: 'error' });
							return;
						}
						result = new Decimal(1).div(val);
						break;
					case 'abs':
						result = val.abs();
						break;
					case 'fact':
						result = that.factorial(val);
						break;
				}
				
				that.number = result;
				that.complete = true;
			} catch (error) {
				console.error('计算错误:', error);
				that.$refs.uToast.show({ title: '计算错误', type: 'error' });
			}
		},
		
		factorial(n) {
			if (n.lessThan(0)) throw new Error('负数无阶乘');
			if (!n.isInteger()) throw new Error('阶乘仅支持整数');
			if (n.greaterThan(170)) throw new Error('数值过大');
			
			let result = new Decimal(1);
			for (let i = new Decimal(2); i.lessThanOrEqualTo(n); i = i.plus(1)) {
				result = result.mul(i);
			}
			return result;
		},
		
		handleButtonClick(value, type, params) {
			let that = this;
			
			switch (type) {
				case 'string':
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
							if (that.number.length >= this.maxDisplayLength) {
								this.$refs.uToast.show({
									title: `不能超过${this.maxDisplayLength}个数字`,
									type: 'warning'
								});
								break;
							}
							that.number += params;
						}
					}
					break;
					
				case 'operator':
					if (that.moreAdd) {
						that.jsqResult();
					} else {
						that.moreAdd = true;
					}
					that.symbol = value;
					
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
					
				case 'equal':
					that.jsqResult();
					that.moreAdd = false;
					break;
					
				case 'clear':
					that.clear();
					break;
			}
			
			if (!this.numberOne && !this.complete) {
				this.str = this.number;
			} else if (!this.complete) {
				this.str = this.numberOne + this.symbol + this.numberTwo;
			}
			this.expression = this.str;
		},
		
		jsqResult() {
			let that = this;
			let result;
			
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
						this.$refs.uToast.show({ title: '除数不能为零', type: 'error' });
						return;
					}
					result = num1.div(num2);
				} else if (that.symbol == '^') {
					result = num1.pow(num2);
				} else if (that.symbol == '%') {
					result = num1.div(100);
				} else {
					result = new Decimal(that.number);
				}
				
				that.number = result;
				this.str = this.numberOne + this.symbol + this.numberTwo + '=';
				this.expression = this.str;
				that.complete = true;
				that.numberOne = '';
				that.numberTwo = '';
				that.symbol = '';
			} catch (error) {
				console.error('计算错误:', error);
				this.$refs.uToast.show({ title: '计算错误', type: 'error' });
			}
		},
		
		clear() {
			let that = this;
			that.number = '0';
			that.str = '0';
			that.expression = '';
			that.numberOne = '';
			that.numberTwo = '';
			that.symbol = '';
			that.complete = false;
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
	padding: 20px;
	min-height: 100vh;
}

.expression {
	width: 100%;
	text-align: right;
	font-size: 14px;
	color: #888;
	min-height: 20px;
	margin-bottom: 4px;
	padding: 0 10px;
	word-break: break-all;
}

.display {
	width: 100%;
	height: 100px;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 15px;
	padding: 0 20px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.inner {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 24px;
	width: 100%;
	height: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 科学函数面板 */
.sci-panel {
	width: 100%;
	margin-bottom: 10px;
}
.sci-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}
.btn.sci {
	width: 18%;
	height: 44px;
	font-size: 16px;
	border: none;
	border-radius: 10px;
	background-color: rgba(43, 125, 233, 0.15);
	color: #2B7DE9;
	cursor: pointer;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}
.btn.sci:active {
	background-color: rgba(43, 125, 233, 0.25);
}

.buttons {
	width: 100%;
}

.row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12px;
}

.btn {
	width: 22%;
	height: 70px;
	font-size: 24px;
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

.toggle-btn {
	width: 100%;
	height: 44px;
	font-size: 16px;
	background-color: rgba(43, 125, 233, 0.1);
	color: #2B7DE9;
	border-radius: 10px;
	margin-top: 4px;
}
.toggle-btn:active {
	background-color: rgba(43, 125, 233, 0.2);
}
</style>
