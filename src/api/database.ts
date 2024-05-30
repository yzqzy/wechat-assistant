import request from '@/utils/request'
import { Result } from '@/typings'

interface DatabaseResult<T> {
  data: T
  desc: ''
  status: number
}

export interface DatabaseOriginChat {
  Alias: string
  NickName: string
  Remark: string
  bigHeadImgUrl: string
  nMsgLocalID: string
  nMsgStatus: string
  nMsgType: string
  nOrder: string
  nTime: string
  nUnReadCount: string
  smallHeadImgUrl: string
  strContent: string
  strNickName: string
  strUsrName: string
}

export const execSql = async <T>(
  dbName: string,
  sql: string
): Promise<Result<DatabaseResult<T>>> =>
  (await request.post('/api/', { type: 10058, dbName, sql })).data

export const queryChats = () => {
  const sql = `
    SELECT chat.strUsrName, chat.nOrder, chat.strNickName, contact.Alias, contact.Remark, contact.NickName, chat.strContent, chat.nMsgType, chat.nMsgLocalId, chat.nMsgStatus, img.smallHeadImgUrl, img.bigHeadImgUrl, chat.nUnReadCount, chat.nTime
    FROM
      Session as chat
      INNER JOIN ContactHeadImgUrl as img ON chat.strUsrName = img.usrName
      INNER JOIN Contact as contact ON chat.strUsrName = contact.UserName
    ORDER BY nOrder DESC;
  `
  return execSql<DatabaseOriginChat[]>('MicroMsg.db', sql)
}

export interface DatabaseOriginContact {
  Alias: string
  NickName: string
  Remark: string
  UserName: string
  bigHeadImgUrl: string
  smallHeadImgUrl: string
}

export const queryContactByWxid = (wxid: string) => {
  const sql = `
  SELECT contact.UserName, contact.Alias, contact.Remark, contact.NickName, img.smallHeadImgUrl, img.bigHeadImgUrl
  FROM
    Contact as contact
    INNER JOIN ContactHeadImgUrl as img ON contact.UserName = img.usrName
  WHERE
    UserName = '${wxid}'
`
  return execSql<DatabaseOriginContact[]>('MicroMsg.db', sql)
}

interface QueryMessage {
  wxid: string
  offset?: number
  limit?: number
}

export interface DatabaseOriginMsg {
  BytesExtra: string
  CompressContent: string
  CreateTime: string
  DisplayContent: string
  IsSender: string
  StrContent: string
  StrTalker: string
  SubType: string
  Type: string
  localId: string
}

export const queryMessages = (options: QueryMessage) => {
  const { wxid, offset = 0, limit = 20 } = options

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
  ORDER BY CreateTime DESC LIMIT ${limit} OFFSET ${offset};
`
  return execSql<DatabaseOriginMsg[]>('MSG0.db', sql)
}

interface QueryMessageByTime {
  wxid: string
  startTime?: number
  endTime?: number
}

export const queryMessagesByTime = (options: QueryMessageByTime) => {
  const { wxid, startTime, endTime } = options

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
      ${
        startTime && endTime
          ? `AND CreateTime >= ${startTime} AND CreateTime <= ${endTime}`
          : ''
      }
  ORDER BY CreateTime;
`
  return execSql<DatabaseOriginMsg[]>('MSG0.db', sql)
}
