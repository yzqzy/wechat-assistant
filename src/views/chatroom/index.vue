<template>
  <div>
    <div class="title">
      <h2>群聊列表</h2>
    </div>
    <div class="container">
      <div class="search-box">
        <el-input v-model="query.name" placeholder="请输入群聊名称" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" height="740px" class="table" header-cell-class-name="table-header">
        <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
        <el-table-column prop="nickname" label="群聊名称" align="center"></el-table-column>
        <el-table-column prop="pinyin" label="拼音缩写" align="center"></el-table-column>
        <el-table-column prop="pinyinAll" label="拼音" align="center"></el-table-column>
        <el-table-column label="操作" width="340" align="center">
          <template #default="scope">
            <div>
              <el-button type="success" class="btn" plain @click="handleShowDialog(scope, 'view')">
                查看群成员
              </el-button>
              <el-button type="info" class="btn" plain>
                添加成员
              </el-button>
            </div>
            <div>
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'image')">
                发图片
              </el-button>
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'file')">
                发文件
              </el-button>
              <el-button type="danger" class="btn" plain @click="handleQuitChatRoom(scope.$index)">
                退出群聊
              </el-button>
            </div>
            <div>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index, 'text')">
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
          :page-size="query.pageSize" :total="pageTotal" @size-change="handlePageSizeChange"
          @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <el-dialog title="编辑消息" v-model="visible" width="500px" destroy-on-close :close-on-click-modal="false"
      @close="visible = false">
      <chat-room-form :mode="optMode" :data="{}" :confirm="handleConfirm"></chat-room-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import ChatRoomForm from './ChatRoomForm.vue';

import { Contact } from '../../api'
import { sendTextMsg, sendImagesMsg, sendFileMsg, forwardPublicMsg, quitChatRoom } from '../../api/index';
import { useSearchTable } from './useSearch';
import { useExport } from './useExport';

const {
  query, pageTotal, tableData, filterData,
  handleSearch, handlePageSizeChange, handlePageChange, handleRefreshData
} = useSearchTable()
const { exportXlsx } = useExport()

const loading = ref(false)

const visible = ref(false)
const optMode = ref('') //  'text' or 'image' or 'file' or 'wx_article'

const contactData = ref<Contact>()

const reset = () => {
  contactData.value = undefined;
  visible.value = false;
}

const handleExportXlsx = () => exportXlsx(filterData.value)

const handleShowDialog = (index: number, mode: string) => {
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

const handleQuitChatRoom = (index: number) => {
  const { wxid } = tableData.value[index]

  ElMessageBox.confirm('确定要退出该群聊吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      loading.value = true;

      const res = await quitChatRoom(wxid);

      if (res.code > 0) {
        handleRefreshData(() => {
          loading.value = false;
          ElMessage.success('退出成功');
        })
        return
      }

      loading.value = false;
      ElMessage.error('退出失败');
    })
    .catch(() => { });
}
</script>

<style scoped>
.title {
  margin-bottom: 20px;
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
