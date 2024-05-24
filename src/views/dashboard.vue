<template>
  <div class="container">
    <el-row>
      <div class="welcome"> Hello {{ userInfo?.alias || userInfo?.nickName }} 👋🏼，欢迎使用微信助手！</div>.
    </el-row>
    <el-row class="mb20">
      <el-avatar :size="120" :src="userInfo?.smallHeadImgUrl" />
    </el-row>
    <el-row>
      <el-col>
        <div class="user-info-list">
          <span>微信ID：</span>
          {{ userInfo?.userName }}
        </div>
        <div class="user-info-list">
          <span>微信号：</span>
          {{ userInfo?.nickName }}
        </div>
        <div class="user-info-list">
          <span>手机号：</span>
          {{ userInfo?.phone }}
        </div>
        <div class="user-info-list">
          <span>地区：</span>
          {{ userInfo?.nation }}-{{ userInfo?.province }}
        </div>
        <div class="user-info-list">
          <span>个性签名：</span>
          {{ userInfo?.signature }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import { useUserStore } from '@/store/user'

const { userInfo } = useUserStore()
</script>

<style scoped>
.container {
  margin-top: 20px;
  padding: 20px;
}

.welcome {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  display: inline-block;
  width: 120px;
}
</style>