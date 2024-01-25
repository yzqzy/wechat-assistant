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
      <div class="selection-box">
        <div>
          已选择：<span class="selected-count">{{ multipleSelection.length }}</span>
          <template v-if="multipleSelection.length">
            <el-button type="primary" size="small" class="btn" plain @click="handleShowDialog('multiple')">
              发消息
            </el-button>
            <el-button type="danger" size="small" class="btn" plain @click="handleClearSelection">
              清空
            </el-button>
          </template>
        </div>
        <div class="selected-content">
          <div class="selected-item" v-for="(item, index) in multipleSelection" :key="index"
            @click="handleRemoverSeclection(index)">
            <div class="info">
              <span>{{ item.nickname }}</span>
              <el-icon :size="18" class="icon">
                <CircleClose />
              </el-icon>
              <span v-if="index !== multipleSelection.length - 1">、</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table v-loading="loading" ref="multipleTableRef" :data="tableData" height="70vh" class="table"
        header-cell-class-name="table-header" @selection-change="handleSelectionChange" @select="handleSelectionRowChange"
        @select-all="handleSelectionAllChange">
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
      <message-form :confirm="handleConfirm"></message-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="contact">
import { ref } from 'vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import MessageForm from '../../components/service/MessageForm.vue';

import type { Contact } from '../../api'
import { sendPatMsg, sendTextMsg, sendImagesMsg, sendFileMsg, forwardPublicMsg } from '../../api';
import { useSearchTable } from './useSearch';
import { useExport } from './useExport';
import { delaySync, getRandomInt } from '../../utils/tools';

const {
  query, pageTotal, tableData, filterData,
  handleSearch, handlePageSizeChange, handlePageChange
} = useSearchTable()
const { exportXlsx } = useExport()

const handleExportXlsx = () => exportXlsx(filterData.value)

const loading = ref(false)

const visible = ref(false)
const isMultiple = ref(false)
const contactData = ref<Contact>()

const multipleSelection = ref<Contact[]>([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const reset = () => {
  handleClearSelection()
  contactData.value = undefined;
  isMultiple.value = false;
  visible.value = false;
  loading.value = false;
}

const handleShowDialog = (index: number | string) => {
  if (typeof index === 'number') {
    contactData.value = tableData.value[index];
  } else {
    isMultiple.value = true;
  }
  visible.value = true;
}

const handleConfirm = async (data: any) => {
  if (!contactData.value && (isMultiple.value && multipleSelection.value.length === 0)) return

  const wx_ids = isMultiple.value ? multipleSelection.value.map(item => item.wxid) : [contactData.value && contactData.value.wxid]

  let res: any;

  const send = async (wxid: string) => {
    if (data.mode === 'text') {
      res = await sendTextMsg(wxid, data.message)
    } else if (data.mode === 'image') {
      res = await sendImagesMsg(wxid, data.image_url)
    } else if (data.mode === 'file') {
      res = await sendFileMsg(wxid, data.file_url)
    } else if (data.mode === 'wx_article') {
      res = await forwardPublicMsg({
        wxid,
        title: data.title,
        url: data.url,
        thumbUrl: data.thumb_url,
        digest: data.digest
      })
    }
  }

  if (wx_ids.length > 2)
    loading.value = true

  while (wx_ids.length) {
    const wxid = wx_ids.shift() as string

    if (wxid)
      await send(wxid)

    await delaySync(getRandomInt(3, 15) * 10)
  }

  if (res.code === 1) {
    ElMessage.success('发送成功');
  } else {
    ElMessage.error('发送失败');
  }

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

const handleSelectionAllChange = (selection: Contact[]) => {
  if (selection.length != 0) return

  for (const item of tableData.value) {
    handleSelectionRowChange([], item)
  }
}
const handleSelectionRowChange = (contact: Contact[], row: Contact) => {
  const isDelete = contact.every(item => item.wxid !== row.wxid)
  if (!isDelete) return
  const index = multipleSelection.value.findIndex(item => item.wxid === row.wxid)
  if (index === -1) return
  handleRemoverSeclection(index)
}
const handleSelectionChange = (contact: Contact[]) => {
  if (contact.length === 0) return
  multipleSelection.value = [...new Set(contact.concat(multipleSelection.value))]
}
const handleRemoverSeclection = (index: number) => {
  const row = multipleSelection.value[index]
  multipleTableRef.value!.toggleRowSelection(row, false)
  multipleSelection.value.splice(index, 1)
}
const handleClearSelection = () => {
  multipleTableRef.value!.clearSelection()
  multipleSelection.value = []
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
