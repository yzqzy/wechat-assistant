import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Database } from '../api/database'
import { DatabaseChat } from '../typings'

export const formatedChats = (chats: string[][]) => {
  chats.shift()
  return chats.map(chat => {
    const [
      wxid,
      order,
      username,
      alias,
      remark,
      nickname,
      lastMsg,
      msgType,
      msgLocalId,
      msgStatus,
      smalllAvatar,
      bigAvatar,

      unReadCount,
      time
    ] = chat
    return {
      wxid,
      order: Number(order),
      username,
      alias,
      remark,
      nickname,
      lastMsg,
      msgType: Number(msgType),
      msgLocalId,
      msgStatus: Number(msgStatus),
      smalllAvatar,
      bigAvatar,
      unReadCount: Number(unReadCount),
      time: new Date(Number(time) * 1000)
    } as DatabaseChat
  })
}

export const useDatabaseStore = defineStore('database', () => {
  const databases = ref<Database[] | null>()
  const chats = ref<DatabaseChat[] | null>()

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

  return {
    handlerMapping,

    databases,
    setDatabases,

    chats,
    setChats
  }
})
