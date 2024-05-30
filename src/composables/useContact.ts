import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useContactStore } from '@/store/contact'
import { getContactList, getChatRoomList } from '@/api'

export const useContact = () => {
  const store = useContactStore()
  const { contactData, contactMapping } = storeToRefs(store)

  const fetchData = async () => {
    const contactList = await getContactList()
    const chatroomList = await getChatRoomList()

    if (contactList.data.data && chatroomList.data.data) {
      store.addContactData([
        ...contactList.data.data,
        ...chatroomList.data.data
      ])
    }
  }

  onMounted(fetchData)

  return {
    contactData,
    contactMapping,

    fetchData
  }
}
