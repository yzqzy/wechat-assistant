<template>
  <div class="chatroom-search">
    <div>
      <el-input v-model="query.keyword" placeholder="请输入昵称或微信号" class="search-input mr10" clearable
        @keyup.enter.native="handleSearch" @clear="handleSearch"></el-input>
      <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
    </div>
    <div class="mr30">
      <el-button v-if="isAdmin" type="warning" class="btn" plain @click="handleSendMsg('notify@all')">
        发消息(@all)
      </el-button>
      <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
    </div>
  </div>
  <div class="chatroom-table">
    <el-table :data="tableData" height="40vh" class="table" header-cell-class-name="table-header">
      <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="account" label="微信号" align="center">
        <template #default="scope">
          <div>{{ scope.row && scope.row.account || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template #default="scope">
          <el-image class="table-td-thumb" :src="scope.row && scope.row.headImage" :z-index="9999"
            :preview-src-list="[scope.row && scope.row.headImage]" preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column :width="isAdmin ? '240px' : '140px'" label="操作" align="center">
        <template #default="scope">

          <el-button type="primary" class="btn" plain @click="handleSendMsg(scope.row.wxid)">
            发@消息
          </el-button>
          <el-button v-if="isAdmin" type="danger" class="btn" plain @click="handleDelete(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="chatroom-pagination">
    <el-pagination layout="total, sizes, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
      :total="pageTotal" :page-sizes="[10, 20, 30, 40, 50]" @size-change="handlePageSizeChange"
      @current-change="handlePageChange"></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';

import type { ChatRoom } from '../../api'
import { textIncludes } from '../../utils/tools'
import { useExport } from '../../composables/useExport'

const { exportXlsx } = useExport()

const props = defineProps<{
  title: string,
  isAdmin: boolean,
  chatroom: ChatRoom | undefined,
}>();


const emit = defineEmits<{
  (e: 'confirm', wxids: string[]): void
  (e: 'delete', wxids: string[]): void
}>()


const query = reactive({
  keyword: '',
  pageIndex: 1,
  pageSize: 10
})

const allTableData = computed(() => props.chatroom?.members || [])

const filterData = computed(() => {
  const { keyword } = query

  if (keyword === '') return allTableData.value

  return allTableData.value.filter(item => {
    if (typeof item === 'string') return true
    return (
      textIncludes(item.nickname, keyword) ||
      textIncludes(item.account, keyword)
    )
  })
})

const pageTotal = computed(() => filterData.value.length)
const tableData = computed(() => {
  const { pageIndex, pageSize } = query

  const startIndex = (pageIndex - 1) * pageSize
  const endIndex = pageIndex * pageSize

  return filterData.value.slice(startIndex, endIndex)
})

const handleSearch = () => {
  query.pageIndex = 1
}

const handlePageChange = (pageIndex: number) => {
  query.pageIndex = pageIndex
}

const handlePageSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
}

const handleSendMsg = (wxid: string) => {
  emit('confirm', [wxid])
}

const handleDelete = (index: number) => {
  const item = tableData.value[index]
  emit('delete', [item.wxid])
}

const handleExportXlsx = async () => {
  await exportXlsx({
    title: props.title,
    columns: {
      wxid: 'ID',
      nickname: '昵称',
      account: '微信号'
    },
    data: filterData.value
  })
}
</script>

<style lang="scss" scoped>
.chatroom-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .search-input {
    width: 200px;
  }
}

.chatroom-table {
  .table-header {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  .table-td-thumb {
    width: 80px;
    height: 80px;
  }

  .btn {
    margin: 5px;
  }
}

.chatroom-pagination {
  padding-top: 30px;
}
</style>
