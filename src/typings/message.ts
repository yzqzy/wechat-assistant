import { LosslessNumber } from 'lossless-json'
import { Robot } from './result'

interface TalkerInfo {
  alias: string
  nickName: string
  smallHeadImgUrl: string
  userName: string
}

interface RevokedMsg {
  StrContent: string
  StrTalker: string
  Type: string
}

export interface RealtimeMessage {
  content: string
  createTime: LosslessNumber
  extraInfo: string
  isChatroomMsg: number
  isSender: number
  md5: string
  msgSvrId: LosslessNumber
  msgType: LosslessNumber
  type: LosslessNumber
  talker: string
  talkerInfo: TalkerInfo
  userName: string
  from: string
  to: string
  revokedMsg?: RevokedMsg
}

export interface RealtimeMessageResult {
  data: RealtimeMessage
  pushTime: number
  pushType: number
  robot: Robot
}
