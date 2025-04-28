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
