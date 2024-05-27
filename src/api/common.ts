import request from '@/utils/request'
import { Result } from '@/typings'

export interface UserInfoResult<T> {
  data: T
  desc: string
  status: number
}

export interface UserInfo {
  uin: number
  userName: string
  nickName: string
  alias: string
  phone: string
  province: string
  nation: string
  sex: number
  signature: string

  bigHeadImgUrl: string
  smallHeadImgUrl: string

  isLogin: boolean

  dbKey: string
  exePath: string
  cachePath: string
}

export const getUserInfo = async (): Promise<
  Result<UserInfoResult<UserInfo>>
> => (await request.post('/api/', { type: 28 })).data

export interface Contact {
  NickName: string
  PYInitial: string
  Remark: string
  RemarkPYInitial: string
  UserName: string
  smallHeadImgUrl: string
}

export interface Room extends Contact {}

export const getContactList = async (): Promise<
  Result<UserInfoResult<Contact[]>>
> =>
  (
    await request.post('/api/', {
      type: 10058,
      dbName: 'MicroMsg.db',
      sql: `SELECT UserName,Remark,NickName,PYInitial,RemarkPYInitial,t2.smallHeadImgUrl FROM Contact t1 LEFT JOIN ContactHeadImgUrl t2 ON t1.UserName = t2.usrName WHERE t1.VerifyFlag = 0 AND (t1.Type = 3 OR t1.Type > 50) and t1.Type != 2050 AND t1.UserName NOT IN ('qmessage', 'tmessage') ORDER BY t1.Remark DESC;`
    })
  ).data
