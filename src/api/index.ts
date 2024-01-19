import request from '../utils/request'
import { Result } from './common'

export * from './common'
export * from './message'
export * from './chatroom'

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
  (await request.post('/api/userInfo')).data

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

export const getContactList = async (): Promise<Result<Contact[]>> =>
  (await request.post('/api/getContactList')).data
