import { LosslessNumber } from 'lossless-json'
import { Robot } from './result'

interface TalkerInfo {
  alias: string
  nickName: string
  smallHeadImgUrl: string
  userName: string
}

export interface RealtimeMessage {
  // pid: string
  // type: LosslessNumber
  // msgId: LosslessNumber
  // msgSequence: LosslessNumber
  // content: string
  // fromUser: string
  // toUser: string
  // createTime: LosslessNumber
  // displayFullContent: string
  content: string
  createTime: LosslessNumber
  extraInfo: string
  isChatroomMsg: number
  isSender: number
  md5: string
  msgSvrId: LosslessNumber
  msgType: LosslessNumber
  talker: string
  talkerInfo: TalkerInfo
  userName: string
}

export interface RealtimeMessageResult {
  data: RealtimeMessage
  pushTime: number
  pushType: number
  robot: Robot
}
