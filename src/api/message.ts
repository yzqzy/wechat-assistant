import request from '../utils/request'
import { Result } from './common'

// 拍一拍
export const sendPatMsg = async (
  wxid: string,
  receiver: string
): Promise<Result<null>> =>
  (
    await request.post('/api/sendPatMsg', {
      wxid,
      receiver
    })
  ).data

// 发送文本消息
export const sendTextMsg = async (
  wxid: string,
  msg: string
): Promise<Result<null>> =>
  (
    await request.post('/api/sendTextMsg', {
      wxid,
      msg
    })
  ).data

// 发送 @ 文本消息
export const sendAtTextMsg = async (
  chatRoomId: string,
  wxids: string[],
  msg: string
): Promise<Result<null>> =>
  (
    await request.post('/api/sendAtText', {
      wxids: wxids.join(','),
      chatRoomId,
      msg
    })
  ).data

// 发送图片消息
export const sendImagesMsg = async (
  wxid: string,
  imagePath: string
): Promise<Result<null>> =>
  (
    await request.post('/api/sendImagesMsg', {
      wxid,
      imagePath
    })
  ).data

// 发送文件消息
export const sendFileMsg = async (
  wxid: string,
  filePath: string
): Promise<Result<null>> =>
  (
    await request.post('/api/sendFileMsg', {
      wxid,
      filePath
    })
  ).data

interface ForwardPublicMsgParams {
  wxid: string
  appName?: string
  userName?: string
  title: string
  url: string
  thumbUrl: string
  digest: string
}

// 发送公众号文章消息
export const forwardPublicMsg = async ({
  appName = '',
  userName = '',
  ...args
}: ForwardPublicMsgParams): Promise<Result<null>> =>
  (
    await request.post('/api/forwardPublicMsg', {
      appName,
      userName,
      ...args
    })
  ).data
