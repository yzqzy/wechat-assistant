import { computed, reactive, ref } from 'vue'

import { Contact, getContactList } from '../../api'

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
      return item.nickname.includes(name) || item.customAccount.includes(name)
    })
  })

  const pageTotal = computed(() => filterData.value.length)
  const tableData = computed(() => {
    const { pageIndex, pageSize } = query
    const startIndex = (pageIndex - 1) * pageSize
    const endIndex = pageIndex * pageSize
    return filterData.value.slice(startIndex, endIndex)
  })

  getContactList().then(res => {
    allTableData.value = res.data
  })

  const handleSearch = () => {
    query.pageIndex = 1
  }
  const handlePageSizeChange = (val: number) => {
    query.pageSize = val
  }
  const handlePageChange = (val: number) => {
    query.pageIndex = val
  }

  return {
    query,
    pageTotal,
    tableData,
    allTableData,

    handleSearch,
    handlePageSizeChange,
    handlePageChange
  }
}
