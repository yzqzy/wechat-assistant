<template>
  <div>
    <div class="title">
      <h2>标签管理</h2>
    </div>
    <div class="container">
      <div class="operation mb20">
        <el-button type="primary" plain @click="handleShowAddTag">新增标签</el-button>
      </div>

      <el-table class="table" height="70vh" :data="contactTagsData" show-overflow-tooltip :tooltip-options="{
          popperClass: 'custom-tooltip'
        }">
        <el-table-column prop="name" label="标签名称" width="200" />
        <el-table-column prop="wx_ids" label="联系人" />
        <el-table-column prop="remark" label="备注" width="240" />
        <el-table-column fixed="right" label="操作" width="340">
          <template #default="scope">
            <el-button type="primary" plain class="btn" @click="handleShowEditTag(scope.$index)">编辑</el-button>
            <el-button :type="scope.row.enabled ? 'danger' : 'primary'" plain class="btn"
              @click="handleEnabledTag(scope.$index)">{{ scope.row.enabled ?
          '禁用' :
          '启用' }}</el-button>
            <el-button type="danger" plain class="btn" @click="handleDeleteTag(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="contactTag && contactTag.name ? `编辑标签：${contactTag.name}` : '新增标签'" v-model="visible"
        width="600px" destroy-on-close :close-on-click-modal="false" @close="handleClose">
        <contact-tag-form :contactTag="contactTag" :data="contactData" @confirm="handleConfirm"
          @cancel="handleClose"></contact-tag-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ContactTag } from '@/store/contact-tag';
import ContactTagForm from './ContactTagForm.vue'

import { useContactTag } from './useContactTag'

const visible = ref(false)
const contactTag = ref<ContactTag>()

const { contactData, contactTagsData, addContactTag, editContactTag, removeContactTag } = useContactTag()

const reset = () => {
  contactTag.value = undefined
  visible.value = false
}

const handleClose = reset

const handleShowAddTag = () => {
  visible.value = true
}
const handleShowEditTag = (index: number) => {
  contactTag.value = _.cloneDeep(contactTagsData.value[index])
  visible.value = true
}

const handleConfirm = (data: ContactTag) => {
  if (contactTag.value) {
    const index = contactTagsData.value.findIndex(item => item.uid === data.uid)
    editContactTag(index, data)
    ElMessage.success('编辑成功')
  } else {
    addContactTag(data)
    ElMessage.success('新增成功')
  }
  reset()
}


const handleEnabledTag = (index: number) => {
  const data = _.cloneDeep(contactTagsData.value[index])
  const operation = data.enabled ? '禁用' : '启用'

  ElMessageBox.confirm(`确定要${operation}该标签吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    editContactTag(index, {
      ...data,
      enabled: !data.enabled
    })
    ElMessage.success('操作成功')
  })
}

const handleDeleteTag = (index: number) => {
  ElMessageBox.confirm('确定要删除该标签吗？', '提示', {
    type: 'warning'
  }).then(() => {
    removeContactTag(index)
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
