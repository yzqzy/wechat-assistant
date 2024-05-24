export interface Robot {
  alias: string
  isLogin: boolean
  nickName: string
  pid: string
  port: string
  smallHeadImgUrl: string
  userName: string
}

type ErrorCode = 10000 | 10001 | 10002 | 10003 | 10004 | 0

export interface Result<T> {
  data: T
  description: string
  error_code: ErrorCode
  robot: Robot
}
