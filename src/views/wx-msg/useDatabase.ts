import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store/user'
import { useDatabaseStore } from '@/store/database'
import {
  getDatabases,
  queryChats,
  queryContactByWxid,
  queryMessages
} from '@/api'
import { getWxidByBytesExtra, getImagePath, getEmojiPath } from '@/utils/wx-msg'
import { DatabaseContact, DatabaseMessage, DatabaseMsg } from '@/typings'
import {
  formattedChats,
  formattedContacts,
  formattedMessages
} from '@/utils/formatted'

export function useDatabase() {
  const loading = ref(true)

  const refreshing = ref(false)

  const messageLoading = ref(false)
  const loadFinished = ref(false)

  const userStore = useUserStore()
  const { userInfo, dataSavePath } = storeToRefs(userStore)

  const store = useDatabaseStore()
  const { handlerMapping, databases, chats, contactMapping, selectedChat } =
    storeToRefs(store)
  const { addDatabases, addChats, addContact, setSelectedChat } = store

  const messages = ref<DatabaseMessage[]>([])
  const page = ref(1)

  const resetParams = () => {
    messageLoading.value = false
    loadFinished.value = false
    page.value = 1
  }

  const getDatabaseList = async () => {
    const response = await getDatabases()
    if (response.code != 1) return null
    addDatabases(response.data)
    return response.data
  }

  const refreshChats = async () => {
    loading.value = true
    await getChats(true)
    loading.value = false
  }

  const getChats = async (forceUpdate = false) => {
    if (handlerMapping.value == null) return null
    if (chats.value && !forceUpdate) return chats.value

    const handle = handlerMapping.value['MicroMsg.db']

    const response = await queryChats(handle)
    if (response.code != 1) return null

    const data = formattedChats(response.data)
    addChats(data.filter(chat => chat.remark || chat))

    return data
  }

  const getContactByWxid = async (wxid: string) => {
    if (handlerMapping.value == null) return null

    const handle = handlerMapping.value['MicroMsg.db']
    const response = await queryContactByWxid(handle, wxid)
    if (response.code != 1) return null

    return response.data
  }

  const normailzedUser = async (wxid: string, message: DatabaseMsg) => {
    let user: DatabaseContact | null = null

    const new_wxid = message.isSender
      ? userInfo.value?.wxid
      : getWxidByBytesExtra(message.bytesExtra) || wxid

    if (contactMapping.value && new_wxid in contactMapping.value) {
      // Get user from cache
      user = contactMapping.value[new_wxid]
    } else {
      // Get user from database
      const contact = await getContactByWxid(new_wxid)
      user = (contact && formattedContacts(contact)[0]) || null
      if (user) addContact(user)
    }

    return user
  }

  const normalizedContent = async (message: DatabaseMsg) => {
    const { type, content } = message

    // TODO: handle other types of messages

    switch (type) {
      case 1: // text message
        return content
      case 3: // image message
        return await getImagePath(message, dataSavePath.value)
      case 47: // emoji message
        return await getEmojiPath(content, dataSavePath.value)
      case 10000: // system message
        return content.replace(/^<revokemsg>/, '').replace(/<\/revokemsg>$/, '')
      default:
        return content
    }
  }

  const normalizedMessages = async (
    wxid: string,
    messages: DatabaseMsg[]
  ): Promise<DatabaseMessage[]> => {
    const result: DatabaseMessage[] = []

    for (const message of messages) {
      const user = await normailzedUser(wxid, message)
      message.content = await normalizedContent(message)
      result.push({ ...message, user })
    }

    return result
  }

  const getMessages = async (wxid: string) => {
    if (handlerMapping.value == null) return null

    if (!refreshing.value) messageLoading.value = true

    const offset = (page.value - 1) * 20

    const handle = handlerMapping.value['MSG0.db']
    const response = await queryMessages({ handle, wxid, offset })
    if (response.code != 1) return null

    const data = await formattedMessages(response.data)
    const message_data = await normalizedMessages(wxid, data)

    if (page.value == 1) {
      messages.value = message_data
    } else {
      if (message_data.length == 0) {
        loadFinished.value = true
        return
      }
      messages.value = [...messages.value, ...message_data]
    }

    messageLoading.value = false
  }

  const loadMoreData = async () => {
    if (refreshing.value || selectedChat.value == null || loadFinished.value)
      return

    refreshing.value = true
    page.value += 1

    await getMessages(selectedChat.value.wxid)

    setTimeout(() => {
      refreshing.value = false
    }, 600)
  }

  onMounted(async () => {
    if (selectedChat.value != null) {
      await getMessages(selectedChat.value.wxid)
    }

    if (databases.value != null) {
      loading.value = false
      return
    }

    await getDatabaseList()
    await getChats()

    loading.value = false
  })

  return {
    loading,
    messageLoading,
    refreshing,

    databases,
    chats,

    selectedChat,
    setSelectedChat,

    messages,
    getMessages,

    resetParams,
    refreshChats,
    loadMoreData
  }
}
