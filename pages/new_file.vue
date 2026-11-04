{
	"easycom": {
		"^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
	},
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
		    "path" : "pages/index/index",
		    "style" :                                                                                    
		    {
		        "navigationBarTitleText": "首页"
		    }
		    
		},{
		    "path" : "pages/home/home",
		    "style" :                                                                                    
		    {
		        "navigationBarTitleText": "每日一句"
		    }
		    
		},
		{
		    "path" : "pages/index/me",
		    "style" :                                                                                    
		    {
		        "navigationBarTitleText": "个人中心"
		    }
		    
		},
		
		{
		    "path" : "pages/tools/electric",
		    "style" : {
		        "navigationBarTitleText" : "简易计算器"
		    }
		},
		{
		    "path" : "pages/login/register",
		    "style" : {
		        "navigationBarTitleText" : "注册用户",
		        "app-plus" : {
		            "titleNView" : false
		        }
		    }
		},
		{
		    "path" : "pages/tools/font",
		    "style" : {
		        "navigationBarTitleText" : "简繁转换"
		    }
		},
		{
		    "path" : "pages/tools/house",
		    "style" : {
		        "navigationBarTitleText" : "房贷计算器"
		    }
		},
		{
			"path": "pages/login/privacy",
			"style": {
				"navigationBarTitleText": "隐私协议"
			}
		},
		{
			"path": "pages/login/login",
			"style": {
				"navigationBarTitleText": "登录"
			}
		},
		{
			"path": "pages/login/register",
			"style": {
				"navigationBarTitleText": "注册"
			}
		},
		{
			"path": "pages/me/set",
			"style": {
				"navigationBarTitleText": "设置"
			}
		},
		{
		    "path" : "pages/me/gywm",
		    "style" : {
				"navigationBarTitleText": "关于我们"
			}
		},
	    
        {
        	"path" : "pages/index/webview",
        	"style" : 
        	{
        		"navigationBarTitleText" : ""
        	}
        }
    ],
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#FFFFFF",
		"backgroundColor": "#FFFFFF",
		"app-plus": {
		    "titleNView": {
		    "titleSize": "17px"
		    }
		}
	},
	"tabBar": {
		"color": "#aaaaaa",
		"selectedColor": "#666666",
		"borderStyle": "black",
		"backgroundColor": "#ffffff",
		"list": [
			{
		 	"pagePath": "pages/index/index",
		 	"iconPath": "static/tabBar/index.png",
		 	"selectedIconPath": "static/tabBar/index_cur.png",
		 	"text": "首页"
			},
			{
				"pagePath": "pages/home/home",
				"iconPath": "static/tabBar/shop.png",
				"selectedIconPath": "static/tabBar/shop_cur.png",
				"text": "今日语句"
			},
			{
				"pagePath": "pages/index/me",
				"iconPath": "static/tabBar/me.png",
				"selectedIconPath": "static/tabBar/me_cur.png",
				"text": "个人中心"
			}
		]
	}
}
{
  "name": "250320mortgagetool",
  "version": "1.0.0",
  "description": "小工具",
  "main": "main.js",
  "dependencies": {
    "decimal.js": "^10.5.0",
    "opencc-js": "^1.0.5"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "http://192.168.5.154/recordapp/mortgagetool.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
 {
     "version" : "1",
     "prompt" : "template",
     "title" : "服务协议和隐私政策",
     "message" : "　　请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。<br/>　　你可阅读<a href=\"game/random/rBAl5\">《服务协议》</a>和<a href=\"game/random/rBAlz\">《隐私政策》</a>了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。",
     "buttonAccept" : "同意并接受",
     "buttonRefuse" : "暂不同意",
     "hrefLoader" : "system",
     "backToExit" : "false",
     "second" : {
         "title" : "确认提示",
         "message" : "　　进入应用前，你需先同意<a href=\"game/random/rBAl5\">《服务协议》</a>和<a href=\"game/random/rBAlz\">《隐私政策》</a>，否则将退出应用。",
         "buttonAccept" : "同意并继续",
         "buttonRefuse" : "退出应用"
     },
     "disagreeMode" : {
         "support" : false,
         "loadNativePlugins" : false,
         "visitorEntry" : false,
         "showAlways" : false
     }
 }
 <script>
 	import Vue from 'vue'
 
 	export default {
 		onLaunch: function() {
 			uni.getSystemInfo({
 				success: function(e) {
 					// #ifndef MP
 					Vue.prototype.StatusBar = e.statusBarHeight;
 					if (e.platform == 'android') {
 						Vue.prototype.CustomBar = e.statusBarHeight + 50;
 					} else {
 						Vue.prototype.CustomBar = e.statusBarHeight + 45;
 					};
 					// #endif
 
 					// #ifdef MP-WEIXIN
 					Vue.prototype.StatusBar = e.statusBarHeight;
 					let custom = wx.getMenuButtonBoundingClientRect();
 					Vue.prototype.Custom = custom;
 					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 4;
 					// #endif
 
 					// #ifdef MP-ALIPAY
 					Vue.prototype.StatusBar = e.statusBarHeight;
 					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
 					// #endif
 				}
 			});
 		},
 		onShow: function() {
 			console.log('App Show')
 		},
 		onHide: function() {
 			console.log('App Hide')
 		}
 	}
 </script>
 
 <style lang="scss">
 	@import "colorui/main.css";
 	@import "colorui/icon.css";
 	@import "uview-ui/index.scss";
 </style>
 import App from './App'
 
 // #ifndef VUE3
 import Vue from 'vue'
 // 引入全局uView
 import uView from 'uview-ui'
 Vue.use(uView);
 // 此处为引用自定义顶部
 import cuCustom from './colorui/components/cu-custom.vue'
 Vue.component('cu-custom',cuCustom);
 
 // 引入全局方法
 import { http } from '@/utils/request';
 import $mHelper from '@/utils/helper';
 
 Vue.prototype.$http = http;
 Vue.prototype.$mHelper = $mHelper;
 Vue.config.productionTip = false
 App.mpType = 'app'
 const app = new Vue({
     ...App
 })
 app.$mount()
 // #endif
 
 // #ifdef VUE3
 import { createSSRApp } from 'vue'
 export function createApp() {
   const app = createSSRApp(App)
   return {
     app
   }
 }
 // #endif
 
 const { base64ToBit, checkDate } = require('./utils');
 const { getSolarTerm } = require('./solar_term');
 
 const table = [];
 const heavenlyStemStr = '甲乙丙丁戊己庚辛壬癸';
 const earthlyBranchStr = '子丑寅卯辰巳午未申酉戌亥';
 const zodiacStr = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
 const lunarMonthStr = '正二三四五六七八九十冬腊';
 const nubmerStr = '一二三四五六七八九十';
 
 function decompressData() {
     const base64Str = 'hLaCVwUrqpNDSYNlUaqgrUE1pJXQSuak2FJoaSrqlC1QNailtBK26TcElwpLWyWDUoNqJW1ArYJVySXgkuzJYNSg6lVtSC1oFbHJuCS58loZKhqU20oLVQVqSq2BLoSWlkrCpV7SoNlBaqqrUE2gpbNSuClcVKg6VBqpq1QVaglslK4KVwUmPpMGyrrVQVqCW1UroJWhSamk0NJY1ShaoFtTS2glbBJtKS4Ul1ZLBqUG1GraBVsEq6pLwSXBks2pQdSw1lBawKtlk2hJcGSyalQ1KDaUlqoK1PVbAl0JLVyVhUqFpSWqgrVlVqCXQUtspXBSsKk0dKg1UFapJtQS2alcFJwaTL0mDVMFqja1BLbaV0ErQpNbSWGkoapLtUC1oFbSStgk29JcKSwqlW1KDaQVtGq2CTeEl4JLgyWzUoOpQaqSrYFVwSXHkuDJZ9SoalBtKq1UFagptRS6ClsVKwqVC0prVQVqgq0lLoKWwUrOpODSbuUwaqCtVU2oJbBSuik4NFo6TBqkG1TNagVtBK5KToUWhoqWyUNUg';
     const bitStr = base64ToBit(base64Str);
     let solarDate = { y: 1900, m: 1, d: 31, obj: new Date(1900, 0, 31, 0, 0, 0, 0) };
     let heavenlyStem = 6; // 天干
     let earthlyBranch = 0; // 地支
     for (let i = 0; i < bitStr.length; ) {
         if (i + 16 >= bitStr.length) {
             break;
         }
         const head = bitStr.substr(i, 4);
         i += 4;
         const leapMonth = +`0b${head}`;
         const monthCount = leapMonth > 0 ? 13 : 12;
         const months = bitStr.substr(i, monthCount).split('').map(o => +o);
         i += monthCount;
 
         table.push({
             solarDate,
             leapMonth,
             months,
             heavenlyStem,
             earthlyBranch
         });
 
         const dateCount = monthCount*29 + months.filter(o => o == 1).length;
         const newSolarDate = new Date(solarDate.y, solarDate.m - 1, solarDate.d + dateCount, 0, 0, 0, 0);
         solarDate = {
             y: newSolarDate.getFullYear(),
             m: newSolarDate.getMonth() + 1,
             d: newSolarDate.getDate(),
             obj: newSolarDate
         };
         heavenlyStem = (heavenlyStem + 1) % 10;
         earthlyBranch = (earthlyBranch + 1) % 12;
     }
 }
 
 decompressData();
 
 function isBefore(base, target) {
     if (base.y != target.y) {
         return base.y > target.y;
     } else if (base.m != target.m) {
         return base.m > target.m;
     } else if (base.d != target.d) {
         return base.d > target.d;
     }
     return false;
 }
 
 function getLunarStr(month, date, isLeap) {
     const monthStr = `${isLeap ? '闰' : ''}${lunarMonthStr[month - 1]}月`;
     if (date <= 10) {
         return `${monthStr}初${nubmerStr[date - 1]}`;
     } else if (date < 20) {
         return `${monthStr}十${nubmerStr[date - 11]}`;
     } else if (date == 20) {
         return `${monthStr}二十`;
     } else if (date > 20) {
         return `${monthStr}廿${nubmerStr[date - 21]}`;
     } else {
         return `${monthStr}三十`;
     }
 }
 
 function getLunar(year, month, date) {
     year = Math.floor(+year);
     month = Math.floor(+month);
     date = Math.floor(+date);
     checkDate(year, month, date);
     let index = year - 1900;
     let row = table[index];
     if (isBefore(row.solarDate, { y: year, m: month, d: date })) {
         index -= 1;
         row = table[index];
     }
     if (!row) {
         throw new Error('Invalid Date');
     }
     const targetDate = new Date(year, month - 1, date, 0, 0, 0, 0);
     let delta = Math.round((targetDate.getTime() - row.solarDate.obj.getTime()) / (24*60*60*1000));
     let afterLeap = false;
     for(let i = 0; i < row.months.length; i++) {
         const isLeap = row.leapMonth > 0 && i == row.leapMonth;
         if (isLeap) {
             afterLeap = true;
         }
         const days = 29 + row.months[i];
         if (delta < days) {
             let lunarMonth = afterLeap ? i : i + 1;
             return {
                 lunarMonth,
                 lunarDate: delta + 1,
                 isLeap,
                 solarTerm: getSolarTerm(year, month, date),
                 lunarYear: `${heavenlyStemStr[row.heavenlyStem]}${earthlyBranchStr[row.earthlyBranch]}年`,
                 zodiac: `${zodiacStr[row.earthlyBranch]}`,
                 dateStr: getLunarStr(lunarMonth, delta + 1, isLeap)
             };
         } else {
             delta -= days;
         }
     }
     throw new Error(`There's something wrong!`);
 }
 
 module.exports = { getLunar };
 const { base64ToBit, checkDate } =  require('./utils');
 
 // 2bit代表日期 共48bit
 // 48bit -> base64  8个
 // 200年一共68种情况
 const names = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种',
     '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
 const baseDate = [4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21];
 
 const table = [];
 
 function decompressData() {
     const codeStr = 'ABCDAECDAECDFGHIJKHILKMILABNOABNOAENOAENOAEPQRGSTUGSTLAVTOAWXOAWXOAYXOAYZOabcdebcQUfgThijkOilXOimXOimXOimcOnocdpqcQrsgktujkvumXvumXvumcvumcvwocxyqcz0sj10s213u243um43um53wm56wq567q589s+/0s~/3u~!3u@#3um';
     const groupsStr = 'paaqmqqpqaquqqqqqvruruqq6qWaWZqlqaqqqqqqlaaqmqqppaaqqqqqqrququqqqqWaWZaVlaaampqlpaaqqqqplaWampqlqaququqqqqWZWZVVlaWaWZqlqqVZWZVVlaWaWZaVlaaqmpqpqmVZVZVVVaWaWZaVlaWampqpqlVZVZVVqVVZVVVVVaWZWZVVqVVVVVVVVaVZWZVVpaaqmpqpqVFVVVVVVaVZVZVVlaWaWZalpaaampqppVFVRVVVVWVZVZVVlaWaWpqlpVFVRVVUVVVZVVVVVaWZWZaVVFVZVVVVVFVVVVVVpVFVRUVUVFFVVVVVpVFFRUVUVFFVRVVVlVBFRUVUUFFVRVVVlVBFBEVUUFFVRVVUlVBFBEVQUFFFRUVUlVBFBEFQUFBFRUVUlVBEBEFAQFBFBEVUVVBEBEFAVVVVVVVVQFBFBEVQVVBEBEAAVVAEAEAAQFBFBEFQUFBFBUVUQFBEBEFAUFBFBEVUVQAEAAAAAFBEBEFAVQAAAAAAAFBEBEAAVAAAAAAAAFBEAEAA';
     const groups = [];
     for (let i = 0; i < groupsStr.length; i += 8) {
         const groupBitStr = base64ToBit(groupsStr.substr(i, 8));
         const group = [];
         for (let j = 0; j < groupBitStr.length; j += 2) {
             group.push(+`0b${groupBitStr.substr(j, 2)}`);
         }
         groups.push(group);
     }
     const codeMapStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~!@#';
     for (let i = 0; i < codeStr.length; i++) {
         table.push(groups[codeMapStr.indexOf(codeStr[i])]);
     }
 }
 
 decompressData();
 
 function getSolarTerm(year, month, date) {
     year = Math.floor(+year);
     month = Math.floor(+month);
     date = Math.floor(+date);
     checkDate(year, month, date);
     const index = (month - 1) * 2 + (date < 15 ? 0 : 1);
     const d = baseDate[index] + table[year - 1901][index];
     if (date == d) {
         return names[index];
     } else {
         return null;
     }
 }
 
 module.exports = { getSolarTerm };
 function base64ToBit(base64Str) {
     const base64CodeMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
     const result = [];
     for (let i = 0; i < base64Str.length; i++) {
         let n = base64CodeMap.indexOf(base64Str[i]);
         result.push(n.toString(2).padStart(6, '0'));
     }
     return result.join('');
 }
 
 function checkDate(year, month, date) {
     if (year < 1901 || year > 2100) {
         throw new Error('Invalid Year');
     }
     if (month < 1 || month > 12) {
         throw new Error('Invalid Month');
     }
     if (date < 1 || date > 31) {
         throw new Error('Invalid Date');
     }
     if ([4, 6, 9, 11].indexOf(month) != -1 && date > 30) {
         throw new Error('Invalid Date');
     }
     if (month == 2) {
         if (date > 29) {
             throw new Error('Invalid Date');
         } else {
             let isLeap = false;
             if (year % 400 == 0) {
                 isLeap = true
             } else if (year % 4 == 0 && year % 100 != 0) {
                 isLeap = true;
             }
             if (!isLeap && date > 28) {
                 throw new Error('Invalid Date');
             }
         }
     }
 }
 
 module.exports = {
     base64ToBit,
     checkDate,
 };
 <template>
 	<view>
 		<scroll-view scroll-y class="page">
 			<view class="cu-card case" >
 				<view class=" shadow">
 					<view class="image">
 						<image src="../../static/me/day.jpg" mode="widthFix">
 						</image>
 						<view class="cu-tag shuli" style="right: 24px;">{{getLunarDay.dateStr}}</view>
 						<view class="cu-tag bg-grey shuli" style="height: 80px;">{{getLunarDay.lunarYear}}</view>
 						<view class="cu-bar">
 						<view :style="mystyle" class="_span">{{date}}</view>
 						</view>
 					</view>
 					<view class="bg-white" style="padding-right: 10px;">
 						<view class="text-right">{{dateStr}}</view>
 						</view>
 					<view class="padding bg-white" style="padding-top: 80px;">
 						<view class="text-left padding">{{messages[date]}}</view>
 						<view class="text-right padding">祝福</view>
 					</view>
 				</view>
 			</view>
 		</scroll-view>
 	</view>
 </template>
 
 <script>
 	import {
 		getLunar
 	} from '../../components/chinese_lunar_calendar/lunar_calendar.js';
 	var weeks=new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
 	export default {
 		data() {
 			return {
 				getLunarDay: '',
 				mystyle:"",
 				year: new Date().getFullYear(),
 				month: new Date().getMonth() + 1,
 				date: new Date().getDate(),
 				day:new Date().getDay(),
 				week:'',
 				dateStr:"",
 				messages: [
 				    "愿你前程似锦，步步高升，未来的每一天都充满希望与成功~",
 				        "祝你心想事成，万事如意，生活如阳光般灿烂辉煌~",
 				        "愿你好运连连，幸福满满，所有的美好都如期而至~",
 				        "祝你事业有成，蒸蒸日上，前途一片光明，未来更加辉煌~",
 				        "愿你健康平安，笑口常开，生活充满快乐与满足~",
 				        "祝你财源广进，富贵吉祥，财富如江河般源源不断~",
 				        "愿你每天都有好心情，生活充满阳光，幸福与你常伴~",
 				        "祝你梦想成真，未来可期，所有的努力都能开花结果~",
 				        "愿你勇敢追梦，无所畏惧，未来的路上充满无限可能~",
 				        "祝你家庭和睦，幸福美满，家中充满欢声笑语~",
 				        "愿你学业进步，金榜题名，知识的海洋中扬帆远航~",
 				        "祝你爱情甜蜜，白头偕老，携手共度每一个美好时光~",
 				        "愿你每天都充满正能量，生活如彩虹般绚丽多彩~",
 				        "祝你成功在望，前途无量，未来的每一步都坚定有力~",
 				        "愿你心怀希望，未来更加辉煌，所有的梦想都能实现~",
 				        "祝你生活如意，事业顺利，每一天都充满喜悦与成就~",
 				        "愿你风雨无阻，勇往直前，未来的路上无所畏惧~",
 				        "祝你天天开心，烦恼远离，生活如春风般温暖舒适~",
 				        "愿你心想事成，梦想成真，所有的愿望都能如愿以偿~",
 				        "祝你福星高照，好运常伴，幸运之神永远眷顾着你~",
 				        "愿你笑对人生，幸福常驻，生活如诗如画般美好~",
 				        "祝你步步高升，前程似锦，事业如日中天，蒸蒸日上~",
 				        "愿你健康长寿，平安喜乐，生活充满温馨与幸福~",
 				        "祝你财源滚滚，富贵安康，财富与幸福与你常伴~",
 				        "愿你每天都充满希望与活力，生活如朝阳般充满生机~",
 				        "祝你事业腾飞，蒸蒸日上，未来的每一步都更加辉煌~",
 				        "愿你心怀梦想，勇敢前行，未来的路上充满无限可能~",
 				        "祝你生活美满，幸福安康，每一天都充满快乐与满足~",
 				        "愿你每天都充满阳光与笑容，生活如花般绚烂多彩~",
 				        "祝你未来更加辉煌灿烂，所有的努力都能收获丰硕的果实~",
 						"愿你在人生的旅途中，始终心怀善意，收获满满的幸福与感动~",
 						    "祝你每一天都充满新的希望，生活如星辰般闪耀，未来更加美好~"
 				]
 			}
 		},
 		mounted() {
 			// 获取农历
 			this.getLunarDay = getLunar(this.year, this.month, this.date)
 			this.dateStr=(this.year+"."+this.month+"."+this.date+" "+weeks[this.day]);
 			this.mystyle='--content:'+"'"+this.date+"'";
 			console.log(this.date);
 		},
 		methods: {
 
 
 		}
 	}
 </script>
 
 <style>
 	.page {
 		height: 100vh;
 	}
 
 	.text-cut {
 		font-size: 168upx;
 	}
 
 	._span {
 		font-size: 150upx;
 		font-weight: 900;
 		color: black;
 		font-family: 'Courier New', Courier, monospace;
 	}
 
 	.left {
 		margin-top: 20vh;
 		position: absolute;
 	}
 
 	._span::before {
 		position: absolute;
 		height: 50%;
 		content: var(--content);
 		overflow: hidden;
 		color: white;
 		z-index: 999;
 	}
 
 	.cu-card.case .image .cu-bar {
 		position: absolute;
 		bottom: -42px;
 		width: 100%;
 		background-color: transparent;
 		padding: 0px 16px;
 		z-index: 99;
 	}
 
 	.cu-tag {
 		font-size: 12px;
 		vertical-align: middle;
 		position: relative;
 		display: inline-flex;
 		align-items: center;
 		justify-content: center;
 		box-sizing: border-box;
 		padding: 0px 8px;
 		height: 25px;
 		font-family: Helvetica Neue, Helvetica, sans-serif;
 		white-space: pre-wrap;
 	}
 	.shuli{ margin:0 auto;width:20px;
 	height: 100px;
 	line-height:24px;border:1px solid #333} 
 </style>
 <!-- 首页 -->
 <template>
 	<view>
 		<!-- banner图 -->
 		<view class="uni-padding-wrap">
 			<view class="page-section swiper">
 				<view class="page-section-spacing">
 					<swiper class="swiper" circular="true" indicator-dots="true" autoplay="true" interval="3500" duration="600" :style="{ height: swiperHeight + 'px' }">
 						<swiper-item class="swiper-list" v-for="(item, index) in bannerList" :key="index">
 							<!-- <view class="swiper-item uni-bg-red" @click="handleClick(item)"> -->
 								<view class="swiper-item uni-bg-red">
 								<image class="swiper-img" :src="item.imageUrl" mode="widthFix" @load="onImageLoad"></image>
 							</view>
 						</swiper-item>
 					</swiper>
 				</view>
 			</view>
 		</view>
 
 		<!-- 导航栏 -->
 		<view class="cu-list grid solids-bottom col-2 no-border">
 			<view class="cu-item" v-for="(item, index) in tools" :key="index"
 				:style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]" @click="goTool"
 				:data-mid="item.mid">
 				<view :class="['cuIcon-' + item.cuIcon, 'text-' + item.color]">
 					<view class="cu-tag badge" v-if="item.count != 0">
 						<block v-if="item.badge != 1">{{ item.badge > 99 ? '99+' : item.badge }}</block>
 					</view>
 				</view>
 				<text>{{ item.name }}</text>
 			</view>
 			</view>
 		<view style="height: 140rpx;width: 1rpx;"></view>
 	</view>
 </template>
 
 <script>
 	import request from '@/common/request.js';
 	// 图表
 	import uCharts from "@/components/u-charts/u-charts.js";
 	// import addTip from '../../components/wxcomponents/struggler-uniapp-add-tip/struggler-uniapp-add-tip.vue';
 	var _self;
 	var canvaWord = null;
 
 	export default {
 		components: {
 			// addTip
 		},
 		data() {
 			return {
 				swiperHeight: 300, // 初始高度，可以设置为默认值
 				duration: 1,
 				scrollTop: 0,
 				old: {
 					scrollTop: 0
 				},
 				pixelRatio: 1,
 				bannerList: [
 					{
 						imageUrl: '../../static/images/b1.png',
 						link: 'https://appweb.yangqianguan.com/v2/activity/flexible?act=BYVddKHQ'
 					},
 					{
 						imageUrl: '../../static/images/b2.png',
 						link: 'https://www.51hicard.com/landingPage/page?code=ry201003&page_name=dx-ry20ml&hfqorigin=hfq150170000216280000&agent=ruiyi&rp_hfq=1s'
 					},
 				],
 				tools: [
 					{
 						cuIcon: 'coin',
 						color: 'blue',
 						count: 0,
 						badge: 0,
 						mid: '6',
 						name: '房贷计算器'
 					},
 					{
 						cuIcon: 'appreciatefill',
 						color: 'blue',
 						count: 0,
 						badge: 0,
 						mid: '8',
 						name: '繁简转换'
 					}
 				],
 				projectList: []
 			};
 		},
 		watch: {},
 		mounted() {
 			//console.log(this.projectList);
 			//this.getData();
 			_self = this;
 			//this.getServerData();
 		},
 		methods: {
 			// 图片加载完成事件
 			onImageLoad(event) {
 			      const { width, height } = event.detail;
 			      // 根据图片宽高比计算高度
 			      const systemInfo = uni.getSystemInfoSync();
 			      const windowWidth = systemInfo.windowWidth;
 			      const imageHeight = (height / width) * windowWidth;
 			      // 设置 swiper 高度
 			      this.swiperHeight = imageHeight;
 			 },
 			handleClick(item) {
 				console.log(item.link)
 			      uni.navigateTo({
 			              url: `/pages/index/webview?url=${encodeURIComponent(item.link)}`
 			      });
 			},
 			async getData() {
 				console.log('数据加载');
 				await this.$http
 					.get('/weixin/v1/api/wx/tool/getHotSearchWordcloud', {})
 					.then(async r => {
 						console.log(r.data);
 						this.cyData.series=[];
 						r.data.forEach(item => {
 							if(this.cyData.series.length<11){
 							this.cyData.series.push({
 								"name": item.keyword,
 								"textSize": item.size/5000
 							});
 							}
 						});
 						console.log(this.cyData.series);
 						_self.showData("canvasData", this.Data);
 					})
 					.catch(err => {
 
 					});
 
 			},
 			scroll: function(e) {
 				console.log(e);
 				this.old.scrollTop = e.detail.scrollTop;
 			},
 			goTool: function(e) {
 				console.log(e.currentTarget.dataset.mid)
 				if (e.currentTarget.dataset.mid == 6) {
 					uni.navigateTo({
 						url: '../tools/house'
 					});
 				}
 				if (e.currentTarget.dataset.mid == 8) {
 					uni.navigateTo({
 						url: '../tools/font'
 					});
 				}
 				if (e.currentTarget.dataset.mid == 7) {
 					console.log(7);
 					uni.navigateTo({
 						url: '../tools/electric'
 					});
 				}
 			},
 		}
 	};
 </script>
 <style lang="scss" scoped>
 	.chartsMain {
 		width: 750rpx;
 		height: 450rpx;
 		padding-top: 15rpx;
 		background: #fff;
 		margin-bottom: 24rpx;
 		border-top: 2rpx solid #f2f2f2;
 
 		.charts {
 			width: 750rpx;
 			height: 450rpx;
 			box-sizing: border-box;
 		}
 	}
 
 	.swiper-box {
 		flex: 1;
 	}
 
 	.swiper-item {
 		height: 100%;
 	}
 
 	/*scroll-view外层*/
 	.skill-sequence-panel-content-wrapper {
 		position: relative;
 		white-space: nowrap;
 		padding: 10rpx 0 10rpx 10rpx;
 	}
 
 	/*左右渐变遮罩*/
 	.hide-content-box {
 		position: absolute;
 		top: 0;
 		height: 100%;
 		width: 10px;
 		z-index: 2;
 	}
 
 	.hide-content-box-left {
 		left: 0;
 		background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #f3f3f3 60%);
 	}
 
 	.hide-content-box-right {
 		right: 0;
 		background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #f3f3f3 60%);
 	}
 
 	.kite-classify-scroll {
 		width: 100%;
 		height: 380rpx;
 		overflow: hidden;
 		white-space: nowrap;
 	}
 
 	.kite-classify-cell {
 		display: inline-block;
 		width: 266rpx;
 		height: 370rpx;
 		margin-right: 20rpx;
 		background-color: #ffffff;
 		border-radius: 10rpx;
 		overflow: hidden;
 		box-shadow: 2px 2px 3px rgba(26, 26, 26, 0.2);
 	}
 
 	.nav-li {
 		padding: 40rpx 30rpx;
 		width: 100%;
 		background-image: url(https://s1.ax1x.com/2020/06/27/NyU04x.png);
 		background-size: cover;
 		background-position: center;
 		position: relative;
 		z-index: 1;
 	}
 
 	.nav-name {
 		font-size: 28upx;
 		text-transform: Capitalize;
 		margin-top: 20upx;
 		position: relative;
 	}
 
 	.nav-name::before {
 		content: '';
 		position: absolute;
 		display: block;
 		width: 40rpx;
 		height: 6rpx;
 		background: #fff;
 		bottom: 0;
 		right: 0;
 		opacity: 0.5;
 	}
 
 	.nav-name::after {
 		content: '';
 		position: absolute;
 		display: block;
 		width: 100rpx;
 		height: 1px;
 		background: #fff;
 		bottom: 0;
 		right: 40rpx;
 		opacity: 0.3;
 	}
 
 	.nav-content {
 		width: 100%;
 		padding: 15rpx;
 		display: inline-block;
 		overflow-wrap: break-word;
 		white-space: normal;
 	}
 
 	.nav-btn {
 		width: 200rpx;
 		height: 60rpx;
 		margin: 8rpx auto;
 		text-align: center;
 		line-height: 60rpx;
 		border-radius: 10rpx;
 	}
 
 	.bg-index1 {
 		background-color: #19cf8a;
 		color: #fff;
 	}
 
 	.bg-index2 {
 		background-color: #954ff6;
 		color: #fff;
 	}
 
 	.bg-index3 {
 		background-color: #5177ee;
 		color: #fff;
 	}
 
 	.bg-index4 {
 		background-color: #f49a02;
 		color: #fff;
 	}
 
 	.bg-index5 {
 		background-color: #ff4f94;
 		color: #fff;
 	}
 
 	.bg-index6 {
 		background-color: #7fd02b;
 		color: #fff;
 	}
 
 	.item-name {
 		margin-bottom: 15rpx;
 		display: -webkit-box;
 		-webkit-box-orient: vertical;
 		-webkit-line-clamp: 1;
 		overflow: hidden;
 	}
 </style>
 <!-- 个人中心 -->
 <template>
 	<view>
 	<view class="components-theme">
 		<navigator target="miniProgram"  version='release' hover-class="none">
 			<view class="dong">
 				<view class="monster">
 					<view class="monster__face">
 						<view class="monster__eye avatar-eye avatar-eye--green eye--left">
 							<view class="avatar-eye-pupil pupil--green"><span class="avatar-eye-pupil-blackThing"><span
 										class="avatar-eye-pupil-lightReflection"></span></span></view>
 						</view>
 						<view class="monster__eye avatar-eye avatar-eye--violet eye--right">
 							<view class="avatar-eye-pupil pupil--pink"><span class="avatar-eye-pupil-blackThing"><span
 										class="avatar-eye-pupil-lightReflection"></span></span></view>
 						</view>
 						<view class="monster__noses">
 							<view class="monster__nose"></view>
 							<view class="monster__nose"></view>
 						</view>
 						<view class="monster__mouth">
 							<view class="monster__top"></view>
 							<view class="monster__bottom"></view>
 						</view>
 					</view>
 				</view>
 			</view>
 		</navigator>
 		<!-- 弹窗确认 -->
 		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
 			<view class="cu-dialog" style="padding: 300rpx 0 70rpx;">
 				<view class="modal_bg"></view>
 				<view class="modal_main">
 					<view class='nav-list margin-top'>
 						<view :class="'nav-li bg-zt' + (index+1)" v-for="(item, index) in inter" :key="index"
 							@click="switchImage(index,item.name)">
 							<view class="nav-name">{{item.name}}</view>
 						</view>
 					</view>
 				</view>
 			</view>
 		</view>
 		<!-- 顶部背景 -->
 		<view class='UCenter-bg'
 			:style="'background-image: url(' + pic[topBackGroupImageIndex].link + ');margin-top:0px;'">
 			<view class='space' v-show="spaceShow">
 				<view class="stars ">
 					<view class="star "></view>
 					<view class="star pink "></view>
 					<view class="star blue "></view>
 					<view class="star yellow "></view>
 				</view>
 			</view>
 
 			<block>
 				<view class='text-center' v-if="!isLogin">
 					<view @click="onLogin" class="cu-avatar2 round xl margin-right-sm shadow-blur-lg bg-img open-data"
 						style="overflow: hidden;">
 						<image src="../../static/logo/192-192.png"></image>
 					</view>
 					<view class="padding text-white text-xl text-bold" @click="onLogin">
 						去登录
 					</view>
 				</view>
 				<view class='text-center' v-else>
 					<view class="cu-avatar2 round xl margin-right-sm shadow-blur-lg bg-img open-data"
 						style="overflow: hidden;">
 						<image src="../../static/logo/192-192.png"></image>
 					</view>
 					<view class="padding text-white text-xl text-bold" >
 						{{hideMiddleFourDigits(userdata.nickname)||'走心计算'}}
 					</view>
 				</view>
 			</block>
 			<image
 				src='../../static/me/mebg.gif'
 				mode='scaleToFill' class='gif-wave'></image>
 		</view>
 
 		<block>
 
 			<view
 				class="cu-list menu card-menu margin-top-lg margin-bottom-sm shadow-shop bg-white text-black my-radius sm-border">
 				<view class="cu-item" @tap="showModal" data-target="Modal">
 					<view class='content'>
 						<image src='../../static/me/icon/zhuti.png' class='png' mode='aspectFit'></image>
 						<text class='text-lg margin-sm'>主题切换</text>
 					</view>
 					<view class='action'>
 						<view class="cu-capsule radius">
 							<view class='cu-tag bg-gradual-blue'>
 								<view style="clear: both;"></view>
 							</view>
 							<view class="cu-tag line-blue">
 								{{picName}}
 							</view>
 						</view>
 					</view>
 				</view>
 			</view>
 			<view
 				class="cu-list menu card-menu margin-top-lg margin-bottom-lg shadow-shop bg-white text-black my-radius sm-border">
 				<view class="cu-item">
 					<button class='content cu-btn' @click="goRecommend">
 							<image src='../../static/me/icon/dengta.png' class='png' mode='aspectFit'></image>
 							<text class='text-lg margin-sm'>设置</text>
 						</button>
 				</view>
 			</view>
 
 		</block>
 		<view style="height: 110rpx;width: 1rpx;"></view>
 	</view>
 	</view>
 </template>
 
 <script>
 	import { getConfig, getUserInfo,getToken } from '@/utils/auth';
 	export default {
 		data() {
 			return {
 				isLogin: false,
 				showSmsLogin:false,
 				username: '',
 				password: '',
 				openid:'',
 				unionid:'',
 				userinfowx:'',
 				idfd:1,
 				fxpid:0,
 				islogin:false,
 				isdl:false,
 				code:'',
 				anonymousCode:'',
 				gender:0,
 				nickName:'',
 				btnDisbe:false,
 				autoLogin:false,
 				secret: 'b2EyMHF6ZDExMTExMTAwMA==',
 				os:'',
 				userdata: {},
 				// Custom: this.Custom,
 				// CustomBar: this.CustomBar,
 				spaceShow: true,
 				modalName: null,
 				picName: '流星之夜',
 				pic: [{
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg1.jpeg',
 					name: '春天'
 				}, {
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg2.jpeg',
 					name: '夏天'
 				}, {
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg3.jpeg',
 					name: '秋天'
 				}, {
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg4.jpeg',
 					name: '冬天'
 				}, {
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg5.jpeg',
 					name: '幽静'
 				}, {
 					link: 'https://cdn.zhoukaiwen.com/zjx_me_bg6.jpg',
 					name: '天空'
 				}],
 				topBackGroupImageIndex: 5,
 				inter: [{
 					title: 'mimicry',
 					name: '活力春天',
 					color: ''
 				}, {
 					title: 'theme',
 					name: '清爽夏日',
 					color: ''
 				}, {
 					title: 'theme',
 					name: '金秋之韵',
 					color: ''
 				}, {
 					title: 'theme',
 					name: '冬日之阳',
 					color: ''
 				}, {
 					title: 'theme',
 					name: '幽兰星空',
 					color: ''
 				}, {
 					title: 'theme',
 					name: '流星之夜',
 					color: ''
 				}]
 			}
 		},
 		// 分享小程序
 		onShareAppMessage(res) {
 			return {
 				title: '看看这个小程序多好玩～',
 			};
 		},
 		watch: {
 			topBackGroupImageIndex(val) {
 				//console.log(val)
 				if (val == 4 || val == 5) {
 					this.spaceShow = true;
 				} else {
 					this.spaceShow = false;
 				}
 			},
 		},
 		mounted() {
 			this.userdata = getUserInfo() || {};
 			// let _this=this
 			// uni.preLogin({
 			// 	provider: 'univerify',
 			// 	success(){  //
 			// 		// 显示一键登录选项
 			// 		console.log('预登录成功')
 			// 		_this.autoLogin=true
 			// 		console.log("this.autoLogin:"+_this.autoLogin)
 			// 	},
 			// 	fail(res){  // 预登录失败
 			// 		console.log(res)
 			// 	}
 			// })
 			
 			// this.os = uni.getSystemInfoSync().uniPlatform;
 			// console.log("os:"+this.os)  
 		},
 		onShow(){
 			 let token = getToken() || "";
 			 console.log('token=='+token)
 			 if(token){
 				this.userdata = getUserInfo() || {};
 				//console.log(this.userdata)
 			 	this.isLogin=true
 			 }else{
 			 	this.isLogin=false
 			 	this.userinfo={}
 			 }
 		},
 		methods: {
 			hideMiddleFourDigits(phoneNumber) {
 			    // 检查手机号是否为11位数字
 			    if (phoneNumber.length === 11 && /^\d+$/.test(phoneNumber)) {
 			        return phoneNumber.substring(0, 3) + '*****' + phoneNumber.substring(8);
 			    } else {
 			        return phoneNumber;
 			    }
 			},
 			//一键登录
 			openAutoLogin(){
 				if(!this.autoLogin){
 						uni.showToast({ title: '请打开数据流量',icon:"none" });
 						return
 				}
 				let _self = this;
 				uni.login({
 					provider: 'univerify',
 					univerifyStyle: { // 自定义登录框样式
 					//参考`univerifyStyle 数据结构`
 					  "icon": {
 					        "path": "static/login/144-144.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
 					        "width":  "60px",  //图标宽度 默认值：60px
 					        "height": "60px"   //图标高度 默认值：60px
 					    },
 				  },
 					success(ures){ // 登录成功
 						console.log(ures);  // {openid:'登录授权唯一标识',access_to.ken:'接口返回的 token'}
 						// 在得到access_token后，通过callfunction调用云函数
 						uniCloud.callFunction({
 						  name: 'toolautologin',
 						  data: ures.authResult
 						}).then(res => {
 							console.log("获取号码：")
 							console.log(res)
 							
 							// if(res.code==200){
 							// 	setUserInfo(res.data)
 							// 	uni.showToast({
 							// 		title:'登陆成功'
 							// 	})
 							// 	this.userdata = res.data;
 							// 	// 登录成功，可以关闭一键登录授权界面了
 							// 	uni.closeAuthView()
 							// }else{
 							// 	uni.showToast({ title: '登录失败',icon:"none" });
 							// }
 						  
 						}).catch(err=>{
 						  // 处理错误
 						  console.log("获取错误："+err)
 						})
 					},
 					fail(res){  // 登录失败
 						console.log(res)
 						if(res.errCode==30002){
 							uni.closeAuthView()
 						}else{
 							uni.showToast({ title: res.errMsg,icon:"none" });
 						}
 					}
 				})
 			},
 			onLogin(){
 				uni.navigateTo({
 					url:'../login/login'
 				})
 			},
 			goGzh(e){
 				this.modalName = e.currentTarget.dataset.target
 			},
 			showGame(e) {
 				this.modalName = e.currentTarget.dataset.target
 			},
 			showXcx(e) {
 				this.modalName = e.currentTarget.dataset.target
 			},
 			switchImage(index, name) {
 				this.topBackGroupImageIndex = index;
 				this.modalName = null;
 				this.picName = name;
 			},
 			showModal(e) {
 				this.modalName = e.currentTarget.dataset.target
 			},
 			goRecommend(){
 				uni.navigateTo({
 					url: '../me/set'
 				})
 			}
 		}
 	}
 </script>
 
 <style lang="scss" scoped>
 	.UCenter-bg {
 		background: #fff;
 		background-size: 100% 100%;
 		/* background-size: cover; */
 		height: 550rpx;
 		display: flex;
 		justify-content: center;
 		padding-top: 40rpx;
 		overflow: hidden;
 		position: relative;
 		flex-direction: column;
 		align-items: center;
 		color: #fff;
 		font-weight: 300;
 		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
 	}
 
 	.UCenter-bg text {
 		opacity: 0.8;
 	}
 
 	.UCenter-bg image {
 		width: 150rpx;
 		height: 150rpx;
 	}
 
 	.UCenter-bg .gif-wave {
 		position: absolute;
 		width: 100%;
 		bottom: 0;
 		left: 0;
 		z-index: 99;
 		mix-blend-mode: screen;
 		height: 100rpx;
 	}
 
 
 	// 头像
 	.cu-avatar2 {
 		font-variant: small-caps;
 		margin: 0;
 		padding: 0;
 		display: inline-flex;
 		text-align: center;
 		justify-content: center;
 		align-items: center;
 		background: #f0f0f0;
 		color: #fff;
 		white-space: nowrap;
 		position: relative;
 		width: 150rpx;
 		height: 150rpx;
 		background-size: cover;
 		background-position: center;
 		vertical-align: middle;
 		font-size: 1.5em;
 	}
 
 	.name {
 		text-shadow: 2px 2px 1px #2f9bfe;
 	}
 
 	.dialog2 {
 		background: none;
 	}
 
 	.saicode {
 		background-size: 100% 100%;
 		-moz-background-size: 100% 100%;
 	}
 
 	.img-big image {
 		top: -40px;
 		width: 280rpx;
 		height: 280rpx;
 	}
 
 
 	.shadow-me {
 		box-shadow: 0rpx 0rpx 100rpx 0rpx rgba(0, 0, 0, 0.1);
 	}
 
 	.tn-footerfixed {
 		position: fixed;
 		width: 100%;
 		bottom: 0;
 		z-index: 1024;
 		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.35);
 	}
 
 	.my_logo {
 		background: none;
 		padding: 50rpx 0 30rpx 0;
 	}
 
 	.my-radius {
 		border-radius: 12rpx;
 		overflow: hidden
 	}
 
 	.my-icon image {
 		width: 100rpx;
 		height: 100rpx;
 		display: inline-block;
 		margin: 0 auto
 	}
 
 	.my-iconcolor {
 		background: rgba(255, 255, 255, 0.96)
 	}
 
 	.shadow-shop {
 		box-shadow: 0rpx 0rpx 90rpx 0rpx rgba(0, 0, 0, 0.1);
 	}
 
 	.qrcode-img {
 		position: fixed;
 		width: 80rpx;
 		height: 80rpx;
 		bottom: 350rpx;
 		right: 30rpx;
 		z-index: 1024;
 		opacity: 0.8;
 		box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
 		border: none
 	}
 
 
 	/* 数字背景 */
 	.shadow-warp-my {
 		position: relative;
 		box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, 0.1);
 	}
 
 	.shadow-warp-my:before,
 	.shadow-warp-my:after {
 		position: absolute;
 		content: "";
 		top: 20rpx;
 		bottom: 30rpx;
 		left: 20rpx;
 		width: 50%;
 		box-shadow: 0 30rpx 20rpx rgba(0, 0, 0, 0.16);
 		transform: rotate(-6deg);
 		z-index: -1;
 	}
 
 	.shadow-warp-my:after {
 		right: 20rpx;
 		left: auto;
 		transform: rotate(6deg);
 	}
 
 
 	.bg-product {
 		background-image: linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0));
 		color: #fff;
 	}
 
 	.margin-bottom-my {
 		margin-bottom: 150rpx;
 	}
 
 	.giteeClass {
 		margin-top: 30rpx;
 		font-size: 34rpx;
 		color: #2440B3;
 		text-decoration: underline;
 	}
 
 	.cu-dialog {
 		background: #FFFFFF;
 		overflow: visible;
 	}
 
 	.modal_bg {
 		width: 100%;
 		height: 400rpx;
 		position: absolute;
 		top: -100rpx;
 		background-image: url(https://zhoukaiwen.com/img/qdpz/modal_bg.png);
 		background-size: 100%;
 		background-repeat: no-repeat;
 	}
 
 	.modal_main {
 		background-color: #FFFFFF;
 	}
 
 	/* 主题色 */
 	.bg-zt1 {
 		color: #fff;
 		background: #81d949;
 	}
 
 	.bg-zt2 {
 		color: #fff;
 		background: #b2e6ff;
 	}
 
 	.bg-zt3 {
 		color: #fff;
 		background: #f3cd41;
 	}
 
 	.bg-zt4 {
 		color: #fff;
 		background: #ddecf7;
 	}
 
 	.bg-zt5 {
 		color: #fff;
 		background: #152e9d;
 	}
 
 	.bg-zt6 {
 		color: #fff;
 		background: #0f1358;
 	}
 
 	.nav-list {
 		display: flex;
 		flex-wrap: wrap;
 		padding: 0px 40upx 0px;
 		justify-content: space-between;
 	}
 
 	.nav-li {
 		padding: 22upx;
 		border-radius: 12upx;
 		width: 45%;
 		margin: 0 2.5% 40upx;
 		background-image: url(../../static/me/NyU04x.png);
 		background-size: cover;
 		background-position: center;
 		position: relative;
 		z-index: 1;
 	}
 
 	.nav-li::after {
 		content: "";
 		position: absolute;
 		z-index: -1;
 		background-color: inherit;
 		width: 100%;
 		height: 100%;
 		left: 0;
 		bottom: -10%;
 		border-radius: 10upx;
 		opacity: 0.2;
 		transform: scale(0.9, 0.9);
 	}
 
 	.nav-li.cur {
 		color: #fff;
 		background: rgb(94, 185, 94);
 		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
 	}
 
 	.nav-name {
 		font-size: 28upx;
 		text-transform: Capitalize;
 		position: relative;
 	}
 
 	.nav-name::before {
 		content: "";
 		position: absolute;
 		display: block;
 		width: 40upx;
 		height: 6upx;
 		background: #fff;
 		bottom: 0;
 		right: 0;
 		opacity: 0.5;
 	}
 
 	.nav-name::after {
 		content: "";
 		position: absolute;
 		display: block;
 		width: 100upx;
 		height: 1px;
 		background: #fff;
 		bottom: 0;
 		right: 40upx;
 		opacity: 0.3;
 	}
 
 	.nav-name::first-letter {
 		font-weight: bold;
 		font-size: 36upx;
 		margin-right: 1px;
 	}
 
 	.nav-li text {
 		position: absolute;
 		right: 30upx;
 		top: 30upx;
 		font-size: 52upx;
 		width: 60upx;
 		height: 60upx;
 		text-align: center;
 		line-height: 60upx;
 	}
 
 	// 好玩动态
 	.dong {
 		z-index: 9999;
 		position: fixed;
 		top: -40px;
 		right: -80px;
 		transform: scale(0.24);
 		-webkit-transform: scale(0.24);
 		-moz-transform: scale(0.24);
 
 	}
 
 	.monster {
 		transform: rotate(-50deg);
 		-ms-transform: rotate(-50deg);
 		/* IE 9 */
 		-moz-transform: rotate(-50deg);
 		/* Firefox */
 		-webkit-transform: rotate(-50deg);
 		/* Safari 和 Chrome */
 		-o-transform: rotate(-50deg);
 		/* Opera */
 		display: flex;
 		justify-content: center;
 		position: relative;
 		width: 170px;
 		height: 400px;
 		border-top-left-radius: 200px;
 		border-top-right-radius: 200px;
 		background-color: #3C47D7;
 		box-shadow: 20px 20px 60px #4650E5;
 	}
 
 	.monster__face {
 		display: flex;
 		justify-content: center;
 		align-items: center;
 		flex-direction: column;
 		position: absolute;
 		top: 14%;
 		width: 75%;
 		height: 160px;
 	}
 
 	.monster__noses {
 		top: 50%;
 		display: flex;
 		justify-content: space-between;
 		width: 28%;
 		height: auto;
 		margin-bottom: 10px;
 	}
 
 	.monster__nose {
 		width: 8px;
 		height: 12px;
 		border-radius: 20px;
 		background: rgba(0, 0, 0, 0.5);
 		box-shadow: 4px 8px 5px rgba(0, 0, 0, 0.1);
 	}
 
 	.monster__mouth {
 		display: flex;
 		justify-content: center;
 		align-items: center;
 		position: relative;
 		width: 100%;
 		height: 0%;
 		overflow: hidden;
 		border: 25px solid #FFC333;
 		border-radius: 100px;
 		background-color: #810332;
 		animation: mouth 1.75s infinite;
 		box-shadow: 4px 8px 5px rgba(0, 0, 0, 0.2);
 		box-sizing: border-box;
 	}
 
 	.monster__mouth::before {
 		content: '';
 		position: absolute;
 		width: 150px;
 		height: 80px;
 		border-radius: 100px;
 		background-color: #400018;
 	}
 
 	.monster__mouth::after {
 		content: '';
 		position: absolute;
 		bottom: -80px;
 		width: 160px;
 		height: 80px;
 		border-top-left-radius: 50%;
 		border-top-right-radius: 50%;
 		background-color: #DC1B50;
 		animation: tongue 1.75s infinite;
 	}
 
 	.monster__top {
 		position: absolute;
 		top: -30px;
 		width: 170px;
 		height: 30px;
 		border-bottom-left-radius: 10px;
 		border-bottom-right-radius: 10px;
 		background-color: #ffffff;
 		z-index: 100;
 		animation: t 1.75s infinite;
 	}
 
 	.monster__bottom {
 		position: absolute;
 		bottom: 0;
 		width: 100px;
 		height: 30px;
 		border-top-left-radius: 10px;
 		border-top-right-radius: 10px;
 		background-color: #ffffff;
 		z-index: 100;
 		animation: b 1.75s infinite;
 	}
 
 
 	.avatar-eye {
 		position: absolute;
 		top: -10%;
 		width: 65px;
 		height: 65px;
 		background: linear-gradient(105deg, white, #cb87f4);
 		border-radius: 100%;
 		box-shadow: 4px 8px 5px rgba(0, 0, 0, 0.2);
 		margin: 3px;
 		-webkit-transform: translateX(-50%);
 		transform: translateX(-50%);
 	}
 
 
 	.avatar-eye--green {
 		background: linear-gradient(to bottom, #fdfdfd, #c3efea);
 	}
 
 	.avatar-eye--violet {
 		background: linear-gradient(to bottom, #fdfdfd, #e6d6f6);
 	}
 
 
 	.eye--left {
 		left: 10%;
 	}
 
 	.eye--right {
 		left: 85%;
 	}
 
 	.eye--center {
 		left: 45%;
 		top: 10%;
 	}
 
 	.avatar-eye-pupil {
 		position: absolute;
 		width: 55%;
 		height: 55%;
 		left: 50%;
 		top: 25%;
 		-webkit-transform: translate(-50%);
 		transform: translate(-50%);
 		z-index: 100;
 		border-radius: 100%;
 	}
 
 
 	.pupil--green {
 		background: linear-gradient(135deg, rgba(188, 248, 177, 0.7), #2fa38c 75%);
 	}
 
 	.pupil--pink {
 		background: linear-gradient(135deg, #f1a183, #8535cd);
 	}
 
 
 	.avatar-eye-pupil-blackThing {
 		position: absolute;
 		width: 55%;
 		height: 55%;
 		left: 50%;
 		top: 25%;
 		background: #2c2f32;
 		-webkit-transform: translate(-50%);
 		transform: translate(-50%);
 		border-radius: 100%;
 		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
 	}
 
 	.avatar-eye-pupil-lightReflection {
 		position: absolute;
 		width: 7px;
 		height: 7px;
 		left: 25%;
 		top: 10%;
 		background: #ebebeb;
 		-webkit-transform: translate(-50%);
 		transform: translate(-50%);
 		border-radius: 100%;
 		box-shadow: 10px 10px 10px rgba(255, 255, 255, 0.2);
 	}
 
 	/**/
 	@keyframes t {
 
 		0%,
 		10%,
 		80%,
 		100% {
 			top: -30px;
 		}
 
 		20% {
 			top: 0px;
 		}
 
 		30% {
 			top: -20px;
 		}
 
 		40% {
 			top: -0px;
 		}
 
 		50% {
 			top: -25px;
 		}
 
 		70% {
 			top: 0px;
 		}
 	}
 
 	@keyframes b {
 
 		0%,
 		10%,
 		80%,
 		100% {
 			bottom: -30px;
 		}
 
 		20% {
 			bottom: 0px;
 		}
 
 		30% {
 			bottom: -20px;
 		}
 
 		40% {
 			bottom: -0px;
 		}
 
 		50% {
 			bottom: -25px;
 		}
 
 		70% {
 			bottom: 0px;
 		}
 	}
 
 	@keyframes mouth {
 
 		0%,
 		10%,
 		100% {
 			width: 100%;
 			height: 0%;
 		}
 
 		15% {
 			width: 90%;
 			height: 30%;
 		}
 
 		20% {
 			width: 50%;
 			height: 70%;
 		}
 
 		25% {
 			width: 70%;
 			height: 70%;
 		}
 
 		30% {
 			width: 80%;
 			height: 60%;
 		}
 
 		35% {
 			width: 60%;
 			height: 70%;
 		}
 
 		40% {
 			width: 55%;
 			height: 75%;
 		}
 
 		45% {
 			width: 50%;
 			height: 90%;
 		}
 
 		50% {
 			width: 40%;
 			height: 70%;
 		}
 
 		55% {
 			width: 70%;
 			height: 95%;
 		}
 
 		60% {
 			width: 40%;
 			height: 50%;
 		}
 
 		65% {
 			width: 100%;
 			height: 60%;
 		}
 
 		70% {
 			width: 100%;
 			height: 70%;
 		}
 
 		75% {
 			width: 90%;
 			height: 70%;
 		}
 
 		80% {
 			width: 50%;
 			height: 70%;
 		}
 
 		85% {
 			width: 90%;
 			height: 50%;
 		}
 
 		85% {
 			width: 40%;
 			height: 70%;
 		}
 
 		90% {
 			width: 90%;
 			height: 30%;
 		}
 
 		95% {
 			width: 100%;
 			height: 10%;
 		}
 	}
 
 	@keyframes tongue {
 
 		0%,
 		20%,
 		100% {
 			bottom: -80px;
 		}
 
 		30%,
 		90% {
 			bottom: -40px;
 		}
 
 		40% {
 			bottom: -45px;
 		}
 
 		50% {
 			bottom: -50px;
 		}
 
 		70% {
 			bottom: -80px;
 		}
 
 		90% {
 			bottom: -40px;
 		}
 	}
 
 
 	// 顶部流星
 	.space {
 		position: absolute;
 		top: 0;
 		left: 0;
 	}
 
 	.planet {
 		width: 150rpx;
 		height: 150rpx;
 		border-radius: 50%;
 		background: #333;
 		position: absolute;
 		left: 50%;
 		top: 50%;
 		margin: -75rpx 0 0 -75rpx;
 		overflow: hidden;
 		z-index: 2;
 	}
 
 	.planet_shadow {
 		position: absolute;
 		border-radius: 50%;
 		height: 100%;
 		width: 100%;
 		top: -40%;
 		right: -10%;
 		border: 35rpx solid rgba(0, 0, 0, .15);
 	}
 
 	.star {
 		display: block;
 		width: 5rpx;
 		height: 5rpx;
 		border-radius: 50%;
 		background: #FFF;
 		top: 100rpx;
 		left: 400rpx;
 		position: relative;
 		transform-origin: 100% 0;
 		animation: star-ani 6s infinite ease-out;
 		box-shadow: 0 0 5rpx 5rpx rgba(255, 255, 255, .3);
 		opacity: 0;
 		z-index: 2;
 	}
 
 	.star:after {
 		content: '';
 		display: block;
 		top: 0rpx;
 		left: 4rpx;
 		border: 0rpx solid #fff;
 		border-width: 0rpx 90rpx 2rpx 90rpx;
 		border-color: transparent transparent transparent rgba(255, 255, 255, .3);
 		transform: rotate(-45deg) translate3d(1rpx, 3rpx, 0);
 		box-shadow: 0 0 1rpx 0 rgba(255, 255, 255, .1);
 		transform-origin: 0% 100%;
 		animation: shooting-ani 3s infinite ease-out;
 	}
 
 	.pink {
 		top: 30rpx;
 		left: 395rpx;
 		background: #ff5a99;
 		animation-delay: 5s;
 		-webkit-animation-delay: 5s;
 		-moz-animation-delay: 5s;
 	}
 
 	.pink:after {
 		border-color: transparent transparent transparent #ff5a99;
 		animation-delay: 5s;
 		-webkit-animation-delay: 5s;
 		-moz-animation-delay: 5s;
 	}
 
 	.blue {
 		top: 35rpx;
 		left: 432rpx;
 		background: cyan;
 		animation-delay: 7s;
 		-webkit-animation-delay: 7s;
 		-moz-animation-delay: 7s;
 	}
 
 	.blue:after {
 		/* border-color: transpareanimation-delay: 12s; */
 		-webkit-animation-delay: 7s;
 		-moz-animation-delay: 7s;
 		animation-delay: 7s;
 	}
 
 	.yellow {
 		top: 50rpx;
 		left: 600rpx;
 		background: #ffcd5c;
 		animation-delay: 5.8s;
 	}
 
 	.yellow:after {
 		border-color: transparent transparent transparent #ffcd5c;
 		animation-delay: 5.8s;
 	}
 
 	@keyframes star-ani {
 		0% {
 			opacity: 0;
 			transform: scale(0) rotate(0) translate3d(0, 0, 0);
 			-webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
 			-moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
 		}
 
 		50% {
 			opacity: 1;
 			transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
 			-webkit-transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
 			-moz-transform: scale(1) rotate(0) translate3d(-200rpx, 200rpx, 0);
 		}
 
 		100% {
 			opacity: 0;
 			transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
 			-webkit-transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
 			-moz-transform: scale(1) rotate(0) translate3d(-300rpx, 300rpx, 0);
 		}
 	}
 </style>
 <template>
 	<view>
 		<index @ShowNews="ShowNews" v-if="PageCur=='index'"></index>
 		<search v-if="PageCur=='search'"></search>
 		<cases v-if="PageCur=='cases'"></cases>
 		<news v-if="PageCur=='news'"></news>
 		<me v-if="PageCur=='me'"></me>
 
 		<view class="box">
 			<view class="cu-bar tabbar bg-white shadow foot">
 				<view class="action" @click="NavChange" data-cur="index">
 					<view class='cuIcon-cu-image'>
 						<image v-if="PageCur=='index'" src="../../static/tabBar/index_cur.png"></image>
 						<image v-if="PageCur != 'index'" src="../../static/tabBar/index.png"></image>
 					</view>
 					<view :class="PageCur=='index'?'color_main':'text-gray'">首页</view>
 				</view>
 
 				<view class="action" @click="NavChange" data-cur="search">
 					<view class='cuIcon-cu-image'>
 						<image v-if="PageCur=='search'" src="../../static/tabBar/shop_cur.png"></image>
 						<image v-if="PageCur != 'search'" src="../../static/tabBar/shop.png"></image>
 					</view>
 					<view :class="PageCur=='search'?'color_main':'text-gray'">今日语句</view>
 				</view>
 				<view class="action" @click="NavChange" data-cur="me">
 					<view class='cuIcon-cu-image'>
 						<!-- <view class="cu-tag badge"></view>红点 -->
 						<image v-if="PageCur=='me'" src="../../static/tabBar/me_cur.png"></image>
 						<image v-if="PageCur != 'me'" src="../../static/tabBar/me.png"></image>
 					</view>
 					<view :class="PageCur=='me'?'color_main':'text-gray'">个人中心</view>
 				</view>
 
 			</view>
 		</view>
 
 	</view>
 </template>
 
 <script>
 	import index from "./index.vue";	//首页
 	import search from "../home/home.vue";	//技术视频
 	import cases from "./main.vue";	//宅家学
 	import news from "./news.vue";	//资讯
 	import me from "./me.vue";	//个人中心
 	export default {
 		components: {
 			index,
 			search,
 			cases,
 			news,
 			me
 		},
 		data() {
 			return {
 				PageCur: 'index',
 				message: '2',
 				openId:'',
 				access_token:'',
 				tip:"我是提示",
 				duration:1
 
 			};
 		},
 		// 分享小程序
 		onShareAppMessage(res) {
 			return {
 				title: '乐子工具包,开源小程序，一起学习技术！',
 			};
 		},
 		onLoad(){
 			wx.showShareMenu({
 				withShareTicket: true
 			})
 		},
 		onShareTimeline() {
 			return {
 				title: '乐子工具包,开源小程序，一起学习技术！',
 			}
 		},
 		onLoad() {
 			//获取退出时的tabbar记录
 			// uni.getStorage({
 			// 	key: 'PageCur',
 			// 	success: function(res) {
 			// 		that.PageCur = res.data;
 			// 	},
 			// 	fail: function(res) {}
 			// });
 		},
 		methods: {
 			ShowNews(e){
 				console.log(e)
 				this.PageCur = e;
 			},
 			NavChange: function(e) {
 				console.log(e.currentTarget.dataset.cur)
 
 				this.PageCur = e.currentTarget.dataset.cur;
 
 				if (this.PageCur == 'index') {
 					// document.title = '首页'
 				} else if (this.PageCur == 'component') {
 					// document.title = '积分商城'
 				} else if (this.PageCur == 'cases') {
 					// document.title = '宅家学'
 				} else if (this.PageCur == 'news') {
 					// document.title = '文章资讯'
 				} else if (this.PageCur == 'me') {
 					// document.title = '个人中心'
 				}
 
 				// uni.setStorage({
 				// 	key: 'PageCur',
 				// 	data: this.PageCur,
 				// 	success: function() {
 				// 		console.log('保存成功！');
 				// 	}
 				// });
 			},
 			NavChange_xd: function() {
 				uni.navigateTo({
 					url: 'publish',
 					animationType: 'slide-in-bottom',
 					animationDuration: 200
 				});
 			}
 		}
 	}
 </script>
 
 <style lang="scss">
 	.box {
 		margin: 20upx 0;
 	}
 	.box view.cu-bar {
 		margin-top: 20upx;
 	}
 	
 	.logo_btn{
 		width: 38*2rpx;
 		height: 38*2rpx;
 		position: absolute;
 		z-index: 2;
 		border-radius: 50%;
 		top: -40rpx;
 		left: 0rpx;
 		right: 0;
 		margin: auto;
 		padding: 0;
 	}
 	.cu-bar.tabbar .action.add-action {
 	    padding-top: 56rpx !important;
 	}
 </style>
 <!-- pages/webview.vue -->
 <template>
   <view>
 	  <cu-custom bgColor="bg-gradual-blue" :isBack="false">
 		  <block slot="backText">返回</block>
 	  	  <block slot="content">详情</block>
 	  </cu-custom>
 	  <view class="cu-card article no-card">
 		  <web-view :src="url"></web-view>
 		</view>
     
   </view>
 </template>
 
 <script>
 export default {
   data() {
     return {
       url: ''
     };
   },
   onLoad(options) {
     // 获取传递过来的链接
     this.url = decodeURIComponent(options.url || '');
   }
 }
 </script>
 <template>
 <view>
   <view class="logo">
     <image src="/static/logo/144-144.png"></image>
   </view>
   <view class="login_from">
       <input placeholder="请输入手机号" v-model="mobile" type="number" maxlength="11" placeholder-style="color: #333"></input>
 	  <input placeholder="密码" v-model="password"  maxlength="20" type="password" placeholder-style="color: #333"></input>
 	   
       <view class="login_btn" @click="onlogin">登录</view>
 	  <view class="register">
 		  <text class="link " @click="navigateToRegister">没有账户，去注册</text>
 	  </view>
 		<view class="list-call" style="color: #666; margin-left:auto;margin-right: auto;padding-top: 30px;text-align: center;">
 			<text class="link" style="font-size: 14px;" @click="openAutoLogin" v-if="os=='app'">本机一键登录</text>  
 		</view>
   </view>
   <!-- #ifdef MP-WEIXIN -->
   <view class="login_from">
 	  <button class="login_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
   </view>
   <!-- #endif -->
 </view>
 </template>
 
 <script>
 // //引入 JSON 文件
 // const manifest = require('@/manifest.json');
 	
 // // 获取 appid
 // const appid = manifest.appid;
 // console.log('当前项目的 appid 是:', appid);
 import { setUserInfo,setToken } from "../../utils/auth";
 export default {
   data() {
     return {
 	  isReadChk: true,
       isCanUse: uni.getStorageSync('isCanUse'),
       mobile: '',
 	  password:'',
       avatarUrl: '',
       bgImg: ['', ''],
       imgTime: '',
       imgIndex: 0,
 	  codeName: '验证码',
       isCode: true,
 	  smscode:'',
 	  wxcode: '',
 	  showSmsLogin:false,
 	  password: '',
 	  openid:'',
 	  unionid:'',
 	  userinfowx:'',
 	  idfd:1,
 	  fxpid:0,
 	  islogin:false,
 	  isdl:false,
 	  code:'',
 	  anonymousCode:'',
 	  gender:0,
 	  nickName:'',
 	  btnDisbe:false,
 	  autoLogin:false,
 	  secret: 'b2EyMHF6ZDExMTExMTAwMA==',
 	  os:'',
     };
   },
   props: {},
   onLoad() {
   	let _this=this
   	uni.preLogin({
   		provider: 'univerify',
   		success(){  //
   			// 显示一键登录选项
   			console.log('预登录成功')
   			_this.autoLogin=true
   			console.log("this.autoLogin:"+_this.autoLogin)
   		},
   		fail(res){  // 预登录失败
   			console.log(res)
   		}
   	})
   	
   	this.os = uni.getSystemInfoSync().uniPlatform;
   	console.log("os:"+this.os)
   },
   methods: {
 	  //一键登录
 	  openAutoLogin(){
 	  	if(!this.autoLogin){
 	  			uni.showToast({ title: '请打开数据流量',icon:"none" });
 	  			return
 	  	}
 	  	let _self = this;
 	  	uni.login({
 	  		provider: 'univerify',
 	  		univerifyStyle: { // 自定义登录框样式
 	  		//参考`univerifyStyle 数据结构`
 	  		  "icon": {
 	  		        "path": "static/login/144-144.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
 	  		        "width":  "60px",  //图标宽度 默认值：60px
 	  		        "height": "60px"   //图标高度 默认值：60px
 	  		    },
 	  	  },
 	  		success(res){ // 登录成功
 	  			console.log(res);  // {openid:'登录授权唯一标识',access_to.ken:'接口返回的 token'}
 	  			// 在得到access_token后，通过callfunction调用云函数
 	  			uniCloud.callFunction({
 	  			  name: 'toolautologin',
 	  			  data: res.authResult
 	  			}).then(res => {
 	  				console.log("获取号码成功：")
 	  				console.log(res.result.phoneNumber)
 	  				if(res.result.code===0){
 	  						uniCloud.callFunction({
 	  						  name: 'applogreg',
 	  						  data: {
 	  						    mobile: res.result.phoneNumber,
 								password: "aaaaaa"
 	  						  }
 	  						}).then(res => {
 	  						  console.log(res.result);
 	  						  if (res.result.code === 200) {
 	  							console.log(res.result.data)
 								
 	  						    // 保存token和用户信息
 								setToken(res.result.data.token)
 	  							setUserInfo(res.result.data)
 	  							uni.showToast({
 	  								title:'登陆成功'
 	  							})
 	  							// 登录成功，可以关闭一键登录授权界面了
 	  							uni.closeAuthView()
 								uni.switchTab({
 								  url: '/pages/index/me',
 								  success: () => {
 								    console.log('跳转成功');
 								  },
 								  fail: (err) => {
 								    console.log('跳转失败', err);
 								  }
 								});
 	  							//uni.navigateBack(-1)
 	  						  }else{
 	  							  uni.showToast({
 	  							  	title: res.result.message,
 	  							  	icon: 'none'
 	  							  })
 	  						  }
 	  						  uni.hideLoading()
 	  						}).catch(err => {
 	  						  console.error(err);
 	  						  uni.showToast({
 	  						  	title: err.message,
 	  						  	icon: 'none'
 	  						  })
 	  						  uni.hideLoading()
 	  						});
 	  						
 	  				}else{
 	  					uni.showToast({ title: '登录失败',icon:"none" });
 	  				}
 	  			  
 	  			}).catch(err=>{
 	  			  // 处理错误
 	  			  console.log("获取错误："+err)
 	  			})
 	  			
 	  			//
 	  		},
 	  		fail(res){  // 登录失败
 	  			console.log(res)
 	  			if(res.errCode==30002){
 	  				uni.closeAuthView()
 	  			}else{
 	  				uni.showToast({ title: res.errMsg,icon:"none" });
 	  			}
 	  		}
 	  	})
 	  },
 	
 	checkboxChange(e) {
 		// console.log(e)
 		// console.log(e.detail.value)
 		// console.log(e.detail.value.length > 0)
 		this.isReadChk = e.detail.value.length > 0
 	},
 	navigateToRegister() {
 		uni.navigateTo({
 			url: '/pages/login/register'
 		});
 	},
 	navigateToAgreement() {
 		uni.navigateTo({
 			url: '/pages/me/agreement'
 		});
 	},
     getUserInfo() {
       let _this = this;
       uni.getUserInfo({
         provider: 'weixin',
         success: function (infoRes) {
           console.log(infoRes);
 		  
 		  let form = {code: _this.wxcode, userInfo: infoRes.userInfo}
 		  _this.request('/v1/login/weixin', form, 'POST').then(res=>{
 			  console.log("login: ", res)
 		  	_this.setData({
 		  	  mobile: infoRes.userInfo.mobile,
 		  	  //昵称
 		  	  avatarUrl: infoRes.userInfo.avatarUrl //头像
 		  	});
 		  	setToken(res.data.token) 
 		  	setUserInfo(infoRes.userInfo);  //模拟存储用户信息
 		  	try {
 		  	  uni.setStorageSync('isCanUse', 1); //记录是否第一次授权  false:表示不是第一次授权
 		  	  uni.switchTab({
 		  	    url: '/pages/views/tabBar/home'
 		  	  });
 		  	} catch (e) {
 		  	  console.log('缓存失败');
 		  	}
 		  	
 		  })
 		  
           
         },
 
         fail(res) {}
 
       });
     },
 	onlogin(){ //登录 模拟存储token
 	if (!this.isReadChk) {
 	        uni.showToast({
 	          title: '请先同意用户协议',
 	          icon: 'none'
 	        });
 	        return;
 	      } 
 	if(!this.mobile){
 		uni.showToast({ title: '手机号不能为空',icon:"none" });
 		return false;
 	}
 	const regex = /^1[3-9]\d{9}$/;
 	if(!regex.test(this.mobile)){
 		uni.showToast({ title: '输入正确手机号',icon:"none" });
 		return false;
 	}
 	if(!this.password){
 		uni.showToast({ title: '密码不能为空',icon:"none" });
 		return false;
 	}
 		let date = new Date().getTime()
 		//setToken(date)
 		// let user = {  //模拟存储用户信息
 		// 	avatarUrl: '../../static/logo/192-192.png',
 		// 	nickName: '游客'
 		// }
 		// setUserInfo(user)
 		
 		
 		// setUserInfo(infoRes.userInfo);  //模拟存储用户信息
 		uni.showLoading({
 			title:'登录中...'
 		})
 		/*setTimeout(()=>{
 			uni.hideLoading()
 			uni.showToast({
 				title:'登陆成功'
 			})
 		}, 500)*/
 		
 		//console.log('当前项目的 appid 是:', appid);
 		uniCloud.callFunction({
 		  name: 'applogin',
 		  data: {
 		    mobile: this.mobile,
 		    password: this.password
 		  }
 		}).then(res => {
 		  console.log(res.result);
 		  if (res.result.code === 200) {
 		    // 保存token和用户信息
 			setToken(res.result.data.token)
 			setUserInfo(res.result.data)
 			uni.showToast({
 				title:'登陆成功'
 			})
 			uni.switchTab({
 			  url: '/pages/index/me',
 			  success: () => {
 			    console.log('跳转成功');
 			  },
 			  fail: (err) => {
 			    console.log('跳转失败', err);
 			  }
 			});
 		  }else{
 			  uni.showToast({
 			  	title: res.result.message,
 			  	icon: 'none'
 			  })
 		  }
 		  uni.hideLoading()
 		}).catch(err => {
 		  console.error(err);
 		  uni.showToast({
 		  	title: err.message,
 		  	icon: 'none'
 		  })
 		  uni.hideLoading()
 		});
 	},
 	getCode() { //获取用户短信验证码
 		if(this.isCode == false){
 			return
 		}
 		if (this.tel == '') {
 			uni.showToast({
 				title: '请输入手机号',
 				icon: 'none'
 			})
 			return
 		}
 		if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.tel)) {
 			uni.showToast({
 				title: '请填写正确手机号码',
 				icon: 'none'
 			});
 			return false;
 		}
 		this.getPhoneCode()
 	},
 	getPhoneCode() {
 		let timer = ''
 		let date = 120
 		let that = this
 		if (that.isCode == true) {
 			uni.showToast({
 				title: '验证码发送成功~',
 				icon: 'none'
 			})
 			clearInterval(timer)
 			setInterval(() => {
 				if (date >= 1) {
 					date--
 					that.codeName = date + '秒重试'
 					that.isCode = false
 				} else {
 					that.isCode = true
 					that.codeName = '验证码'
 					clearInterval(timer)
 				}
 			}, 1000)
 		}
 	},
 	wxlogin() {
 	  // 1.wx获取登录用户code
 	  let _this = this;
 	  uni.login({
 	    provider: 'weixin',
 	    success: function (loginRes) {
 	      console.log('这是用户的code', loginRes);
 		  _this.setData({
 			  wxcode: loginRes.code
 		  });
 	    }
 	  });
 	},
 	onAuthorize(){ //微信公众号授权登录
 		uni.showToast({
 			title:'对接你的公众号登录方法',
 			icon:"none"
 		})
 	}
   }
 };
 </script>
 <style scoped lang="scss">
 .agreement{
 	padding-top: 20px;
 }
 .register{
 	padding-top: 20px;
 }
 .login{
   height: 100%;
   width: 100%;
   position: fixed;
   top: 0;
   left: 0;
   transition: all 0.6s ease-in-out;
   background-color: #333;
 }
 .logo image{
   height: 160upx;
   width: 160upx;
   display: block;
   border-radius: 50%;
   margin: 0 auto;
   margin-top: 120upx;
 }
 .login_from{
   width: 80vw;
   margin: 0 auto;
   margin-top: 5vh;
 }
 .login_from .codes{
 	display: flex;
 	align-items: center;
 	align-content: center;
 	justify-content: space-between;
 }
 .login_from input{
   height: 90upx;
   line-height: 90upx;
   margin-bottom: 60upx;
   background-color: rgba(255, 255, 255, 0.8);
   box-sizing: border-box;
   padding: 0 30upx;
   border-radius: 10upx;
   font-size: 30upx;
   color: #333;
 }
 .codes input{
 	width: 75%;
 }
 .agreement {
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
     font-size: 30rpx;
     margin-top: 80rpx;
     color: #FFA800;
     text-align: center;
     height: 40rpx;
     line-height: 40rpx;
   }
 .codes view{
 	height: 80upx;
 	line-height: 80upx;
 	width: 130upx;
 	margin-bottom: 60upx;
 	color: #FFFFFF;
 	background-color: rgba(70, 143, 152, 0.8);
 	text-align: center;
 	font-size: 24upx;
 	border-radius: 10upx;
 }
 .login_btn{
   width: 100%;
   height: 90upx;
   margin: 0 auto;
   background-color: rgba(70, 143, 152, 0.8);
   margin-top: 30px;
   text-align: center;
   line-height: 90upx;
   border-radius: 40upx;
   color: #fff;
   font-size: 30upx;
 }
 .login_btn:active{
   opacity: 0.9;
 }
 .wxLogin{
   height: 200upx;
   width: 300upx;
   display: block;
   margin: 0 auto;
   border-radius: 50%;
   position: fixed;
   bottom: 5vh;
   left: 50%;
   transform: translateX(-50%);
 }
 .link{
 	color: rgba(70, 143, 152, 0.8)
 }
 .wxLogin view{
   text-align: center;
   color: #FFFFFF;
   font-size: 24upx;
   margin-bottom: 20upx;
 }
 .wxLogin image{
   height: 100upx;
   width: 100upx;
   display: block;
   z-index: 10;
   margin: 0 auto;
 }
 .wxLogin button{
   width: 100upx!important;
   height: 100upx;
   position: absolute;
   border-radius: 50%;
   text-align: center;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   opacity: 0;
   z-index: 10;
   padding: 0!important;
 }
 </style>
 <template>
   <view class="content">
 	  <cu-custom bgColor="bg-gradual-blue" :isBack="true">
 	  		<block slot="content">登录</block>
 	  	</cu-custom>
     <view class="header">
       <image src="/static/login/144-144.png"></image>
     </view>
 	<view class="list-call" style="color: #666; margin-left:auto;margin-right: auto;">
 		<text style="font-size: 14px;" @click="openAutoLogin" v-if="os=='app'">本机一键登录</text>  
 	</view>
   </view>
 </template>
 
 <script>
 	import { setUserInfo,setToken } from "../../utils/auth";
   export default {
     data() {
       return {
 		showSmsLogin:false,
         username: '',
         password: '',
 		openid:'',
 		unionid:'',
 		userinfowx:'',
 		idfd:1,
 		fxpid:0,
 		islogin:false,
 		isdl:false,
 		code:'',
 		anonymousCode:'',
 		gender:0,
 		nickName:'',
 		btnDisbe:false,
 		autoLogin:false,
 		secret: 'b2EyMHF6ZDExMTExMTAwMA==',
 		os:'',
       };
     },
 	onLoad(e) {
 		let _this=this
 		uni.preLogin({
 			provider: 'univerify',
 			success(){  //
 				// 显示一键登录选项
 				console.log('预登录成功')
 				_this.autoLogin=true
 				console.log("this.autoLogin:"+_this.autoLogin)
 			},
 			fail(res){  // 预登录失败
 				console.log(res)
 			}
 		})
 		
 		this.os = uni.getSystemInfoSync().uniPlatform;
 		console.log("os:"+this.os)
 		
 		//this.$app.recordVisitLog()
 	},
     methods: {
 	  //一键登录
 	  openAutoLogin(){
 	  	if(!this.autoLogin){
 	  			uni.showToast({ title: '请打开数据流量',icon:"none" });
 	  			return
 	  	}
 	  	let _self = this;
 	  	uni.login({
 	  		provider: 'univerify',
 	  		univerifyStyle: { // 自定义登录框样式
 	  		//参考`univerifyStyle 数据结构`
 	  		  "icon": {
 	  		        "path": "static/login/144-144.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
 	  		        "width":  "60px",  //图标宽度 默认值：60px
 	  		        "height": "60px"   //图标高度 默认值：60px
 	  		    },
 	  	  },
 	  		success(res){ // 登录成功
 	  			console.log(res);  // {openid:'登录授权唯一标识',access_to.ken:'接口返回的 token'}
 	  			// 在得到access_token后，通过callfunction调用云函数
 	  			uniCloud.callFunction({
 	  			  name: 'toolautologin',
 	  			  data: res.authResult
 	  			}).then(res => {
 	  				console.log("获取号码成功：")
 	  				console.log(res)
 	  				if(res.result.code===0){
 						uniCloud.callFunction({
 						  name: 'applogin',
 						  data: {
 						    mobile: res.result.phoneNumber
 						  }
 						}).then(res => {
 						  console.log(res.result);
 						  if (res.result.code === 200) {
 							console.log(res.result.data)
 						    // 保存token和用户信息
 							setUserInfo(res.result.data)
 							uni.showToast({
 								title:'登陆成功'
 							})
 							// 登录成功，可以关闭一键登录授权界面了
 							uni.closeAuthView()
 							//uni.navigateBack(-1)
 						  }else{
 							  uni.showToast({
 							  	title: res.result.message,
 							  	icon: 'none'
 							  })
 						  }
 						  uni.hideLoading()
 						}).catch(err => {
 						  console.error(err);
 						  uni.showToast({
 						  	title: err.message,
 						  	icon: 'none'
 						  })
 						  uni.hideLoading()
 						});
 						
 	  				}else{
 	  					uni.showToast({ title: '登录失败',icon:"none" });
 	  				}
 	  			  
 	  			}).catch(err=>{
 	  			  // 处理错误
 	  			  console.log("获取错误："+err)
 	  			})
 	  			
 	  			//
 	  		},
 	  		fail(res){  // 登录失败
 	  			console.log(res)
 	  			if(res.errCode==30002){
 	  				uni.closeAuthView()
 	  			}else{
 	  				uni.showToast({ title: res.errMsg,icon:"none" });
 	  			}
 	  		}
 	  	})
 	  },
 	  //短信验证码登录
 	  smsLogin(obj){
 		console.log("smsLogin*******************************")  
 		//console.log(obj)
 		
 		//plus.os.name == 'iOS'
 						
 		let param = {
 			type:"sms",
 			username: obj.username.trim(),
 			password: obj.code,
 			timestamp:Date.now(),
 			so:'dj',
 		};
 		const iv = CryptoJS.enc.Utf8.parse('') // 初始化向量
 		const encrypted = CryptoJS.AES.encrypt(JSON.stringify(param), CryptoJS.enc.Utf8.parse(decode(this.secret)), {
 		  iv: iv,
 		  mode: CryptoJS.mode.ECB,
 		  padding: CryptoJS.pad.Pkcs7
 		})
 		let cipherpassword = encrypted.toString()
 		
 		let _self = this;
 		login({username: 'aaa', password:"000",secret:cipherpassword}).then(res => {
 			uni.setStorageSync('uniIdToken', res.access_token)
 			uni.setStorageSync('access_token', res.access_token)
 			uni.setStorageSync('username', _self.username)
 			uni.setStorageSync('password', _self.password)
 			_self.loadUserInfo()
 		}).catch(error => {
 			console.log("出错了******************************")
 			uni.showToast({ title: error.error_description,icon:"none" });
 		})
 	  },
 	  loadUserInfo(){
 		getUserInfo().then(response => {
 			let userInfo=response.data
 			userInfo.token=uni.getStorageSync("access_token")
 			//this.$tool.setStorage('userInfo', response.data)
 			uni.setStorage({//缓存配置信息
 				key: 'avatar',  
 				data: userInfo.avatar
 			})
 			uni.setStorage({//缓存配置信息
 				key: 'userinfo',  
 				data: userInfo
 			})
 			uni.navigateBack();
 		})
 	  },
 	  getUserInfo1(){
 	  	var this_=this
 	                 //console.log("aaaa")
 	                 uni.getUserProfile({
 	                     desc:'Wexin',     // 这个参数是必须的
 	                     success:res=>{
 	  					   console.log(res);
 	                         this_.userinfowx=res.userInfo
 	                         this_.wxlogin()
 	                     },
 	                     fail:err=>{
 	                         console.log(err)
 	                     }
 	                 })
 	  },
 	  getuserinfo: function(){
 		  uni.showLoading({
 		  	title: '授权中...'
 		  });
 		var this_=this
 	  	// wx登录
 	  	wx.login({
 	  	  success (res) {
 	  	    if (res.code) {
 	  	      //发起网络请求
 	  		  var code = res.code
 	  		  	// 获取微信用户信息
 	  			wx.getUserInfo({
 	  			  success: function(res) {
 					this_.userinfowx=res.userInfo
 					this_.wxlogin()
 	  			  },
 	  			  fail:res=>{
 	  			      // 获取失败的去引导用户授权 
 	  			   }
 	  			})
 	  			
 	  	    } else {
 	  			
 	  	    }
 	  	  }
 	  	})
 	  },
 	  wxlogin(){
 		  var userinfowx=this.userinfowx
 		  var this_=this
 		  uni.login({
 		       timeout: 10000,
 		        provider: 'weixin',  //如果是uniapp，在这里需要标明平台的类型，支持的参数请查阅uniapp官网的uni.login()文档
 		        success: (res) => {
 					//console.log(res);
 		  			//登陆成功的回调
 					uni.hideLoading();
 					uni.request({
 					      url: this.configs.webUrl+'/api/user/getOpenid',  
 					      method:'GET',  
 					      data: {   
 					          //token: uni.getStorageSync("userinfo").token,       //你的小程序的secret,  
 					          code: res.code                        //wx.login 登录成功后的code  
 					      },  
 					      success: (cts) => {  
 							  if(cts.data.code==1){
 								  this_.openid=cts.data.data.openid
 								  this_.unionid=cts.data.data.unionid
 								  uni.showModal({
 								  	title: '温馨提示',
 								  	content: '授权成功',
 								  	showCancel: false,
 								  	confirmText: "确定",
 								  	success: function (res) {
 										if (res.confirm) {
 											console.log(cts.data.msg);
 											if(cts.data.msg=='登录成功'){
 												this_.logins(cts.data.data)
 											}else{
 												this_.opsdd(cts.data.data)
 											}
 										} else if (res.cancel) {
 											
 										}
 										
 								  	}
 								  });
 							  }else{
 								  uni.showModal({
 								  	title: '温馨提示',
 								  	content: JSON.stringify(cts.data),
 								  	showCancel: false,
 								  	confirmText: "确定",
 								  	success: function (res) {
 								  		if (res.confirm) {
 								  			//uni.navigateBack();
 								  		} else if (res.cancel) {
 								  			
 								  		}
 								  	}
 								  });
 							  }
 					      },
 						  fail: (err1) => {
 						  	console.log(err1);
 						     	uni.hideLoading();
 						  }
 					});
 		  	  },
 		        fail: (err) => {
 		           	uni.hideLoading();
 		        }
 		  })
 	  },
 	  logins(data){
 		  if(data.userinfo.avatar){
 		  			var str = data.userinfo.avatar;
 		  			if(str.indexOf("data:image") != -1){
 		  				var avatar='';
 		  			}else{
 		  				if(str.indexOf("http") != -1){
 		  					avatar=data.userinfo.avatar;
 		  				}else{
 		  					avatar=this.configs.imgUrl+data.userinfo.avatar;
 		  				}
 		  			}
 		  		}else{
 		  			var avatar='';
 		  		}
 		  uni.setStorage({//缓存配置信息
 		  	key: 'avatar',  
 		  	data: avatar
 		  })
 		  uni.setStorage({//缓存配置信息
 		  	key: 'userinfo',  
 		  	data: data.userinfo
 		  })
 		  uni.setStorage({//缓存配置信息
 		  	key: 'config',  
 		  	data: data.config
 		  })
 		  if(this.fxpid>0){
 		  	uni.switchTab({
 		  		url:'/pages/client/member/index'
 		  	})
 		  }else{
 				uni.navigateBack();
 		  }
 		  
 	  },
 	  opsdd(data){
 		  this.userinfowx.openid=this.openid
 		  uni.setStorage({//缓存配置信息
 		  	key: 'userinfowx',  
 		  	data: this.userinfowx
 		  })
 		  var urlsa1='/pages/login/loginwxxcx?fxpid='+this.fxpid
 		  if(data.dltel){
 			  urlsa1='/pages/login/loginwxxcx?dltel='+data.dltel+'&fxpid='+this.fxpid
 		  }
 		  uni.navigateTo({
 		  	url:urlsa1
 		  })	
 	  },
 	  onGetPhoneNumber(e) {
 		  var this_=this
 		  if(!this.openid){
 			  uni.showModal({
 			  		title: '温馨提示',
 			  		content: '请先授权',
 			  		showCancel: false,
 			  		confirmText: "确定",
 			  		success: function (res) {
 			  			//this_.getuserinfo()
 			  		}
 			  });
 			  return false;
 		  }
 		  uni.login({
 		       timeout: 10000,
 		        provider: 'weixin',  //如果是uniapp，在这里需要标明平台的类型，支持的参数请查阅uniapp官网的uni.login()文档
 		        success: (res) => {
 				console.log(res);
 				console.log("onGetPhoneNumber", e);  
 				uni.request({
 					  url: this.configs.webUrl+'/api/user/getphone',  
 					  method:'GET',  
 					  data: {    
 						  openid:this.openid,
 						  userinfowx:this.userinfowx,
 						  code: res.code,
 						  iv: e.detail.iv,
 						  encryptedData:e.detail.encryptedData,  
 					  },  
 					  success: (cts) => {
 						  console.log(cts.data);
 						  uni.showModal({
 						  		title: '温馨提示',
 						  		content: JSON.stringify(cts.data),
 						  		showCancel: false,
 						  		confirmText: "确定",
 						  		success: function (res) {
 						  			if (res.confirm) {
 						  				//uni.navigateBack();
 						  			} else if (res.cancel) {
 						  										
 						  			}
 								}
 						  });
 					  },
 					  fail: (err1) => {
 						console.log(err1);
 							//失败的回调
 					  }
 				});
 			},
 			fail: (err) => {
 			     	//登陆失败的回调
 			},
 		})
 	  } 
     }
   }
 </script>
 
 <style>
   .content {
     display: flex;
     flex-direction: column;
     justify-content: center;
   }
 
   .header {
     width: 161rpx;
     height: 161rpx;
     background: rgba(63, 205, 235, 1);
     box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
     border-radius: 50%;
     margin-top: 30rpx;
     margin-left: auto;
     margin-right: auto;
   }
 
   .header image {
     width: 161rpx;
     height: 161rpx;
     border-radius: 50%;
   }
 
   .list {
     display: flex;
     flex-direction: column;
     padding-top: 50rpx;
     padding-left: 70rpx;
     padding-right: 70rpx;
   }
 
   .list-call {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     height: 100rpx;
     color: #333333;
     border-bottom: 0.5px solid #e2e2e2;
   }
 
   .list-call .img {
     width: 40rpx;
     height: 40rpx;
   }
 
   .list-call .sl-input {
     flex: 1;
     text-align: left;
     font-size: 32rpx;
     margin-left: 16rpx;
   }
 
   .button-login {
     color: #FFFFFF;
     font-size: 34rpx;
     width: 470rpx;
     height: 100rpx;
     background: linear-gradient(-90deg, rgba(75, 196, 93, 1), rgba(188, 226, 158, 1));
     box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
     border-radius: 50rpx;
     line-height: 100rpx;
     text-align: center;
     margin-left: auto;
     margin-right: auto;
     margin-top: 100rpx;
   }
 .button-login1 {
     color: #FFFFFF;
     font-size: 34rpx;
     width: 470rpx;
     height: 80rpx;
     background: linear-gradient(-90deg, rgba(75, 196, 93, 1), rgba(188, 226, 158, 1));
     box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
     border-radius: 50rpx;
     line-height: 80rpx;
     text-align: center;
     margin-left: auto;
     margin-right: auto;
     margin-top: 30rpx;
 	color: #fff;
   }
   .button-login2 {
       color: #FFFFFF;
       font-size: 34rpx;
       width: 470rpx;
       height: 80rpx;
       background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
       box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
       border-radius: 50rpx;
       line-height: 80rpx;
       text-align: center;
       margin-left: auto;
       margin-right: auto;
       margin-top: 30rpx;
   	color: #fff;
     }
   .button-hover {
     background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
   }
 
   .agreenment {
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
     font-size: 30rpx;
     margin-top: 80rpx;
     color: #FFA800;
     text-align: center;
     height: 40rpx;
     line-height: 40rpx;
   }
 
   .agreenment text {
     font-size: 24rpx;
     margin-left: 15rpx;
     margin-right: 15rpx;
   }
   .preview-wrap {
   	position: absolute;
   	top: 0;
   	left: 0;
   	right: 0;
   	bottom: 0;
   	background-color: rgba(0, 0, 0, .8);
   }
   
   .preview {
   	position: absolute;
   	top: 0;
   	left: 0;
   	right: 0;
   	bottom: 0;
   	margin: auto;
   	width: 80%;
   	height: 400rpx;
   	border-radius: 12px;
   	background-color: #fff;
   }
   
   .new-avatar {
   	width: 500rpx;
   	height: 500rpx;
   	margin: 40rpx auto 0;
   	border: 1px solid #b3e6e6;
   	border-radius: 4px;
   	overflow: hidden;
   }
   .hint {
   	font-size: 28rpx;
 	color: #999999;
   	text-align: center;
   	margin: 110rpx auto 0;
   }
 </style>
 <template>
   <view>
     <web-view :webview-styles="webviewStyles" :src="articleurl"></web-view>
   </view>
 </template>
 
 <script>
   export default {
     data() {
       return {
         articleurl: '',
         webviewStyles: {
           progress: {
             color: '#FF7200'
           }
         }
       };
     },
     onLoad(options) {
       this.articleurl = options.url;
 	  //this.$app.recordVisitLog()
     }
   }
 </script>
 
 <style>
 
 </style>
 <template>
 <view>
   <view class="logo">
     <image src="/static/logo/144-144.png"></image>
   </view>
   <view class="login_from">
       <input placeholder="手机号" v-model="mobile" type="number" maxlength="11" placeholder-style="color: #333"></input>
 	  <input placeholder="密码" v-model="password"  maxlength="20" type="password" placeholder-style="color: #333"></input>
 		<view class="agreement">
 	   <checkbox-group @change="checkboxChange">
 	   	<label>
 	   		<checkbox value="readCb" :checked="isReadChk"/>我已阅读并同意
 	   	</label>
 	   	<text class="link" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/agreement.html')">《用户协议》</text>
 		<text class="link" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/privacy.html')">《隐私协议》</text>
 	   </checkbox-group>
 	   </view>
       <view class="login_btn" @click="onlogin">注册</view>
 	<view class="register">
 		  <text class="link " @click="navigateToRegister">返回登录</text>
 	  </view>
   </view>
   <!-- #ifdef MP-WEIXIN -->
   <view class="login_from">
 	  <button class="login_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
   </view>
   <!-- #endif -->
 </view>
 </template>
 
 <script>
 import { setUserInfo,setToken } from "../../utils/auth";
 export default {
   data() {
     return {
 	  isReadChk: false,
       isCanUse: uni.getStorageSync('isCanUse'),
       mobile: '',
 	  username:'',
 	  password:'',
       avatarUrl: '',
       bgImg: ['', ''],
       imgTime: '',
       imgIndex: 0,
 	  codeName: '验证码',
       isCode: true,
 	
 	  smscode:'',
 	  wxcode: ''
     };
   },
   props: {},
   methods: {
 	checkboxChange(e) {
 		// console.log(e)
 		// console.log(e.detail.value)
 		// console.log(e.detail.value.length > 0)
 		this.isReadChk = e.detail.value.length > 0
 	},
 	navigateToRegister() {
 		uni.navigateTo({
 			url: '/pages/login/login'
 		});
 	},
 	navTo(url){
 		uni.navigateTo({
 			url:url,
 			animationType: 'slide-in-bottom',
 		})
 	},
 	navsTo(url){
 		uni.navigateTo({
 			url:url
 		})
 	},
 	onlogin(){ //登录 模拟存储token
 	if (!this.isReadChk) {
 	        uni.showToast({
 	          title: '请先同意用户协议',
 	          icon: 'none'
 	        });
 	        return;
 	      } 
 	
 		let date = new Date().getTime()
 		if(!this.mobile){
 			uni.showToast({ title: '手机号不能为空',icon:"none" });
 			return false;
 		}
 		const regex = /^1[3-9]\d{9}$/;
 		if(!regex.test(this.mobile)){
 			uni.showToast({ title: '输入正确手机号',icon:"none" });
 			return false;
 		}
 		if(!this.password){
 			uni.showToast({ title: '密码不能为空',icon:"none" });
 			return false;
 		}
 		uni.showLoading({
 			title:'注册中...'
 		})
 		uniCloud.callFunction({
 		  name: 'appregister',
 		  data: {
 		    mobile: this.mobile,
 		    password: this.password
 		  }
 		}).then(res => {
 			uni.hideLoading()
 		  console.log(res.result);
 		  if (res.result.code === 200) {
 		    // 保存token和用户信息
 			setToken(res.result.data.token)
 			setToken(res.result.data)
 			uni.showToast({
 				title:'注册成功'
 			})
 			uni.navigateBack(-1)
 		  }else{
 			  uni.showToast({
 			  	title: res.result.message,
 			  	icon: 'none'
 			  })
 		  }
 		  uni.hideLoading()
 		}).catch(err => {
 			uni.hideLoading()
 		  console.error(err);
 		  uni.showToast({
 		  	title: err.message,
 		  	icon: 'none'
 		  })
 
 		});
 	}
   }
 };
 </script>
 <style scoped lang="scss">
 	.register{
 		padding-top: 20px;
 	}
 .agreement{
 	padding-top: 20px;
 }
 .login{
   height: 100%;
   width: 100%;
   position: fixed;
   top: 0;
   left: 0;
   transition: all 0.6s ease-in-out;
   background-color: #eee;
 }
 .logo image{
   height: 160upx;
   width: 160upx;
   display: block;
   border-radius: 50%;
   margin: 0 auto;
   margin-top: 120upx;
 }
 .login_from{
   width: 80vw;
   margin: 0 auto;
   margin-top: 5vh;
 }
 .login_from .codes{
 	display: flex;
 	align-items: center;
 	align-content: center;
 	justify-content: space-between;
 }
 .login_from input{
   height: 90upx;
   line-height: 90upx;
   margin-bottom: 60upx;
   background-color: rgba(255, 255, 255, 0.8);
   box-sizing: border-box;
   padding: 0 30upx;
   border-radius: 10upx;
   font-size: 30upx;
   color: #333;
 }
 .codes input{
 	width: 75%;
 }
 .codes view{
 	height: 80upx;
 	line-height: 80upx;
 	width: 130upx;
 	margin-bottom: 60upx;
 	color: #FFFFFF;
 	background-color: rgba(70, 143, 152, 0.8);
 	text-align: center;
 	font-size: 24upx;
 	border-radius: 10upx;
 }
 .login_btn{
   width: 100%;
   height: 90upx;
   margin: 0 auto;
   background-color: rgba(70, 143, 152, 0.8);
   margin-top: 30px;
   text-align: center;
   line-height: 90upx;
   border-radius: 40upx;
   color: #fff;
   font-size: 30upx;
 }
 .login_btn:active{
   opacity: 0.9;
 }
 .wxLogin{
   height: 200upx;
   width: 300upx;
   display: block;
   margin: 0 auto;
   border-radius: 50%;
   position: fixed;
   bottom: 5vh;
   left: 50%;
   transform: translateX(-50%);
 }
 .link{
 	color: rgba(70, 143, 152, 0.8)
 }
 .wxLogin view{
   text-align: center;
   color: #FFFFFF;
   font-size: 24upx;
   margin-bottom: 20upx;
 }
 .wxLogin image{
   height: 100upx;
   width: 100upx;
   display: block;
   z-index: 10;
   margin: 0 auto;
 }
 .wxLogin button{
   width: 100upx!important;
   height: 100upx;
   position: absolute;
   border-radius: 50%;
   text-align: center;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   opacity: 0;
   z-index: 10;
   padding: 0!important;
 }
 </style>
 <template>
 	<view class="container">
 		<view class="list-cell  m-t b-b" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/agreement.html')" hover-class="cell-hover" :hover-stay-time="50">
 			<text class="cell-tit">用户协议</text>
 			<image mode="aspectFit" style="width: 30upx; height: 30upx; margin-left: 50upx;float: right;" src="/static/icon/fh.png">
 		</view>
 		<view class="list-cell m-t b-b" @click="navTo('/pages/login/privacy?url=http://app.uy4.cn/static/upload/app/privacy.html')"  hover-class="cell-hover" :hover-stay-time="50">
 			<text class="cell-tit">隐私协议</text>
 			<image mode="aspectFit" style="width: 30upx; height: 30upx; margin-left: 10upx;" src="/static/icon/fh.png">
 		</view>
 
 	</view>
 </template>
 
 <script>
 	import { mapMutations} from 'vuex';
 	export default {
 		data() {
 			return {
 				urls:'',
 			};
 		},
 		onLoad(){
 			//this.$app.recordVisitLog()
 		},
 		methods:{
 			navTo(url){
 				uni.navigateTo({
 					url:url,
 					animationType: 'slide-in-bottom',
 				})
 			},
 			navsTo(url){
 				uni.navigateTo({
 					url:url
 				})
 			},
 		},
 	}
 </script>
 
 <style lang='scss'>
 	page{
 	}
 	
 	.list-cell{
 		display:flex;
 		align-items:baseline;
 		padding: 20upx 30upx;
 		line-height:60upx;
 		position:relative;
 		background: #fff;
 		justify-content: center;
 		align-items: center;
 		
 		&.cell-hover{
 			background:#f8f8f8;
 		}
 		&.b-b:after{
 			left: 30upx;
 		}
 		&.m-t{
 			margin-top: 16upx; 
 		}
 		.cell-more{
 			align-self: baseline;
 			font-size:32upx;
 			color:#909399;
 			margin-left:10upx;
 		}
 		.cell-tit{
 			flex: 1;
 			font-size: 30upx;
 			color: #303133;
 			margin-right:10upx;
 		}
 		.cell-tip{
 			font-size: 28upx;
 			color: #909399;
 		}
 		switch{
 			transform: translateX(16upx) scale(.84);
 		}
 	}
 </style>
 <template>
 	<view class="container">		 
 		<view class="list-cell b-b" @click="navTo('/pages/me/gywm')" hover-class="cell-hover" :hover-stay-time="50">
 			<text class="cell-tit">关于我们</text>
 			<image mode="aspectFit" style="width: 30upx; height: 30upx;" src="/static/me/fh2.png">
 		</view>
 
 		<!-- #ifdef APP-PLUS -->
 		<view class="list-cell b-b" @click="clearStorage" hover-class="cell-hover" :hover-stay-time="50">
 			<text class="cell-tit">清除缓存</text>
 			<text class="cell-tip">{{currentSize}}</text>
 		</view>
 		<!-- #endif -->
 		<view class="list-cell log-out-btn" @click="toLogout">
 			<text class="cell-tit">退出登录</text>
 		</view>
 	</view>
 </template>
 
 <script>
 	import { removeToken,removeUserInfo } from '@/utils/auth';
 	import {   mapMutations  } from 'vuex';
 	export default {
 		data() {
 			return {
 				version:'',
 				currentSize:'0KB'
 			}
 		},
 		onLoad() {
 			// #ifdef APP-PLUS
 			// 获取本地应用资源版本号
 			plus.runtime.getProperty(plus.runtime.appid, (info) => {
 				//console.log(JSON.stringify(info));
 				 this.version = info.version;
 				 //this.appVersionCode = info.versionCode;
 			})
 			this.getStorageSize()
 			// #endif
 			//this.$app.recordVisitLog()
 		},
 		methods:{
 			...mapMutations(['logout']),
 
 			navTo(url){
 				uni.navigateTo({
 					url:url
 				})
 			},
 			//退出登录
 			toLogout(){
 				uni.showModal({
 				    content: '确定要退出登录么',
 				    success: (e)=>{
 				    	if(e.confirm){
 							removeToken()
 							removeUserInfo();
 				    		setTimeout(()=>{
 				    			uni.navigateBack();
 								// uni.switchTab({
 								//       url: '/pages/index/tabbar',
 								//       success: () => {
 								//         console.log('跳转成功');
 								//       },
 								//       fail: (err) => {
 								//         console.log('跳转失败', err);
 								//       }
 								//     });
 				    		}, 200)
 				    	}
 				    }
 				});
 			},
 			clearStorage() {
 				 let that = this;
 				let os = plus.os.name;
 				if (os == 'Android') {
 					let main = plus.android.runtimeMainActivity();
 					let sdRoot = main.getCacheDir();
 					let files = plus.android.invoke(sdRoot, "listFiles");
 					let len = files.length;
 					console.log(files, len)
 					for (let i = 0; i < len; i++) {
 						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
 						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
 							if (entry.isDirectory) {
 								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录
 									that.files = []
 									uni.showToast({
 										title: '清除成功',
 										duration: 2000,
 										icon:'none'
 									});
 									that.getStorageSize(); // 重新计算缓存
 								}, function(e) {
 									console.log(e.message)
 								});
 							} else {
 								entry.remove();
 							}
 						}, function(e) {
 							console.log('文件路径读取失败')
 						});
 					}
 				} else { // ios
 					plus.cache.clear(function() {
 						uni.showToast({
 							title: '清除成功',
 							duration: 2000
 						});
 						that.getStorageSize();
 					});
 				}
 			},
 			getStorageSize() {
 				let that = this;
 				plus.cache.calculate(function(size) {
 					let sizeCache = parseInt(size);
 					if (sizeCache == 0) {
 						that.currentSize = "0B";
 					} else if (sizeCache < 1024) {
 						that.currentSize = sizeCache + "B";
 					} else if (sizeCache < 1048576) {
 						that.currentSize = (sizeCache / 1024).toFixed(2) + "KB";
 					} else if (sizeCache < 1073741824) {
 						that.currentSize = (sizeCache / 1048576).toFixed(2) + "MB";
 					} else {
 						that.currentSize = (sizeCache / 1073741824).toFixed(2) + "GB";
 					}
 				});
 			}
 		}
 	}
 </script>
 
 <style lang='scss'>
 	page{
 	}
 	.list-cell{
 		display:flex;
 		align-items:baseline;
 		padding: 20upx 30upx;
 		line-height:60upx;
 		position:relative;
 		background: #fff;
 		justify-content: center;
 		&.log-out-btn{
 			margin-top: 40upx;
 			.cell-tit{
 				color: #fb603d;
 				text-align: center;
 				margin-right: 0;
 			}
 		}
 		&.cell-hover{
 			background:#fafafa;
 		}
 		&.b-b:after{
 			left: 30upx;
 		}
 		&.m-t{
 			margin-top: 16upx; 
 		}
 		.cell-more{
 			align-self: baseline;
 			font-size:32upx;
 			color:#909399;
 			margin-left:10upx;
 		}
 		.cell-tit{
 			flex: 1;
 			font-size: 30upx;
 			color: #303133;
 			margin-right:10upx;
 		}
 		.cell-tip{
 			font-size:28upx;
 			color: #909399;
 		}
 		switch{
 			transform: translateX(16upx) scale(.84);
 		}
 	}
 </style>
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
 <template>
 	<view class="tools">
 		<u-input v-model="value" type="textarea" :border="true" height="200" :auto-height="true" />
 		<view class="btns">
 			<view class="btn2" @tap="traditionalToSimplified()">繁体转换为简体</view>
 			<view class="btn" @tap="simplifiedToTraditional()">简体转换为繁体</view>
 			<!-- <view class="btn" @tap="tansfer(3)">转换为火星文</view> -->
 		</view>
 		<u-input v-model="result" placeholder="匹配结果" type="textarea" :border="true" height="200" :auto-height="true" />
 		<button class="clear" @tap="clear()">清空</button>
 	</view>
 </template>
 
 <script>
 import * as opencc from 'opencc-js';
 	var app = getApp();
 	export default {
 		data() {
 			return {
 				colors: '',
 				value: '',
 				result: ''
 			};
 		},
 		components: {
 		},
 		props: {},
 
 		
 		onLoad: function(options) {
 			// this.setData({
 				this.colors=app.globalData.newColor
 			// });
 		},
 		methods: {
 			// tansfer(index){
 			// 	if(index == 1){
 			// 		this.simplifiedToTraditional()
 			// 	} else if(index == 2){
 			// 		this.traditionalToSimplified()
 			// 	}
 			// },
 			clear(){
 				this.value = '';
 				this.result = '';
 			},
 			simplifiedToTraditional() {
 			    const converter = opencc.Converter({ from: 'cn', to: 'twp' });
 			     this.result = converter(this.value);
 			},
 			traditionalToSimplified() {
 			    const converter = opencc.Converter({ from: 'twp', to: 'cn' });
 			    this.result = converter(this.value);
 			}
 		}
 	};
 </script>
 <style lang="scss" scoped>
 	page {
 		background-color: #F5F5FA;
 	}
 	.tools .btns{
 		display: flex;
 	}
 	.tools .btns .btn{
 		flex: 1;
 		text-align: center;
 		color: #fff;
 		background-color: #3280fc;
 		border-color: #1970fc;
 		padding: 28upx 0;
 	}
 	.tools .btns .btn2{
 		flex: 1;
 		text-align: center;
 		color: #fff;
 		background-color: #32c4fc;
 		border-color: #32c4fc;
 		padding: 28upx 0;
 	}
 	.clear{
 		margin: 20px 0;
 		background-color: #0076FF;
 		color: #ffffff;
 		font-size: 30upx;
 	}
 </style>
 <template>
 	<view class="tools">
 		<u-subsection :list="list" :current="current" @change="sectionChange"></u-subsection>
 		<view v-show="current == 0">
 			<u-cell-group>
 				<u-cell-item @click="changeType" title="选择计算方式" :value="typeMap[type]"></u-cell-item>
 				<u-cell-item title="商业贷款金额(万元)" :arrow="false">
 					<u-input v-model="amount" type="number" input-align="right" placeholder="请输入商业贷款金额" />
 				</u-cell-item>
 				<u-cell-item @click="showPeriod = true" title="贷款期限" :value="periodMap[period]"></u-cell-item>
 				<u-cell-item @click="showRate = true" title="商业贷款年利率" :value="(rate * 100).toFixed(3) + '%'">
 				</u-cell-item>
 			</u-cell-group>
 		</view>
 		<view v-show="current == 1"> 
 			<u-cell-group>
 				<u-cell-item @click="changeType" title="选择计算方式" :value="typeMap[type]"></u-cell-item>
 				<u-cell-item title="公积金贷款金额(万元)" :arrow="false">
 					<u-input v-model="gjjAmount" type="number" input-align="right" placeholder="请输入公积金贷款金额" />
 				</u-cell-item>
 				<u-cell-item @click="showPeriod = true" title="贷款期限" :value="periodMap[period]"></u-cell-item>
 				<u-cell-item @click="showGjjRate = true" title="公积金贷款年利率" :value="(gjjRate * 100).toFixed(3) + '%'">
 				</u-cell-item>
 			</u-cell-group>
 		</view>
 		<view v-show="current == 2">
 			<u-cell-group>
 				<u-cell-item @click="changeType" title="选择计算方式" :value="typeMap[type]"></u-cell-item>
 				<u-cell-item @click="showPeriod = true" title="贷款期限" :value="periodMap[period]"></u-cell-item>
 				<u-cell-item title="商业贷款金额(万元)" :arrow="false">
 					<u-input v-model="amount" type="number" input-align="right" placeholder="请输入商业贷款金额" />
 				</u-cell-item>
 				<u-cell-item @click="showRate = true" title="商业贷款年利率" :value="(rate * 100).toFixed(3) + '%'">
 				</u-cell-item>
 				<u-cell-item title="公积金贷款金额(万元)" :arrow="false">
 					<u-input v-model="gjjAmount" type="number" input-align="right" placeholder="请输入公积金贷款金额" />
 				</u-cell-item>
 				<u-cell-item @click="showGjjRate = true" title="公积金贷款年利率" :value="(gjjRate * 100).toFixed(3) + '%'">
 				</u-cell-item>
 			</u-cell-group>
 		</view>
 		<button class="calc" @tap="calc()">开始计算</button>
 		<view class="reslut">
 			<view class="tabs">
 				<view class="tab" @tap="changeResultType(0)" :class="{active: type == '0'}">等额本息</view>
 				<view class="tab" @tap="changeResultType(1)" :class="{active: type == '1'}">等额本金</view>
 			</view>
 			<view class="content">
 				<view class="top">
 					<view class="title">每月月供参考(元)</view>
 					<view class="month">{{reslut.monthAmount}}</view>
 				</view>
 				<view class="bottom">
 					<view class="col">
 						<view class="title">还款总额(万元)</view>
 						<view class="total">{{reslut.totalReturnAmount}}</view>
 					</view>
 					<view class="col">
 						<view class="title">贷款总额(万元)</view>
 						<view class="total">{{reslut.totalAmount}}</view>
 					</view>
 					<view class="col">
 						<view class="title">支付利息(万元)</view>
 						<view class="total">{{reslut.rateAmount}}</view>
 					</view>
 				</view>
 				<view class="btns">
 					<button class="btn" @tap="reset">重新计算</button>
 					<button class="btn" @tap="resultDetail">还款数据明细</button>
 				</view>
 				<view class="tips">
 					<text v-show="type == '0'" class="title">等额本息：每月还款额固定，其中本金部分逐月递增、利息部分逐月递减</text>
 					<text v-show="type == '1'" class="title">等额本金：每月还款额递减，其中本金部分固定、利息部分逐月递减</text>
 				</view>
 			</view>
 		</view>
 		<u-select v-model="showType" :list="typeList" @confirm="typeConfirm"></u-select>
 		<u-select v-model="showPeriod" :list="periodList" @confirm="periodConfirm"></u-select>
 		<u-select v-model="showRate" :list="rateList" @confirm="rateConfirm"></u-select>
 		<u-select v-model="showGjjRate" :list="gjjRateList" @confirm="gjjRateConfirm"></u-select>
 		<u-select v-model="showResultList" :list="listAmount"></u-select>
 		<u-modal v-model="showCustomeRate" @confirm="customeConfirm">
 			<view class="slot-content">
 				<view style="padding: 0 30upx;">
 					<u-input v-model="customeRate" type="number" input-align="center" placeholder="请输入贷款利率(%)"></u-input>
 				</view>
 			</view>
 		</u-modal>
 		<u-toast ref="uToast" />
 	</view>
 </template>
 
 <script>
 	var app = getApp();
 	export default {
 		data() {
 			return {
 				colors: '',
 				list: [{
 						name: '商业贷款'
 					},
 					{
 						name: '公积金贷款'
 					},
 					{
 						name: '组合贷款'
 					}
 				],
 				current: 0,
 				showType: false,
 				typeList: [{
 						value: '0',
 						label: '等额本息'
 					},
 					{
 						value: '1',
 						label: '等额本金'
 					}
 				],
 				typeMap: {
 					"0": "等额本息",
 					"1": "等额本金"
 				},
 				showCustomeRate: false,
 				showPeriod: false,
 				periodMap: {},
 				periodList: [],
 				showRate: false,
 				rateList: [
 					{
 						value: '0.033',
 						label: '基准利率(3.3%)'
 					},
 					{
 						value: '0',
 						label: '自定义'
 					}
 				],
 				showGjjRate: false,
 				gjjRateList: [{
 						value: '0.0275',
 						label: '公积金(2.75%)'
 					},
 					{
 						value: '0',
 						label: '自定义'
 					}
 				],
 				type: "0",
 				amount: undefined,
 				gjjAmount: undefined,
 				period: 20,
 				rate: "0.0330",
 				gjjRate: "0.0275",
 				customeRate: undefined,
 				customeType: undefined,
 				showResultList: false,
 				reslut: {
 					monthAmount: 0,
 					totalAmount: 0,
 					totalReturnAmount: 0,
 					rateAmount: 0,
 				},
 				groupResult: {},
 				listAmount: [],
 				resultType: 0
 			};
 		},
 		components: {},
 		props: {},
 
 		/**
 		 * 生命周期函数--监听页面加载
 		 */
 		onLoad: function(options) {
 
 			let periodList = [];
 			let periodMap = {};
 			for (var i = 1; i <= 30; i++) {
 				let label = i + '年' + ' (' + i * 12 + '期)';
 				periodList.push({
 					value: i,
 					label: label
 				});
 				periodMap[i] = label;
 			}
 			let rateMap = {};
 			for (var i = 0; i < this.rateList.length; i++) {
 				let item = this.rateList[i];
 				rateMap[item.value] = item.label;
 			}
 			this.colors= app.globalData.newColor;
 			this.periodList= periodList;
 			this.periodMap= periodMap;
 			this.rateMap= rateMap;
 			
 
 		},
 		methods: {
 			changeResultType(type){
 				this.type=type;
 				this.reslut=== 0 ? this.groupResult["bx"] : this.groupResult["bj"];
 				
 			},
 			resultDetail(){
 				if(this.type == 0){
 					this.$refs.uToast.show({
 						title: '等额本息还款固定',
 						type: 'warning'
 					})
 					return;
 				}
 				this.showResultList=true;
 				
 			},
 			calc(){
 				if(this.current == 1){
 					if(this.gjjAmount){
 						this.calcSimple();
 					}else{
 						this.$refs.uToast.show({
 							title: '请输入贷款金额',
 							type: 'warning'
 						})
 					}
 				}else if(this.current == 2){
 					if(this.amount && this.gjjAmount){
 						this.calcGroup();
 					}else{
 						this.$refs.uToast.show({
 							title: '请输入商贷和公积金贷款金额',
 							type: 'warning'
 						})
 					}
 					
 				}else{
 					if(this.amount){
 						this.calcSimple();
 					}else{
 						this.$refs.uToast.show({
 							title: '请输入贷款金额',
 							type: 'warning'
 						})
 					}
 				}
 				
 			},
 			calcSimple() {
 				//商业贷款、公积金贷款
 				let lilv = this.current == 0 ? this.rate : this.gjjRate; //得到利率
 				//贷款总额
 				let daikuan_total = this.current == 0 ? this.amount * 10000 : this.gjjAmount * 10000;
 				//还款周期
 				let month = this.period * 12;
 				let groupResult = {};
 				let listAmount = [];
 				//1.本金还款
 				if(true){
 					//月还款
 					let totalReturnAmount = 0;
 					let firstAmount = 0;
 					for (let j = 0; j < month; j++) {
 						//调用函数计算: 本金月还款额
 						let huankuan = this.getMonthMoney2(lilv, daikuan_total, month, j);
 						totalReturnAmount += huankuan;
 						huankuan = Math.round(huankuan * 100) / 100;
 						if(j == 0){
 							firstAmount = huankuan;
 						}
 						listAmount.push({"value": (j + 1) + "月", "label": '第' + (j + 1) + "月       还 " + huankuan + '元'})
 					}
 					//还款总额
 					let total = Math.round(totalReturnAmount * 100) / 100;
 					//支付利息款
 					let lx = Math.round((totalReturnAmount - daikuan_total) * 100) / 100;
 					let reslut = {
 						totalAmount: (daikuan_total / 10000).toFixed(2),
 						monthAmount: firstAmount.toFixed(2),
 						totalReturnAmount: (total / 10000).toFixed(2),
 						rateAmount: (lx / 10000).toFixed(2),
 					}
 					groupResult["bj"] = reslut;
 				} 
 				if(true){
 					//2.本息还款
 					//月均还款
 					let monthAmount = this.getMonthMoney1(lilv, daikuan_total, month); //调用函数计算
 					monthAmount = Math.round(monthAmount * 100) / 100;
 					//还款总额
 					let total = monthAmount * month ;
 					//支付利息款
 					let lx_txt = Math.round((total - daikuan_total) * 100) / 100;
 					total = Math.round(total * 100) / 100;
 					
 					let reslut = {
 						totalAmount: (daikuan_total / 10000).toFixed(2),
 						monthAmount: monthAmount.toFixed(2),
 						totalReturnAmount: (total / 10000).toFixed(2),
 						rateAmount: (lx_txt / 10000).toFixed(2),
 					}
 					groupResult["bx"] = reslut;
 				}
 				this.groupResult= groupResult;
 				this.listAmount= listAmount;
 				this.reslut= this.type == '0' ? groupResult["bx"]: groupResult["bj"];
 			},
 			calcGroup(){
 				//贷款总额
 				let total_sy = this.amount * 10000;
 				let total_gjj = this.gjjAmount * 10000;
 				let daikuan_total = total_sy + total_gjj;
 				//月还款
 				let lilv_sd = this.rate;//得到商贷利率
 				let lilv_gjj = this.gjjRate;//得到公积金利率
 				let groupResult = {};
 				//1.本金还款
 				  //月还款
 				  let all_total2 = 0;
 				  let month_money2 = "";
 				  let month = this.period * 12;
 				  let firstAmount = 0;
 				  let listAmount = [];
 				  for(let j = 0; j < month; j++){
 					//调用函数计算: 本金月还款额
 					let huankuan = this.getMonthMoney2(lilv_sd, total_sy, month, j) + this.getMonthMoney2(lilv_gjj, total_gjj, month, j);
 					all_total2 += huankuan;
 					huankuan = Math.round(huankuan * 100) / 100;
 					//month_money2 += (j + 1) + "月," + huankuan + "(元)\n";
 					if(j == 0){
 						firstAmount = huankuan;
 					}
 					listAmount.push({"value": (j + 1) + "月", "label": '第' + (j + 1) + "月       还 " + huankuan + '元'})
 				  }
 				  //还款总额
 				  var all_total2_txt = Math.round(all_total2 * 100) / 100;
 				  //支付利息款
 				  var accrual2 = Math.round((all_total2 - daikuan_total) * 100) / 100;
 				
 				let reslut = {
 					totalAmount: (daikuan_total / 10000).toFixed(2),
 					monthAmount: firstAmount.toFixed(2),
 					totalReturnAmount: (all_total2_txt / 10000).toFixed(2),
 					rateAmount: (accrual2 / 10000).toFixed(2),
 				}
 				groupResult["bj"] = reslut;
 				//2.本息还款
 				  //月均还款
 				  var month_money1 = this.getMonthMoney1(lilv_sd, total_sy, month) + this.getMonthMoney1(lilv_gjj, total_gjj, month);//调用函数计算
 				  var month_money1_txt = Math.round(month_money1 * 100) / 100;
 				  //还款总额
 				  var all_total1 = month_money1 * month;
 				  var all_total1_txt = Math.round(all_total1 * 100) / 100;
 				  //支付利息款
 				  var accrual1_txt = Math.round((all_total1 - daikuan_total) * 100) / 100;
 				  
 				  let reslut1 = {
 				  	totalAmount: (daikuan_total / 10000).toFixed(2),
 				  	monthAmount: month_money1_txt.toFixed(2),
 				  	totalReturnAmount: (all_total1_txt / 10000).toFixed(2),
 				  	rateAmount: (accrual1_txt / 10000).toFixed(2),
 				  }
 				  groupResult["bx"] = reslut1;
 				  
 				  this.groupResult=groupResult;
 				  this.listAmount=listAmount;
 				  this.reslut=this.type == '0' ? groupResult["bx"]: groupResult["bj"];
 				
 			},
 			//本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
 			getMonthMoney1(lilv, total, month){
 			  var lilv_month = lilv / 12;//月利率
 			  return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
 			},
 			//本金还款的月还款额(参数: 年利率 / 贷款总额 / 贷款总月份 / 贷款当前月0～length-1)
 			getMonthMoney2(lilv, total, month, cur_month){
 			  var lilv_month = lilv / 12; //月利率
 			  var benjin_money = total / month;
 			  // 更精确的计算方式，先计算剩余本金利息，再加上固定本金
 			  var remaining_principal = total - benjin_money * cur_month;
 			  var interest = remaining_principal * lilv_month;
 			  return interest + benjin_money;
 			},
 			sectionChange(index) {
 				this.current = index;
 				this.reset();
 			},
 			reset(){
 				this.type="0";
 				this.amount= undefined;
 				this.gjjAmount= undefined;
 				this.period= 20;
 				this.rate= "0.033";
 				this.gjjRate="0.0275";
 				this.customeRate= undefined;
 				this.customeType= undefined;
 				this.reslut= {
 					monthAmount: 0,
 					totalAmount: 0,
 					totalReturnAmount: 0,
 					rateAmount: 0,
 				};
 				this.groupResult={};
 				
 			},
 			changeType() {
 				this.showType=true;
 				
 			},
 			typeConfirm(e) {
 				this.type= e[0].value;
 				
 			},
 			periodConfirm(e) {
 				this.period=e[0].value;
 				
 			},
 			rateConfirm(e) {
 				if (e[0].value == "0") {
 					this.showCustomeRate=true;
 					this.customeType= 0;
 					return
 				}
 				this.rate= e[0].value;
 				
 			},
 			gjjRateConfirm(e) {
 				if (e[0].value == "0") {
 					this.showCustomeRate= true;
 					this.customeType= 1;
 					return
 				}
 				this.gjjRate= e[0].value;
 			},
 			customeConfirm() {
 				if (this.customeType == 0) {
 					this.rate=Number(this.customeRate) / 100;
 				} else {
 					this.gjjRate= Number(this.customeRate) / 100;
 				}
 
 			},
 		}
 	};
 </script>
 <style lang="scss" scoped>
 	page {
 		background-color: #F5F5FA;
 	}
 
 	.reslut {
 		margin: 20upx 20upx;
 		box-shadow: 0 0.07rem 0.25rem #eff0f3;
 		-webkit-box-shadow: 0 0.07rem 0.25rem #eff0f3;
 		-moz-box-shadow: 0 .07rem .25rem #EFF0F3;
 		-o-box-shodow: 0 .07rem .25rem #EFF0F3;
 		margin-bottom: .6rem;
 		border-radius: .04rem;
 		border: 1px solid #E6E9F0;
 	}
 	.reslut .tabs {
 		height: 80upx;
 		line-height: 80upx;
 		width: 100%;
 		display: flex;
 	}
 	.reslut .tabs .tab{
 		width: 50%;
 		text-align: center;
 		background-color: #F7F8FA;
 	}
 	.reslut .tabs .active{
 		background-color: #ffffff;
 	}
 	.reslut .content{
 		padding: 30upx 30upx;
 		background-color: #ffffff;
 	}
 	.reslut .content .title{
 		color: #868E9E;
 		font-size: 26upx;
 		padding-bottom: 10upx;
 	}
 	.reslut .content .month{
 		font-size: 40upx;
 		font-weight: bold;
 	}
 	.reslut .content .bottom{
 		padding: 20upx 0;
 		display: flex;
 		justify-content: space-between;
 	}
 	.reslut .content .bottom .total{
 		font-size: 30upx;
 	}
 	.reslut .content .btns{
 		padding: 20upx 0;
 		display: flex;
 		justify-content: space-between;
 		background-color: #ffffff;
 	}
 	.reslut .content .btns .btn{
 		width: 300upx;
 		border-radius: 100upx;
 		color: #394259;
 		border: 1upx solid #D1D1D1;
 		background-color: #fff;
 		font-size: 28upx;
 	}
 	.reslut .content .tips{
 		padding: 20upx 0;
 	}
 	.calc{
 		background-color: #0076FF;
 		color: #ffffff;
 		font-size: 30upx;
 		padding: 6upx 0;
 	}
 	.t_input {
 		padding: 20upx 4%;
 		background-color: #fff;
 		display: flex;
 		align-items: center;
 		justify-content: space-between;
 	}
 
 	.t_input .title {
 		height: 80upx;
 		line-height: 80upx;
 		color: #333;
 		font-weight: bold;
 		width: 120upx;
 	}
 
 	.t_input .inputs {
 		color: #333;
 		font-size: 32upx;
 	}
 
 	.inputs input {
 		height: 80upx;
 		line-height: 80upx;
 		width: 100%;
 		display: block;
 	}
 
 	.all_btn {
 		font-size: 24upx;
 		font-family: Source Han Sans CN;
 		font-weight: 400;
 		width: 150upx;
 	}
 
 	.jilu {
 		height: 60upx;
 		line-height: 60upx;
 		padding: 0 4%;
 		font-size: 28upx;
 		color: #999;
 		font-family: Source Han Sans CN;
 		font-weight: 400;
 		margin-top: 10upx;
 	}
 
 	.addclerk {
 		width: 80%;
 		height: 82upx;
 		line-height: 82upx;
 		border-radius: 15upx;
 		font-size: 32upx;
 		font-family: Source Han Sans CN;
 		font-weight: 500;
 		color: rgba(255, 255, 255, 1);
 		text-align: center;
 		position: fixed;
 		bottom: 30upx;
 		left: 50%;
 		transform: translateX(-50%);
 		background-color: pink;
 	}
 
 	.addclerk:active {
 		opacity: 0.8;
 	}
 </style>
 <style>
 	page {
 		background-color: #F5F5FA;
 	}
 </style>
 