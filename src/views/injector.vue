<template>
  <div class="injector-page">
    <div class="injector-tip">请参照说明文档，对微信进程进行注入。</div>
    <div class="injector-btns">
      <router-link to="/">
        <el-button type="warning" class="injector-btn" size="large">返回首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts" name="injector">
</script>

<style lang="scss" scoped>
.injector-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;

  .injector-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .injector-btn {
      margin: 0 10px;
    }

  }
}
</style>
