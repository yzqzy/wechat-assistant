import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useContactStore } from '@/store/contact'
import { getContactList } from '@/api'

export const useContact = () => {
  const store = useContactStore()
  const { contactData, contactMapping } = storeToRefs(store)

  const fetchData = () => {
    getContactList().then(res => {
      store.addContactData(res.data.data)
    })
  }

  onMounted(fetchData)

  return {
    contactData,
    contactMapping,

    fetchData
  }
}
