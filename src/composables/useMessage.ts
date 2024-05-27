import _, { rest } from 'lodash'
import { ElMessage } from 'element-plus'

import {
  MessageType,
  sendAtTextMsg,
  sendFileMsg,
  sendImagesMsg,
  sendTextMsg
} from '@/api'
import { delaySync, getRandomInt } from '@/utils/tools'

interface ExtendedParams {
  isAt?: boolean
  atWxIds?: string[]
  callback?: any
}

const delay = async () => {
  const dalay =
    import.meta.env.VITE_SEND_MESSAGE_BATCH_FREQUENCY ||
    getRandomInt(3, 8) * 100

  await delaySync(dalay)
}

const exec = async (
  wx_ids: string[] | undefined,
  executor: any,
  ...args: any
) => {
  let res: any

  if (!wx_ids || !executor) return

  const tasks = _.cloneDeep(wx_ids)

  while (tasks.length) {
    const taskId = tasks.shift() as string

    if (!taskId) continue

    await delay()

    res = await executor(taskId, ...args)
  }

  return res
}

const sendImages = async (wxid: string, data: any) => {
  let res: any

  data.image_url =
    typeof data.image_url === 'string' ? [data.image_url] : data.image_url

  while (data.image_url.length) {
    const url = data.image_url.shift()

    if (!url) continue

    await delay()

    res = await sendImagesMsg(wxid, url)
  }

  return res
}

const sendFiles = async (wxid: string, data: any) => {
  let res: any

  data.file_url =
    typeof data.file_url === 'string' ? [data.file_url] : data.file_url

  while (data.file_url.length) {
    const url = data.file_url.shift()

    if (!url) continue

    await delay()

    res = await sendFileMsg(wxid, url)
  }

  return res
}

export const useMessage = () => {
  const sendMsg = async (wxid: string, data: any, args?: ExtendedParams) => {
    const { isAt, atWxIds } = args || {}

    let res: any

    if (data.mode === MessageType.TEXT) {
      if (isAt && atWxIds && wxid.includes('@chatroom')) {
        res = await sendAtTextMsg(wxid, atWxIds, data.message)
      } else {
        res = await sendTextMsg(wxid, data.message)
      }
    } else if (data.mode === MessageType.IMAGE) {
      res = await sendImages(wxid, data)
    } else if (data.mode === MessageType.FILE) {
      res = await sendFiles(wxid, data)
    }

    return res
  }

  const sendMsgBatch = async (
    wx_ids: string[] | undefined,
    data: any,
    args?: ExtendedParams
  ) => {
    const { callback, ...restArgs } = args || {}

    const res = await exec(wx_ids, sendMsg, data, restArgs)

    if (callback) {
      return callback(res)
    }

    if (res && res.code >= 1) {
      ElMessage.success('发送成功')
    } else {
      ElMessage.error('发送失败')
    }
  }

  return {
    sendMsgBatch
  }
}
