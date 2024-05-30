import moment from 'moment'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store/user'
import { useDatabaseStore } from '@/store/database'
import {
  queryChats,
  queryContactByWxid,
  queryMessages,
  queryMessagesByTime
} from '@/api'
import { getWxidByBytesExtra, getImagePath, getEmojiPath } from '@/utils/wx-msg'
import { useExport } from '@/composables/useExport'
import { DatabaseContact, DatabaseMessage, DatabaseMsg } from '@/typings'
import {
  formattedChats,
  formattedContacts,
  formattedMessages
} from '@/utils/formatted'

// message types that are enabled to display in chat history
export const enabled_message_types = [1, 3, 47, 10000]

export function useDatabase() {
  const loading = ref(true)

  const refreshing = ref(false)

  const messageLoading = ref(false)
  const loadFinished = ref(false)

  const userStore = useUserStore()
  const { userInfo, dataSavePath } = storeToRefs(userStore)

  const store = useDatabaseStore()
  const { chats, contactMapping, selectedChat } = storeToRefs(store)
  const { addChats, addContact, setSelectedChat } = store

  const { exportXlsx } = useExport()

  const messages = ref<DatabaseMessage[]>([])
  const page = ref(1)

  const resetParams = () => {
    messageLoading.value = false
    loadFinished.value = false
    page.value = 1
  }

  const refreshChats = async () => {
    loading.value = true
    await getChats(true)
    loading.value = false
  }

  const getChats = async (forceUpdate = false) => {
    if (chats.value && !forceUpdate) return chats.value

    const response = await queryChats()
    if (response.error_code != 10000) return null

    const data = formattedChats(response.data.data)
    addChats(data.filter(chat => chat.remark || chat))

    return data
  }

  const getContactByWxid = async (wxid: string) => {
    const response = await queryContactByWxid(wxid)
    if (response.error_code != 10000) return null
    return response.data
  }

  const normailzedUser = async (wxid: string, message: DatabaseMsg) => {
    let user: DatabaseContact | null = null

    const new_wxid = message.isSender
      ? userInfo.value?.userName
      : getWxidByBytesExtra(message.bytesExtra) || wxid

    if (contactMapping.value && new_wxid in contactMapping.value) {
      // Get user from cache
      user = contactMapping.value[new_wxid]
    } else {
      // Get user from database
      const contact = await getContactByWxid(new_wxid)
      user = (contact && formattedContacts(contact.data)[0]) || null
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
    messages: DatabaseMsg[],
    rewrite = true
  ): Promise<DatabaseMessage[]> => {
    const result: DatabaseMessage[] = []

    for (const message of messages) {
      const user = await normailzedUser(wxid, message)
      if (rewrite) {
        message.content = await normalizedContent(message)
      }
      result.push({ ...message, user })
    }

    return result
  }

  const getMessages = async (wxid: string) => {
    if (!refreshing.value) messageLoading.value = true

    const offset = (page.value - 1) * 20

    const response = await queryMessages({ wxid, offset })
    if (response.error_code != 10000) return null

    const data = await formattedMessages(response.data.data)
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

  const getMessagesByTime = async (
    wxid: string,
    startTime?: string,
    endTime?: string
  ) => {
    const response = await queryMessagesByTime({
      wxid,
      startTime: moment(startTime).unix(),
      endTime: moment(endTime).unix()
    })
    if (response.error_code != 10000) return null

    const data = await formattedMessages(response.data.data)
    const message_data = await normalizedMessages(wxid, data, false)

    return message_data
  }

  const exportMessages = async (
    enabledTypes: number[],
    format: string,
    startTime?: string,
    endTime?: string
  ) => {
    if (selectedChat.value == null) return

    const current = selectedChat.value

    const messages_data = await getMessagesByTime(
      current.wxid,
      startTime,
      endTime
    )
    if (!messages_data) return

    switch (format) {
      case 'xlsx':
        await exportXlsx({
          title: `聊天记录_${current.remark || current.nickname}`,
          columns: {
            ['user.wxid']: '微信ID',
            ['user.remark']: '备注',
            ['user.nickname']: '昵称',
            type: '分类',
            subType: '子分类',
            content: '聊天内容',
            createTime: '发送时间'
          },
          data: messages_data.filter(msg => enabledTypes.includes(msg.type))
        })
        break
      default:
        console.log('Unsupported export format')
        break
    }
  }

  onMounted(async () => {
    if (selectedChat.value != null) {
      await getMessages(selectedChat.value.wxid)
    }

    await getChats()

    loading.value = false
  })

  return {
    loading,
    messageLoading,
    refreshing,

    chats,

    selectedChat,
    setSelectedChat,

    messages,
    getMessages,

    resetParams,
    refreshChats,
    loadMoreData,

    exportMessages
  }
}
