<template>
  <div>
    <div class="title">
      <h2>任务列表（触发任务）</h2>
    </div>
    <div class="container">
      <!-- 功能操作区域 -->
      <div class="operation mb20">
        <el-button type="primary" plain @click="handleShowAddTask">新增任务</el-button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts" name="cron">
import { ref } from 'vue';
import _ from 'lodash'

const visible = ref(false)

const handleShowAddTask = () => {
  visible.value = true
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
