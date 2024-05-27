import { computed, reactive } from 'vue'

import { useContact } from '@/composables/useContact'
import { textIncludes } from '@/utils/tools'

export const useSearchTable = () => {
  const query = reactive({
    keyword: '',
    pageIndex: 1,
    pageSize: 10
  })

  const { contactData } = useContact()

  const filterData = computed(() => {
    const { keyword } = query
    return contactData.value.filter(item => {
      return (
        textIncludes(item.NickName, keyword) ||
        textIncludes(item.Remark, keyword) ||
        textIncludes(item.UserName, keyword)
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
