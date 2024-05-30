import { DatabaseChat, DatabaseContact, DatabaseMsg } from '@/typings'
import { msgBytesExtraParser } from './wx-msg'
import {
  DatabaseOriginChat,
  DatabaseOriginContact,
  DatabaseOriginMsg
} from '@/api'

export const formattedChats = (chats: DatabaseOriginChat[]): DatabaseChat[] => {
  return chats.map(chat => {
    const {
      Alias,
      NickName,
      Remark,
      bigHeadImgUrl,
      nMsgLocalID,
      nMsgStatus,
      nMsgType,
      nOrder,
      nTime,
      nUnReadCount,
      smallHeadImgUrl,
      strContent,
      strNickName,
      strUsrName
    } = chat
    return {
      wxid: strUsrName,
      order: Number(nOrder),
      username: strNickName,
      alias: Alias,
      remark: Remark,
      nickname: NickName,
      lastMsg: strContent,
      msgType: Number(nMsgType),
      msgLocalId: nMsgLocalID,
      msgStatus: Number(nMsgStatus),
      smalllAvatar: smallHeadImgUrl,
      bigAvatar: bigHeadImgUrl,
      unReadCount: Number(nUnReadCount),
      time: new Date(Number(nTime) * 1000)
    }
  })
}

export const formattedMessages = async (
  messages: DatabaseOriginMsg[]
): Promise<DatabaseMsg[]> => {
  const data = []
  for (let i = 1; i < messages.length; i++) {
    const {
      BytesExtra,
      CompressContent,
      CreateTime,
      DisplayContent,
      IsSender,
      StrContent,
      StrTalker,
      SubType,
      Type,
      localId
    } = messages[i]
    data.push({
      wxid: StrTalker,
      localId,
      type: Number(Type),
      subType: Number(SubType),
      isSender: IsSender === '1',
      createTime: new Date(Number(CreateTime) * 1000),
      content: StrContent,
      displayContent: DisplayContent,
      compresssContent: CompressContent,
      bytesExtra: await msgBytesExtraParser(BytesExtra)
    })
  }
  return data
}

export const formattedContacts = (
  contacts: DatabaseOriginContact[]
): DatabaseContact[] => {
  return contacts.map(contact => {
    const {
      Alias,
      NickName,
      Remark,
      bigHeadImgUrl,
      smallHeadImgUrl,
      UserName
    } = contact
    return {
      wxid: UserName,
      alias: Alias,
      nickname: NickName,
      remark: Remark,
      smalllAvatar: smallHeadImgUrl,
      bigAvatar: bigHeadImgUrl
    }
  })
}
