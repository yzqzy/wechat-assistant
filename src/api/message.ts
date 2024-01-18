import request from '../utils/request'
import { Result } from './common'

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
