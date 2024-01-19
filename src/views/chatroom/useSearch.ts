import { computed, reactive, ref } from 'vue'

import { Contact, getContactList } from '../../api'

const includes = (v1: string, v2: string) =>
  v1.toLocaleLowerCase().includes(v2.toLocaleLowerCase())

export const useSearchTable = () => {
  const query = reactive({
    name: '',
    pageIndex: 1,
    pageSize: 10
  })

  const allTableData = ref<Contact[]>([])

  const filterData = computed(() => {
    const { name } = query
    return allTableData.value.filter(item => {
      return includes(item.nickname, name) && item.wxid.includes('@chatroom')
    })
  })

  const pageTotal = computed(() => filterData.value.length)
  const tableData = computed(() => {
    const { pageIndex, pageSize } = query
    const startIndex = (pageIndex - 1) * pageSize
    const endIndex = pageIndex * pageSize
    return filterData.value.slice(startIndex, endIndex)
  })

  const reset = () => {
    query.name = ''
    query.pageIndex = 1
    query.pageSize = 10
  }

  const fetchData = () => {
    getContactList().then(res => {
      allTableData.value = res.data
    })
  }

  const handleSearch = () => {
    query.pageIndex = 1
  }
  const handlePageSizeChange = (val: number) => {
    query.pageSize = val
  }
  const handlePageChange = (val: number) => {
    query.pageIndex = val
  }
  const handleRefreshData = (callback: () => void) => {
    reset()

    setTimeout(() => {
      fetchData()
      callback && callback()
    }, 2000)
  }

  fetchData()

  return {
    query,
    pageTotal,
    tableData,
    filterData,

    handleRefreshData,
    handleSearch,
    handlePageSizeChange,
    handlePageChange
  }
}
