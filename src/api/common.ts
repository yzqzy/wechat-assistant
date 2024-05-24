import request from '@/utils/request'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export const checkLogin = async (): Promise<Result<null>> =>
  (await request.post('/api/checkLogin')).data

export interface UserInfo {
  country: string
  province: string
  city: string
  account: string
  name: string
  headImage: string
  mobile: string
  signature: string
  wxid: string

  dbKey: string
  dataSavePath: string
  currentDataPath: string
}

export const getUserInfo = async (): Promise<Result<UserInfo>> =>
  (await request.post('/api', { type: 28 })).data

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
