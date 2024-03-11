import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store/user'
import { useDatabaseStore } from '@/store/database'
import { getDatabases, execSql } from '@/api'
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

    const sql = `
      SELECT chat.strUsrName, chat.nOrder, chat.strNickName, contact.Alias, contact.Remark, contact.NickName, chat.strContent, chat.nMsgType, chat.nMsgLocalId, chat.nMsgStatus, img.smallHeadImgUrl, img.bigHeadImgUrl, chat.nUnReadCount, chat.nTime
      FROM
        Session as chat
        INNER JOIN ContactHeadImgUrl as img ON chat.strUsrName = img.usrName
        INNER JOIN Contact as contact ON chat.strUsrName = contact.UserName
      ORDER BY nOrder DESC;
    `
    const handle = handlerMapping.value['MicroMsg.db']

    const response = await execSql(handle, sql)
    if (response.code != 1) return null

    const data = formattedChats(response.data)
    addChats(data.filter(chat => chat.remark || chat))

    return data
  }

  const getContactByWxid = async (wxid: string) => {
    if (handlerMapping.value == null) return null

    const sql = `
      SELECT contact.UserName, contact.Alias, contact.Remark, contact.NickName, img.smallHeadImgUrl, img.bigHeadImgUrl
      FROM
        Contact as contact
        INNER JOIN ContactHeadImgUrl as img ON contact.UserName = img.usrName
      WHERE
        UserName = '${wxid}'
    `
    const handle = handlerMapping.value['MicroMsg.db']
    const response = await execSql(handle, sql)
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

    const offset = (page.value - 1) * 20

    const sql = `
      SELECT StrTalker, localId, Type, SubType, IsSender, CreateTime, StrContent, DisplayContent, CompressContent, BytesExtra 
      FROM MSG
        WHERE
          TalkerId = (
            SELECT rowid as TalkerId
            FROM Name2ID
            WHERE
              UsrName = '${wxid}'
          )
      ORDER BY CreateTime DESC LIMIT 20 OFFSET ${offset};
    `
    const handle = handlerMapping.value['MSG0.db']
    const response = await execSql(handle, sql)
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
