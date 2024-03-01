import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useDatabaseStore, formatedContacts } from '../store/database'
import { getDatabases, execSql } from '../api'

export function useDatabase() {
  const loading = ref(true)

  const store = useDatabaseStore()
  const { handlerMapping, databases, contacts } = storeToRefs(store)
  const { setDatabases, setContacts } = store

  const getDatabaseList = async () => {
    const response = await getDatabases()
    if (response.code != 1) return null
    setDatabases(response.data)
    return response.data
  }

  const refreshContacts = async () => {
    loading.value = true
    await getContacts(true)
    loading.value = false
  }

  const getContacts = async (forceUpdate = false) => {
    if (handlerMapping.value == null) return null
    if (contacts.value && !forceUpdate) return contacts.value

    const sql = `
      SELECT UserName, Alias, Type, Remark, NickName, PYInitial, RemarkPYInitial, ContactHeadImgUrl.smallHeadImgUrl, ContactHeadImgUrl.bigHeadImgUrl,ExTraBuf,COALESCE(ContactLabel.LabelName, 'None') AS labelName
                      FROM Contact
                      INNER JOIN ContactHeadImgUrl ON Contact.UserName = ContactHeadImgUrl.usrName
                      LEFT JOIN ContactLabel ON Contact.LabelIDList = ContactLabel.LabelId
                      WHERE (Type!=4 AND VerifyFlag=0)
                          AND NickName != ''
                      ORDER BY 
                          CASE
                              WHEN RemarkPYInitial = '' THEN PYInitial
                              ELSE RemarkPYInitial
                          END ASC
    `
    const handle = handlerMapping.value['MicroMsg.db']

    const response = await execSql(handle, sql)
    if (response.code != 1) return null

    const data = formatedContacts(response.data)
    setContacts(data)

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

  const getMsgContacts = async () => {
    if (handlerMapping.value == null) return null

    const sql = `select StrTalker, MAX(CreateTime) from MSG group by StrTalker`
    const handle = handlerMapping.value['MSG0.db']

    const response = await execSql(handle, sql)
    if (response.code != 1) return null

    console.log(response.data)
  }

  onMounted(async () => {
    if (databases.value != null) {
      loading.value = false
      return
    }

    await getDatabaseList()
    await getContacts()
    loading.value = false
  })

  return {
    loading,

    databases,
    contacts,

    refreshContacts,

    getMsgContacts,
    getMessages
  }
}
