<template>
  <div>
    <div class="title">
      <h2>任务列表</h2>
    </div>
    <div class="container">
      <!-- 功能操作区域 -->
      <div class="operation mb20">
        <el-button type="primary" plain @click="handleShowAddTask">新增任务</el-button>
      </div>

      <!-- 任务列表 -->
      <el-table class="table" height="70vh" :data="taskData">
        <el-table-column prop="name" label="任务名称" width="160" align="center" />
        <el-table-column prop="type" label="任务类型" width="120" align="center" />
        <el-table-column prop="receiver_ids" label="接收者" width="200" align="center" />
        <el-table-column prop="cron" label="运行规则" align="center" />
        <el-table-column prop="params" label="任务参数" />
        <el-table-column label="操作" width="340" align="center">
          <template #default="scope">
            <el-button type="primary" plain class="btn" @click="handleShowEditTask(scope.$index)">编辑</el-button>
            <el-button :type="scope.row.enable ? 'danger' : 'primary'" plain class="btn"
              @click="handleEnableTask(scope.$index)">{{ scope.row.enable ? '禁用' :
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

<script setup lang="ts" name="cron">
import { ref } from 'vue';
import _ from 'lodash'

import TaskForm from './TaskForm.vue';

import type { Task } from '../../store/task'
import { useTask } from './useTask'
import { ElMessage, ElMessageBox } from 'element-plus';

const { taskData, addTask, contactData, editTask, removeTask } = useTask()

const visible = ref(false)
const task = ref<Task>()

const reset = () => {
  task.value = undefined
  visible.value = false

  console.log('reset', task.value)
}

const handleClose = reset

const handleShowAddTask = () => {
  visible.value = true
}
const handleShowEditTask = (index: number) => {
  task.value = _.cloneDeep(taskData.value[index].__origin__)
  visible.value = true
}

const handleConfirm = (data: Task) => {
  if (task.value) {
    const index = taskData.value.findIndex(item => item.uid === data.uid)
    editTask(index, data)
    ElMessage.success('编辑成功')
  } else {
    addTask(data)
    ElMessage.success('新增成功')
  }
  reset()
}

const handleEnableTask = (index: number) => {
  const data = _.cloneDeep(taskData.value[index].__origin__)
  const operation = data.enable ? '禁用' : '启用'

  ElMessageBox.confirm(`确定要${operation}该任务吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    editTask(index, {
      ...data,
      enable: !data.enable
    })
    ElMessage.success('操作成功')
  })
}

const handleDeleteTask = (index: number) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    type: 'warning'
  }).then(() => {
    removeTask(index)
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
