import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Database } from '../api/database'
import { DatabaseContact } from '../typings'

export const formatedContacts = (contacts: string[][]) => {
  contacts.shift()
  return contacts.map(contact => {
    const [
      username,
      alias,
      type,
      remark,
      nickname,
      pyinitial,
      remark_pyinitial,
      smale_head_img_url,
      big_head_img_url
    ] = contact
    return {
      username,
      alias,
      type,
      remark,
      nickname,
      pyinitial,
      remark_pyinitial,
      smale_head_img_url,
      big_head_img_url
    } as DatabaseContact
  })
}

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[] | null>()
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

  const setContacts = (data: DatabaseContact[] | null) => {
    contacts.value = data
  }

  return {
    handlerMapping,

    databases,
    setDatabases,

    contacts,
    setContacts
  }
})
