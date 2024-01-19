import { computed, onMounted, reactive, ref } from 'vue'

import { Contact, getContactList } from '../../api'
import { textIncludes } from '../../utils/tools'

export const useSearchTable = () => {
  const query = reactive({
    keyword: '',
    pageIndex: 1,
    pageSize: 10
  })

  const allTableData = ref<Contact[]>([])

  const filterData = computed(() => {
    const { keyword } = query
    return allTableData.value.filter(item => {
      return (
        textIncludes(item.nickname, keyword) ||
        textIncludes(item.customAccount, keyword)
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
  const handlePageSizeChange = (val: number) => {
    query.pageSize = val
  }
  const handlePageChange = (val: number) => {
    query.pageIndex = val
  }

  onMounted(() => {
    getContactList().then(res => {
      allTableData.value = res.data
    })
  })

  return {
    query,
    pageTotal,
    tableData,
    filterData,

    handleSearch,
    handlePageSizeChange,
    handlePageChange
  }
}
