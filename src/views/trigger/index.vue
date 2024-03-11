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

      <!-- 任务列表 -->
      <el-table class="table" height="70vh" :data="taskData">
        <el-table-column prop="type" label="任务类型" width="120" align="center" />
        <el-table-column prop="name" label="任务名称" align="center" />
        <el-table-column prop="observer_ids" label="观察者" align="center" />
        <el-table-column prop="receiver_ids" label="接收者" align="center" />
        <el-table-column label="操作" width="340" align="center">
          <template #default="scope">
            <el-button type="primary" plain class="btn" @click="handleShowEditTask(scope.$index)">编辑</el-button>
            <el-button :type="scope.row.enabled ? 'danger' : 'primary'" plain class="btn"
              @click="handleEnabledTask(scope.$index)">{{ scope.row.enabled ?
          '禁用' :
          '启用' }}</el-button>
            <el-button type="danger" plain class="btn" @click="handleDeleteTask(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 任务弹窗 -->
      <el-dialog :title="task && task.name ? `编辑任务：${task.name}` : '新增任务'" v-model="visible" width="600px"
        destroy-on-close :close-on-click-modal="false" @close="handleClose">
        <task-form :task="task" :data="contactData" @confirm="handleConfirm" @cancel="handleClose"></task-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="trigger">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import _ from 'lodash'

import type { TriggerTask } from '@/store/trigger-task'
import { useTask } from './useTask'

import TaskForm from './TaskForm.vue';

const { tasks, taskData, contactData, handleAddTask, handleEditTask, handleRemoveTask } = useTask()

const visible = ref(false)
const task = ref<TriggerTask>()

const reset = () => {
  task.value = undefined
  visible.value = false
}

const handleClose = reset

const handleShowAddTask = (index: number) => {
  task.value = _.cloneDeep(tasks.value[index])
  visible.value = true
}
const handleShowEditTask = (index: number) => {
  task.value = _.cloneDeep(tasks.value[index])
  visible.value = true
}

const handleConfirm = (data: TriggerTask) => {
  if (task.value) {
    const index = taskData.value.findIndex(item => item.uid === data.uid)
    handleEditTask(index, data)
    ElMessage.success('编辑成功')
  } else {
    handleAddTask(data)
    ElMessage.success('新增成功')
  }
  reset()
}

const handleEnabledTask = (index: number) => {
  const data = _.cloneDeep(tasks.value[index])
  const operation = data.enabled ? '禁用' : '启用'

  ElMessageBox.confirm(`确定要${operation}该任务吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    handleEditTask(index, {
      ...data,
      enabled: !data.enabled
    })
    ElMessage.success('操作成功')
  })
}

const handleDeleteTask = (index: number) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    type: 'warning'
  }).then(() => {
    handleRemoveTask(index)
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>