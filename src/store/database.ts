import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Database } from '../api/database'
import { DatabaseChat, DatabaseContact } from '../typings'

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[] | null>()
  const chats = ref<DatabaseChat[] | null>()
  const contacts = ref<DatabaseContact[] | null>()

  const handlerMapping = computed(() => {
    return databases.value?.reduce((acc, cur) => {
      acc[cur.databaseName] = cur.handle
      return acc
    }, {} as Record<string, number>)
  })
  const setDatabases = (data: Database[] | null) => {
    databases.value = data
  }

  const setChats = (data: DatabaseChat[] | null) => {
    chats.value = data
  }

  const contactMapping = computed(() => {
    return contacts.value?.reduce((acc, cur) => {
      acc[cur.wxid] = cur
      return acc
    }, {} as Record<string, DatabaseContact>)
  })
  const setContacts = (data: DatabaseContact[] | null) => {
    contacts.value = data
  }
  const setContact = (data: DatabaseContact) => {
    if (contactMapping.value && contactMapping.value[data.wxid]) {
      return
    }
    contacts.value?.push(data)
  }

  return {
    handlerMapping,
    databases,
    setDatabases,

    chats,
    setChats,

    contactMapping,
    contacts,
    setContacts,
    setContact
  }
})
