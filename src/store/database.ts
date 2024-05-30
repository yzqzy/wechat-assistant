import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DatabaseChat, DatabaseContact } from '@/typings'

export const useDatabaseStore = defineStore('database', () => {
  const chats = ref<DatabaseChat[] | null>()
  const contacts = ref<DatabaseContact[] | null>()

  const selectedChat = ref<DatabaseChat | null>(null)

  const addChats = (data: DatabaseChat[] | null) => {
    chats.value = data
  }
  const setSelectedChat = (data: DatabaseChat) => {
    selectedChat.value = data
  }

  const contactMapping = computed(() => {
    return contacts.value?.reduce((acc, cur) => {
      acc[cur.wxid] = cur
      return acc
    }, {} as Record<string, DatabaseContact>)
  })
  const addContacts = (data: DatabaseContact[] | null) => {
    contacts.value = data
  }
  const addContact = (data: DatabaseContact) => {
    if (contactMapping.value && contactMapping.value[data.wxid]) {
      return
    }
    addContacts([...(contacts.value || []), data])
  }

  return {
    chats,
    addChats,

    selectedChat,
    setSelectedChat,

    contactMapping,
    contacts,
    addContacts,
    addContact
  }
})
