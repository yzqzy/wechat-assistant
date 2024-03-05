export interface DatabaseChat {
  wxid: string
  order: number
  username: string
  alias: string
  remark: string
  nickname: string
  lastMsg: string
  msgType: number
  msgLocalId: string
  msgStatus: number
  smalllAvatar: string
  bigAvatar: string
  unReadCount: number
  time: Date
}

export interface DatabaseMsg {
  wxid: string
  localId: string
  type: number
  subType: number
  isSender: boolean
  createTime: Date
  content: string
  displayContent: string
  compresssContent: string
  bytesExtra: Record<string, any>
}

export interface DatabaseContact {
  wxid: string
  alias: string
  remark: string
  nickname: string
  smalllAvatar: string
  bigAvatar: string
}

export interface DatabaseMessage extends DatabaseMsg {
  user: DatabaseContact | null
}
