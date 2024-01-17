<template>
  <div>
    <div class="title">
      <h2>联系人管理</h2>
    </div>
    <div class="container">
      <div class="search-box">
        <el-input v-model="query.name" placeholder="昵称" class="search-input mr10" clearable></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" @click="exportXlsx">导出Excel</el-button>
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
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button type="info" :icon="Pointer" @click="handlePat(scope.$index)">
              拍一拍
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, sizes, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" @size-change="handlePageSizeChange"
          @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Pointer, Search } from '@element-plus/icons-vue';
import * as XLSX from 'xlsx';

import type { Contact } from '../api/index';
import { getContactList, sendPatMsg } from '../api/index';

const query = reactive({
  name: '',
  pageIndex: 1,
  pageSize: 10
});

const allTableData = ref<Contact[]>([]);
const pageTotal = ref(0);

const tableData = computed(() => {
  const { name, pageIndex, pageSize } = query;
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = pageIndex * pageSize;
  const filterData = allTableData.value.filter((item) => {
    return item.nickname.includes(name);
  });
  return filterData.slice(startIndex, endIndex);
});

getContactList().then((res) => {
  allTableData.value = res.data;
  pageTotal.value = res.data.length || 50;
});

const handleSearch = () => {
  query.pageIndex = 1;
};
const handlePageSizeChange = (val: number) => {
  query.pageSize = val;
};
const handlePageChange = (val: number) => {
  query.pageIndex = val;
};

const handlePat = (index: number) => {
  console.log('handlePat', index)

  const item = tableData.value[index];

  ElMessageBox.confirm('确定要拍一拍吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      console.log('confirm', item)

      return
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
  const list = [['ID', '用户名', '自定义名称', '拼音缩写', '拼音']];
  allTableData.value.map((item: any, i: number) => {
    const arr: any[] = [i + 1];
    arr.push(...[item.wxid, item.nickname, item.customAccount, item.pinyin, item.pinyinAll]);
    list.push(arr);
  });
  let WorkSheet = XLSX.utils.aoa_to_sheet(list);
  let new_workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
  XLSX.writeFile(new_workbook, `表格_${new Date().toLocaleDateString()}.xlsx`);
};
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
