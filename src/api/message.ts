import request from '@/utils/request'
import { Result } from '@/typings'

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}

export const messageMapping = {
  [MessageType.TEXT]: '文本消息',
  [MessageType.IMAGE]: '图片消息',
  [MessageType.FILE]: '文件消息'
}

// 发送文本消息
export const sendTextMsg = async (
  wxid: string,
  msg: string
): Promise<Result<null>> =>
  (
    await request.post('/api/', {
      type: 10009,
      userName: wxid,
      msgContent: msg
    })
  ).data

// 发送 @ 文本消息
export const sendAtTextMsg = async (
  chatRoomId: string,
  wxids: string[],
  msg: string
): Promise<Result<null>> =>
  (
    await request.post('/api/', {
      type: 10009,
      userName: chatRoomId,
      msgContent: msg,
      atUserList: wxids.join(',')
    })
  ).data

// 发送图片消息
export const sendImagesMsg = async (
  wxid: string,
  imagePath: string
): Promise<Result<null>> =>
  (
    await request.post('/api/', {
      type: 10010,
      userName: wxid,
      filePath: imagePath
    })
  ).data

// 发送文件消息
export const sendFileMsg = async (
  wxid: string,
  filePath: string
): Promise<Result<null>> =>
  (
    await request.post('/api/', {
      type: 10012,
      userName: wxid,
      filePath
    })
  ).data
