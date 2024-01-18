<template>
  <div>
    <div class="title">
      <h2>联系人管理</h2>
    </div>
    <div class="container">
      <div class="search-box">
        <el-input v-model="query.name" placeholder="请输入昵称或微信号" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="exportXlsx">导出Excel</el-button>
      </div>
      <el-table :data="tableData" class="table" header-cell-class-name="table-header">
        <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
        <el-table-column prop="customAccount" label="微信号" align="center">
          <template #default="scope">
            <div>{{ scope.row.customAccount || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pinyin" label="拼音缩写" align="center"></el-table-column>
        <el-table-column prop="pinyinAll" label="拼音" align="center"></el-table-column>
        <el-table-column label="操作" width="420" align="center">
          <template #default="scope">
            <el-button type="info" plain @click="handlePat(scope.$index)">
              拍一拍
            </el-button>
            <el-button type="primary" plain @click="handleShowDialog(scope.$index)">
              发消息
            </el-button>
            <el-button type="warning" plain @click="handleShowDialog(scope.$index, 'image')">
              发图片
            </el-button>
            <el-button type="warning" plain @click="handleShowDialog(scope.$index, 'article')">
              发公众号消息
            </el-button>
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
      <contact-form :mode="editMode" :data="{}" :confirm="handleConfirm"></contact-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import * as XLSX from 'xlsx'

import { Contact } from '../../api'
import { sendPatMsg, sendTextMsg, sendImagesMsg } from '../../api/index';
import { useSearchTable } from './useSearch';
import ContactForm from './ContactForm.vue';


const {
  query, pageTotal, tableData, allTableData,
  handleSearch, handlePageSizeChange, handlePageChange
} = useSearchTable()

const visible = ref(false)
const editMode = ref('text') // or 'image' or 'file' or 'article'
const editData = ref<Contact>()

const resetEditData = () => {
  editData.value = undefined;
  visible.value = false;
}

const handleShowDialog = (index: number, mode = 'text') => {
  editMode.value = mode;
  editData.value = tableData.value[index];
  visible.value = true;
}

const handleConfirm = async (data: any) => {
  if (!editData.value) return

  let res: any;

  if (data.mode === 'text') {
    res = await sendTextMsg(editData.value.wxid, data.message)
  } else if (data.mode === 'image') {
    res = await sendImagesMsg(editData.value.wxid, data.image_url)
  } else if (data.mode === 'file') {
    // TODO: handle send file
  } else if (data.mode === 'article') {
    // TODO: handle send article
  }

  if (res.code === 1) {
    ElMessage.success('发送成功');
  } else {
    ElMessage.error('发送失败');
  }

  resetEditData()
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
      } else {
        ElMessage.error('拍一拍失败');
      }
    })
    .catch(() => { });
}

const exportXlsx = () => {
  const list = [['ID', '用户名', '自定义名称', '拼音缩写', '拼音']]
  allTableData.value.map((item: any, i: number) => {
    const arr: any[] = [i + 1]
    arr.push(
      ...[
        item.wxid,
        item.nickname,
        item.customAccount,
        item.pinyin,
        item.pinyinAll
      ]
    )
    list.push(arr)
  })
  let WorkSheet = XLSX.utils.aoa_to_sheet(list)
  let new_workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页')
  XLSX.writeFile(new_workbook, `表格_${new Date().toLocaleDateString()}.xlsx`)
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
</style>
