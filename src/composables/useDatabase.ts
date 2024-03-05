import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '../store/user'
import { useDatabaseStore } from '../store/database'
import { getDatabases, execSql } from '../api'
import { DatabaseContact, DatabaseMessage, DatabaseMsg } from '../typings'
import {
  formattedChats,
  formattedContacts,
  formattedMessages,
  getWxidByBytesExtra
} from '../utils/database'

export function useDatabase() {
  const loading = ref(true)

  const store = useDatabaseStore()
  const userStore = useUserStore()
  const { handlerMapping, databases, chats, contactMapping } =
    storeToRefs(store)
  const { userInfo } = storeToRefs(userStore)
  const { setDatabases, setChats, setContact } = store

  const messages = ref<DatabaseMessage[]>([])

  const getDatabaseList = async () => {
    const response = await getDatabases()
    if (response.code != 1) return null
    setDatabases(response.data)
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
    setChats(data.filter(chat => chat.remark || chat))

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

  const normalizedMessages = async (
    wxid: string,
    messages: DatabaseMsg[]
  ): Promise<DatabaseMessage[]> => {
    const result: DatabaseMessage[] = []

    for (const message of messages) {
      const new_wxid = message.isSender
        ? userInfo.value?.wxid
        : getWxidByBytesExtra(message.bytesExtra) || wxid

      let user: DatabaseContact | null = null

      if (contactMapping.value && new_wxid in contactMapping.value) {
        // Get user from cache
        user = contactMapping.value[new_wxid]
      } else {
        // Get user from database
        const contact = await getContactByWxid(new_wxid)
        user = (contact && formattedContacts(contact)[0]) || null
        if (user) setContact(user)
      }

      result.push({ ...message, user })
    }

    return result
  }

  const getMessages = async (wxid: string) => {
    if (handlerMapping.value == null) return null

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
      ORDER BY CreateTime DESC limit 20;
    `
    const handle = handlerMapping.value['MSG0.db']
    const response = await execSql(handle, sql)
    if (response.code != 1) return null

    const data = await formattedMessages(response.data)
    messages.value = await normalizedMessages(wxid, data.reverse())
  }

  onMounted(async () => {
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

    databases,
    chats,

    refreshChats,

    messages,
    getMessages
  }
}
