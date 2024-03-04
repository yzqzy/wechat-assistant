import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useDatabaseStore, formatedChats } from '../store/database'
import { getDatabases, execSql } from '../api'

export function useDatabase() {
  const loading = ref(true)

  const store = useDatabaseStore()
  const { handlerMapping, databases, chats } = storeToRefs(store)
  const { setDatabases, setChats } = store

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

    const data = formatedChats(response.data)
    setChats(data.filter(chat => chat.remark || chat))

    return data
  }

  const getMessages = async (username: string) => {
    if (handlerMapping.value == null) return null

    const sql = `
      select localId,TalkerId,Type,SubType,IsSender,CreateTime,Status,StrContent,strftime('%Y-%m-%d %H:%M:%S',CreateTime,'unixepoch','localtime') as StrTime,MsgSvrID,BytesExtra,CompressContent,DisplayContent
      from MSG
      where StrTalker=${username}
      order by CreateTime    
    `
    const handle = handlerMapping.value['MSG0.db']
    const response = await execSql(handle, sql)
    console.log(response.data)
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

    getMessages
  }
}
