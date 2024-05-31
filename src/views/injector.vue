<template>
  <div class="injector-page">
    <div class="injector-tip">请参照说明文档，对微信进程进行注入。</div>
    <div class="injector-desc">
      <p>1. 从 WeChatAssets 中下载相关资源。</p>
      <p>2. 打开 API_Launcher_xxxxxx.exe, 填写端口 "19088", 并启动微信。</p>
      <p>3. 打开微信后，点击返回首页即可正常使用。</p>
    </div>
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

  .injector-tip {
    font-size: 24px;
    color: #777;
  }

  .injector-desc {
    margin-top: 40px;
    margin-bottom: 60px;
    color: #333;

    p {
      font-size: 16px;
      line-height: 40px;
    }
  }

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
