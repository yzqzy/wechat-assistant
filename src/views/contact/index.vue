<template>
  <div>
    <div class="title">
      <h2>联系人列表</h2>
    </div>
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input v-model="query.keyword" placeholder="请输入ID/昵称/微信号" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
      </div>

      <!-- 选择区域 -->
      <contact-section :data="tableData" :multiple-selection="multipleSelection" :handle-show-dialog="handleShowDialog"
        :handle-clear-selection="handleClearSelection"
        :handle-remover-seclection="handleRemoverSeclection"></contact-section>

      <!-- 表格区域 -->
      <el-table v-loading="loading" ref="multipleTableRef" :data="tableData" height="70vh" class="table"
        header-cell-class-name="table-header" @selection-change="handleSelectionChange"
        @select="handleSelectionRowChange" @select-all="handleSelectionAllChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
        <el-table-column prop="customAccount" label="微信号" align="center">
          <template #default="scope">
            <div>{{ scope.row.customAccount || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pinyin" label="拼音缩写" align="center"></el-table-column>
        <el-table-column prop="pinyinAll" label="拼音" align="center"></el-table-column>
        <el-table-column label="操作" width="320" align="center">
          <template #default="scope">
            <div>
              <el-button v-if="!(scope.row.wxid.includes('chatroom') || /^gh_/.test(scope.row.wxid))" class="btn"
                type="info" plain @click="handlePat(scope.$index)">
                拍一拍
              </el-button>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index)">
                发消息
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="handlePageSizeChange" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 弹窗区域 -->
    <el-dialog title="编辑消息" v-model="visible" width="500px" destroy-on-close :close-on-click-modal="false"
      @close="visible = false">
      <message-form multi @confirm="handleConfirm"></message-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="contact">
import { ref } from 'vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import ContactSection from '@/components/MultipleSection/Section.vue';
import MessageForm from '@/components/MessageForm.vue';

import type { Contact } from '@/api'
import { sendPatMsg } from '@/api';

import { useSection } from '@/components/MultipleSection/useSection'
import { useMessage } from '@/composables/useMessage'
import { useExport } from '@/composables/useExport';
import { useSearchTable } from './useSearch';

const {
  query, pageTotal, tableData, filterData,
  handleSearch, handlePageSizeChange, handlePageChange
} = useSearchTable()
const {
  multipleTableRef, multipleSelection,
  handleSelectionChange, handleSelectionRowChange, handleSelectionAllChange,
  handleRemoverSeclection, handleClearSelection
} = useSection({ tableData })

const { sendMsgBatch } = useMessage()
const { exportXlsx } = useExport()

const handleExportXlsx = () => exportXlsx({
  title: '联系人列表',
  columns: {
    wxid: 'ID',
    nickname: '昵称',
    customAccount: '微信号',
    pinyin: '拼音缩写',
    pinyinAll: '拼音'
  },
  data: filterData.value
})

const loading = ref(false)

const visible = ref(false)
const isMultiple = ref(false)
const contactData = ref<Contact>()

const reset = () => {
  handleClearSelection()
  contactData.value = undefined;
  isMultiple.value = false;
  visible.value = false;
  loading.value = false;
}

const handleShowDialog = (action: number | string) => {
  if (typeof action === 'number') {
    contactData.value = tableData.value[action];
  } else {
    isMultiple.value = true;
  }
  visible.value = true;
}

const handleConfirm = async (data: any) => {
  if (!contactData.value && (isMultiple.value && multipleSelection.value.length === 0)) return

  const wx_ids = isMultiple.value
    ? multipleSelection.value.map(item => item.wxid)
    : contactData.value && [contactData.value.wxid] || []

  if (wx_ids.length > 2)
    loading.value = true

  await sendMsgBatch(wx_ids, data)

  reset()
}

const handlePat = (index: number) => {
  const item = tableData.value[index];

  ElMessageBox.confirm('确定要拍一拍吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      const res = await sendPatMsg(item.wxid, item.wxid);

      if (res.code === 1) {
        ElMessage.success('拍一拍成功');
        return
      }

      ElMessage.error('拍一拍失败');
    })
    .catch(() => { });
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
