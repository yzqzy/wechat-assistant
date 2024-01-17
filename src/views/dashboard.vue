<template>
  <div class="wrapper">
    <el-row>
      <div class="welcome"> Hello {{ userInfo?.name || userInfo?.account }} 👋🏼，欢迎使用微信助手！</div>.
    </el-row>
    <el-row>
      <el-col :span="4" class="mgb20">
        <el-avatar :size="120" :src="userInfo?.headImage" />
      </el-col>
      <el-col>
        <div class="user-info-list">
          微信ID：
          <span>{{ userInfo?.wxid }}</span>
        </div>
        <div class="user-info-list">
          微信号：
          <span>{{ userInfo?.account }}</span>
        </div>
        <div class="user-info-list">
          手机号：
          <span>{{ userInfo?.mobile }}</span>
        </div>
        <div class="user-info-list">
          地区：
          <span>{{ userInfo?.country }}-{{ userInfo?.province }}-{{ userInfo?.city }}</span>
        </div>
        <div class="user-info-list">
          个性签名：
          <span>{{ userInfo?.signature }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import { onMounted, ref } from 'vue'
import { getUserInfo, UserInfo } from '../api/index'

const userInfo = ref<UserInfo>()

onMounted(() => {
  getUserInfo().then(res => {
    if (res.code == 1) {
      userInfo.value = res.data
    } else {
      console.log('获取用户信息失败')
    }
  })
})
</script>

<style lang="scss" scoped>
.wrapper {
  padding-top: 61px;
  padding-left: 81px;
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
  margin-left: 70px;
}
</style>