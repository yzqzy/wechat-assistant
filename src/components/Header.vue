<template>
  <div class="header">
    <div class="logo">
      <el-avatar class="user-avator" :size="32" :src="logo" />
      <span class="title">微信助手</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from '@/assets/img/logo.png';

</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 306px;
  height: 80px;
  padding-top: 10px;
  box-sizing: border-box;
}

.header .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .user-avator {
    margin-right: 18px;
  }

  .title {
    font-size: 26px;
    color: #000;
    font-weight: bold;
  }
}
</style>