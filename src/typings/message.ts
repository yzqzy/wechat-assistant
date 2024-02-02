export interface RealtimeMessage {
  pid: string
  type: string
  msgId: number
  msgSequence: number
  content: string
  fromUser: string
  toUser: string
  createTime: number
  displayFullContent: string
}
