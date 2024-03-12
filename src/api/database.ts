import request from '@/utils/request'
import { Result } from './common'

interface Table {
  name: string
  rootpage: string
  sql: string
  tableName: string
}

export interface Database {
  databaseName: string
  handle: number
  tables: Table[]
}

export const getDatabases = async (): Promise<Result<Database[]>> =>
  (await request.post('/api/getDBInfo')).data

export const execSql = async (
  dbHandle: number,
  sql: string
): Promise<Result<string[][]>> =>
  (await request.post('/api/execSql', { dbHandle, sql })).data

export const queryChats = (handle: number) => {
  const sql = `
    SELECT chat.strUsrName, chat.nOrder, chat.strNickName, contact.Alias, contact.Remark, contact.NickName, chat.strContent, chat.nMsgType, chat.nMsgLocalId, chat.nMsgStatus, img.smallHeadImgUrl, img.bigHeadImgUrl, chat.nUnReadCount, chat.nTime
    FROM
      Session as chat
      INNER JOIN ContactHeadImgUrl as img ON chat.strUsrName = img.usrName
      INNER JOIN Contact as contact ON chat.strUsrName = contact.UserName
    ORDER BY nOrder DESC;
  `
  return execSql(handle, sql)
}

export const queryContactByWxid = (handle: number, wxid: string) => {
  const sql = `
  SELECT contact.UserName, contact.Alias, contact.Remark, contact.NickName, img.smallHeadImgUrl, img.bigHeadImgUrl
  FROM
    Contact as contact
    INNER JOIN ContactHeadImgUrl as img ON contact.UserName = img.usrName
  WHERE
    UserName = '${wxid}'
`
  return execSql(handle, sql)
}

interface QueryMessage {
  handle: number
  wxid: string
  offset?: number
  limit?: number
}

export const queryMessages = (options: QueryMessage) => {
  const { handle, wxid, offset = 0, limit = 20 } = options

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
  return execSql(handle, sql)
}

interface QueryMessageByTime {
  handle: number
  wxid: string
  startTime?: number
  endTime?: number
}

export const queryMessagesByTime = (options: QueryMessageByTime) => {
  const { handle, wxid, startTime, endTime } = options

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
  return execSql(handle, sql)
}
