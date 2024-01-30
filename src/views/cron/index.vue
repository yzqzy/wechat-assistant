<template>
  <div>
    <div class="title">
      <h2>任务列表</h2>
    </div>
    <div class="container">
      <!-- 功能操作区域 -->
      <div class="operation mb20">
        <el-button type="primary" plain @click="handleAddTask">新增任务</el-button>
      </div>

      <!-- 任务列表 -->
      <el-table class="table" height="70vh" :data="tableData">
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="type" label="任务类型" />
        <el-table-column prop="receiver_ids" label="接收者" />
        <el-table-column prop="cron" label="定时规则" />
        <el-table-column prop="params" label="运行参数" />
        <el-table-column label="操作" width="340" align="center">
          <template #default="scope">
            <el-button type="primary" plain class="btn" @click="handleEditTask(scope.$index)">编辑</el-button>
            <el-button :type="scope.row.enable ? 'danger' : 'primary'" plain class="btn"
              @click="handleEnableTask(scope.$index)">{{ scope.row.enable ? '禁用' :
                '启用' }}</el-button>
            <el-button type="danger" plain class="btn" @click="handleDeleteTask(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增任务弹窗 -->
      <el-dialog title="新增任务" v-model="visible" width="500px" destroy-on-close :close-on-click-modal="false"
        :close="handleClose">
        TODO</el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="cron">
import { computed, ref } from 'vue';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/zh_CN';

import { MessageType, messageMapping } from '../../api'

const visible = ref(false)

const tasks = ref([
  {
    type: MessageType.TEXT,
    name: '定时任务1',
    receiver_ids: [1, 2, 3],
    cron: '0 0 * * *',
    enable: true,
    params: {
      message: '北京'
    }
  },
  {
    type: MessageType.TEXT,
    name: '定时任务1',
    receiver_ids: [1, 2, 3],
    cron: '*/5 * * * * *',
    enable: true,
    params: {
      message: '新年快乐'
    }
  },
  {
    type: MessageType.TEXT,
    name: '定时任务2',
    receiver_ids: [1, 2, 3],
    cron: '*/10 * * * * *',
    enable: false,
    params: {
      message: '新年快乐'
    }
  },
])

const tableData = computed(() => {
  return tasks.value.map(task => {
    return {
      ...task,
      type: messageMapping[task.type],
      params: JSON.stringify(task.params),
      receiver_ids: task.receiver_ids.join(','),
      cron: cronstrue.toString(task.cron, {
        use24HourTimeFormat: true,
        verbose: true,
        locale: 'zh_CN'
      }),
    }
  })
})

const handleClose = () => {
  visible.value = false
}

const handleAddTask = () => {
  console.log('handleAddTask')
  visible.value = true
}

const handleEnableTask = (index: number) => {
  console.log('handleEnableTask', index)
}

const handleEditTask = (index: number) => {
  console.log('handleEditTask', index)
  visible.value = true
}

const handleDeleteTask = (index: number) => {
  console.log('handleDeleteTask', index)
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
