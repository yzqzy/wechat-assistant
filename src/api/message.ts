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
