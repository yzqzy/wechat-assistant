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
  customAccount: string
  encryptName: string
  nickname: string
  pinyin: string
  pinyinAll: string
  reserved1: number
  reserved2: number
  type: number
  verifyFlag: number
  wxid: string
}

export interface Room extends Contact {}

export const getContactList = async (): Promise<Result<Contact[]>> =>
  (await request.post('/api/getContactList')).data
