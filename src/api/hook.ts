import request from '@/utils/request'
import { Result } from '@/typings'

export interface Hook {
  cookie: string
  desc: string
  status: number
}

interface HookResult {
  data: Hook[]
  message: string
  status: number
}

// hook 消息
export const hookSyncMsg = async ({
  host,
  port
}: {
  host: string
  port: number
}): Promise<Result<Hook>> =>
  (
    await request.post('/api/', {
      type: 1001,
      url: `http://${host}:${port}/api/recv_msg`,
      protocol: 2
    })
  ).data

// 取消 hook 消息
export const unhookSyncMsg = async (cookie: string): Promise<Result<Hook>> =>
  (
    await request.post('/api/', {
      type: 1002,
      cookie
    })
  ).data

// hook 消息列表
export const hookSyncMsgList = async (): Promise<Result<HookResult>> =>
  (
    await request.post('/api/', {
      type: 1003
    })
  ).data
