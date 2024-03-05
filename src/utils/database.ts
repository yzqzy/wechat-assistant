import { DatabaseChat, DatabaseContact, DatabaseMsg } from '../typings'

const { ipcRenderer } = window

const msgBytesExtraParser = (bytesExtra: string) => {
  return new Promise<any>(resolve => {
    ipcRenderer.invoke('msg-parser', bytesExtra).then(data => {
      resolve((data && JSON.parse(data)) || {})
    })
  })
}

export const formattedChats = (chats: string[][]): DatabaseChat[] => {
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
    }
  })
}

export const formattedMessages = async (
  messages: string[][]
): Promise<DatabaseMsg[]> => {
  const data = []
  for (let i = 1; i < messages.length; i++) {
    const [
      wxid,
      localId,
      type,
      subType,
      isSender,
      createTime,
      content,
      displayContent,
      compresssContent,
      bytesExtra
    ] = messages[i]
    data.push({
      wxid,
      localId,
      type: Number(type),
      subType: Number(subType),
      isSender: isSender === '1',
      createTime: new Date(Number(createTime) * 1000),
      content,
      displayContent,
      compresssContent,
      bytesExtra: await msgBytesExtraParser(bytesExtra)
    })
  }
  return data
}

export const formattedContacts = (contacts: string[][]): DatabaseContact[] => {
  contacts.shift()
  return contacts.map(contact => {
    const [wxid, alias, remark, nickname, smalllAvatar, bigAvatar] = contact
    return {
      wxid,
      alias,
      nickname,
      remark,
      smalllAvatar,
      bigAvatar
    }
  })
}

export const getWxidByBytesExtra = (data: any) => {
  data = data && data.message2
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.field1 !== 1) continue
      return item.field2
    }
  }
  return null
}
