<template>
  <div class="wrapper">
    <el-row>
      <div class="welcome"> Hello {{ userInfo?.name || userInfo?.account }} 👋🏼，欢迎使用微信助手！</div>.
    </el-row>
    <el-row class="mgb20">
      <el-avatar :size="120" :src="userInfo?.headImage" />
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="user-info-list">
          <span>微信ID：</span>
          {{ userInfo?.wxid }}
        </div>
        <div class="user-info-list">
          <span>微信号：</span>
          {{ userInfo?.account }}
        </div>
        <div class="user-info-list">
          <span>手机号：</span>
          {{ userInfo?.mobile }}
        </div>
        <div class="user-info-list">
          <span>地区：</span>
          {{ userInfo?.country }}-{{ userInfo?.province }}-{{ userInfo?.city }}
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
import { ref } from 'vue'
import { getUserInfo, UserInfo } from '../api/index'

const userInfo = ref<UserInfo>()

getUserInfo()
  .then(res => {
    if (res.code == 1) {
      userInfo.value = res.data
    } else {
      console.log('获取用户信息失败')
    }
  })
</script>

<style scoped>
.wrapper {
  padding-top: 31px;
  padding-left: 51px;
  box-sizing: border-box;
}

.el-row {
  margin-bottom: 20px;
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