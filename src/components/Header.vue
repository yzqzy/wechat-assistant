<template>
  <div class="header">
    <div class="title-box">
      <el-avatar class="user-avator" :size="32" :src="logo" />
      <div class="title-info">
        <span class="title">微信助手</span>
        <span class="version">wxhelper-3.9.8.25-v3</span>
      </div>
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
  height: 100px;
  padding-top: 10px;
  box-sizing: border-box;
}

.header .title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .user-avator {
    margin-right: 18px;
  }

  .title-info {
    display: flex;
    flex-direction: column;

    .title {
      font-size: 26px;
      color: #000;
      font-weight: bold;
    }

    .version {
      margin-top: 5px;
      color: #666;
      font-size: 14px;
    }
  }

}
</style>