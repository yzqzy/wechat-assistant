import { ElMessage } from 'element-plus'

import {
  MessageType,
  forwardPublicMsg,
  sendAtTextMsg,
  sendFileMsg,
  sendImagesMsg,
  sendTextMsg
} from '../api'
import { delaySync, getRandomInt } from '../utils/tools'

interface ExtendedParams {
  isAt: boolean
  atWxIds: string[]
}

export const useMessage = () => {
  const sendMsg = async (wxid: string, data: any, args?: ExtendedParams) => {
    const { isAt, atWxIds } = args || {}

    let res: any

    if (data.mode === MessageType.TEXT) {
      if (isAt && atWxIds) {
        res = await sendAtTextMsg(wxid, atWxIds, data.message)
      } else {
        res = await sendTextMsg(wxid, data.message)
      }
    } else if (data.mode === MessageType.IMAGE) {
      res = await sendImagesMsg(wxid, data.image_url)
    } else if (data.mode === MessageType.FILE) {
      res = await sendFileMsg(wxid, data.file_url)
    } else if (data.mode === MessageType.WX_ARTICLE) {
      res = await forwardPublicMsg({
        wxid,
        title: data.title,
        url: data.url,
        thumbUrl: data.thumb_url,
        digest: data.digest
      })
    }

    return res
  }

  const sendMsgBatch = async (
    wx_ids: string[] | undefined,
    data: any,
    args?: ExtendedParams
  ) => {
    if (!wx_ids) return

    let res: any

    while (wx_ids.length) {
      const wxid = wx_ids.shift() as string

      if (wxid) {
        res = await sendMsg(wxid, data, args)
      }

      await delaySync(getRandomInt(3, 8) * 100)
    }

    if (res.code === 1) {
      ElMessage.success('发送成功')
    } else {
      ElMessage.error('发送失败')
    }
  }

  return {
    sendMsg,
    sendMsgBatch
  }
}
