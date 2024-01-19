<template>
  <div class="chatroom-search">
    <el-input v-model="query.name" placeholder="请输入昵称或微信号" class="search-input mr10" clearable></el-input>
    <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
  </div>
  <div class="chatroom-table">
    <el-table :data="tableData" height="440px" class="table" header-cell-class-name="table-header">
      <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="account" label="微信号" align="center">
        <template #default="scope">
          <div>{{ scope.row.account || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template #default="scope">
          <el-image class="table-td-thumb" :src="scope.row.headImage" :z-index="9999"
            :preview-src-list="[scope.row.headImage]" preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="chatroom-pagination">
    <el-pagination layout="total, sizes, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
      :total="pageTotal" @size-change="handlePageSizeChange" @current-change="handlePageChange"></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';

import { textIncludes } from '../../utils/tools'
import type { ChatRoom } from '../../api'

const props = defineProps({
  chatroom: {
    type: Object as () => ChatRoom | undefined,
    required: true
  },
  confirm: {
    type: Function,
    required: true
  }
});

const query = reactive({
  name: '',
  pageIndex: 1,
  pageSize: 10
})

const allTableData = computed(() => props.chatroom?.members || [])

const filterData = computed(() => {
  const { name } = query
  return allTableData.value.filter(item => {
    if (typeof item === 'string') return true
    return (
      textIncludes(item.nickname, name) ||
      textIncludes(item.account, name)
    )
  })
})

const pageTotal = computed(() => filterData.value.length)
const tableData = computed(() => {
  const { pageIndex, pageSize } = query

  const startIndex = (pageIndex - 1) * pageSize
  const endIndex = pageIndex * pageSize

  const data = filterData.value.slice(startIndex, endIndex)

  // TODO: lazy load

  return data
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

const handleDelete = (item: any) => {
  props.confirm({
    title: '确认删除',
    content: `确认删除 ${item.nickname}？`,
    onConfirm: () => {
      const index = allTableData.value.indexOf(item)
      allTableData.value.splice(index, 1)
    }
  })
}
</script>

<style lang="scss" scoped>
.chatroom-search {
  display: flex;
  margin-bottom: 20px;

  .search-input {
    width: 200px;
  }

  .mr10 {
    margin-right: 10px;
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
}


.chatroom-pagination {
  padding-top: 30px;
}
</style>
