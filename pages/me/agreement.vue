<template>
  <view>
   <cu-custom bgColor="bg-gradual-blue" :isBack="true">
   	<block slot="backText">返回</block>
   	<block slot="content">用户协议</block>
   </cu-custom>
    <view class="content">
      <text>这里是用户协议的具体内容...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.agreement-container {
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  padding: 10px;
  font-size: 16px;
  line-height: 1.5;
}
</style>