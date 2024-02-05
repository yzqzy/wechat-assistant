import { LosslessNumber } from 'lossless-json'

export interface RealtimeMessage {
  pid: string
  type: LosslessNumber
  msgId: LosslessNumber
  msgSequence: LosslessNumber
  content: string
  fromUser: string
  toUser: string
  createTime: LosslessNumber
  displayFullContent: string
}
