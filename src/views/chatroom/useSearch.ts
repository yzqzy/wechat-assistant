import { computed, onMounted, reactive, ref } from 'vue'

import { Contact, getContactList } from '../../api'
import { textIncludes } from '../../utils/tools'

export const useSearchTable = () => {
  const keyword = ref('')

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
        textIncludes(item.nickname, keyword) && item.wxid.includes('@chatroom')
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

  const reset = () => {
    keyword.value = ''
    query.keyword = ''
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
    query.keyword = keyword.value
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

  onMounted(fetchData)

  return {
    query,
    keyword,
    pageTotal,
    tableData,
    filterData,

    handleRefreshData,
    handleSearch,
    handlePageSizeChange,
    handlePageChange
  }
}
