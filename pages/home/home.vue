<template>
	<view>
		<scroll-view scroll-y class="page">
			<view class="cu-card case" >
				<view class=" shadow">
					<view class="image">
						<image src="../../static/me/day.jpg" mode="widthFix">
						</image>
						<view class="cu-tag shuli" style="right: 24px;height: 120px;">{{getLunarDay.dateStr}}</view>
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
