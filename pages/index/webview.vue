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