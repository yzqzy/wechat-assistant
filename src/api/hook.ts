import request from '../utils/request'
import { Result } from './common'

// hook 消息
export const hookSyncMsg = async ({
  ip,
  port
}: {
  ip: string
  port: string
}): Promise<Result<null>> =>
  (
    await request.post('/api/hookSyncMsg', {
      ip,
      port,
      url: '',
      timeout: '3000',
      enableHttp: '0'
    })
  ).data

// 取消 hook 消息
export const unhookSyncMsg = async (): Promise<Result<null>> =>
  (await request.post('/api/unhookSyncMsg')).data
