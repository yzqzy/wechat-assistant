import { computed, onMounted, ref } from 'vue'
import { Contact, getContactList } from '../api'

export const useContact = () => {
  const contactData = ref<Contact[]>([])
  const contactMapping = computed(() => {
    return contactData.value.reduce((acc, cur) => {
      acc[cur.wxid] = cur.nickname
      return acc
    }, {} as Record<string, string>)
  })

  const fetchData = () => {
    getContactList().then(res => {
      contactData.value = res.data
    })
  }

  onMounted(fetchData)

  return {
    contactData,
    contactMapping,

    fetchData
  }
}
