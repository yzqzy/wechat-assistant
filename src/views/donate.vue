<template>
  <div class="container">
    <div class="plugins-tips">
      如果该项目对你有帮助，那就请作者喝杯咖啡吧！<el-icon>
        <CoffeeCup />
      </el-icon> 加微信号 _heora 探讨问题。
    </div>
    <div class="donate-img">
      <img alt="donate" src="https://img.yueluo.club/icons/donate.png" />
    </div>
  </div>
</template>

<script setup lang="ts" name="donate"></script>

<style scoped>
.container {
  padding: 20px;
}

.plugins-tips {
  padding: 20px 0;
}

.donate-img {
  width: 240px;
  height: 240px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
