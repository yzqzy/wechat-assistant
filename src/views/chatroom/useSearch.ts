import { computed, onMounted, reactive } from 'vue'

import { getMembers } from '../../api'
import { useContact } from '../../composables/useContact'
import { delaySync, textIncludes } from '../../utils/tools'

export const useSearchTable = () => {
  const query = reactive({
    keyword: '',
    pageIndex: 1,
    pageSize: 10
  })
  const initialSize = Math.min(query.pageSize * 2, 50)

  const { contactData, fetchData } = useContact()

  const filterData = computed(() => {
    const { keyword } = query
    return contactData.value.filter(item => {
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
    query.keyword = ''
    query.pageIndex = 1
    query.pageSize = 10
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
    }, 3000)
  }

  onMounted(fetchData)

  const lazyFetchMembers = (members: any[]) => {
    let isAbort = false

    const offset = members.findIndex(item => typeof item === 'string')

    if (offset === -1) return

    let start = offset + 1

    ;(async () => {
      while (start <= members.length - 1) {
        await delaySync()

        if (isAbort) break

        const memberIds = members.slice(start, start + initialSize)
        const memberData = await getMembers(memberIds)

        members.splice(start, initialSize, ...memberData)

        start += initialSize
      }
    })()

    return {
      abort: () => {
        isAbort = true
      }
    }
  }

  return {
    query,
    pageTotal,
    allTableData: contactData,
    tableData,
    filterData,

    initialSize,
    lazyFetchMembers,

    handleRefreshData,
    handleSearch,
    handlePageSizeChange,
    handlePageChange
  }
}
