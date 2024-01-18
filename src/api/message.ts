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
