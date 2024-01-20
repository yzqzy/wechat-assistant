<template>
  <div>
    <div class="title">
      <h2>联系人列表</h2>
    </div>
    <div class="container">
      <div class="search-box">
        <el-input v-model="query.keyword" placeholder="请输入昵称或微信号" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
      </div>
      <el-table :data="tableData" height="740px" class="table" header-cell-class-name="table-header">
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
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'image')">
                发图片
              </el-button>
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'file')">
                发文件
              </el-button>
            </div>
            <div>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index)">
                发消息
              </el-button>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index, 'wx_article')">
                发公众号消息
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

    <el-dialog title="编辑消息" v-model="visible" width="500px" destroy-on-close :close-on-click-modal="false"
      @close="visible = false">
      <contact-form :mode="optMode" :confirm="handleConfirm"></contact-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import ContactForm from './ContactForm.vue';

import type { Contact } from '../../api'
import { sendPatMsg, sendTextMsg, sendImagesMsg, sendFileMsg, forwardPublicMsg } from '../../api';
import { useSearchTable } from './useSearch';
import { useExport } from './useExport';

const {
  query, pageTotal, tableData, filterData,
  handleSearch, handlePageSizeChange, handlePageChange
} = useSearchTable()
const { exportXlsx } = useExport()

const visible = ref(false)
const optMode = ref('text') // 'text' or 'image' or 'file' or 'wx_article'
const contactData = ref<Contact>()

const reset = () => {
  contactData.value = undefined;
  visible.value = false;
}

const handleExportXlsx = () => exportXlsx(filterData.value)

const handleShowDialog = (index: number, mode = 'text') => {
  optMode.value = mode;
  contactData.value = tableData.value[index];
  visible.value = true;
}

const handleConfirm = async (data: any) => {
  if (!contactData.value) return

  let res: any;

  if (data.mode === 'text') {
    res = await sendTextMsg(contactData.value.wxid, data.message)
  } else if (data.mode === 'image') {
    res = await sendImagesMsg(contactData.value.wxid, data.image_url)
  } else if (data.mode === 'file') {
    res = await sendFileMsg(contactData.value.wxid, data.file_url)
  } else if (data.mode === 'wx_article') {
    res = await forwardPublicMsg({
      wxid: contactData.value.wxid,
      title: data.title,
      url: data.url,
      thumbUrl: data.thumb_url,
      digest: data.digest
    })
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
</script>

<style scoped>
.title {
  padding-left: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 200px;
}

.mr10 {
  margin-right: 10px;
}

.btn {
  margin: 5px;
}
</style>
