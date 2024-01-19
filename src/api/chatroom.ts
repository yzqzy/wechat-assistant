import request from '../utils/request'
import { Result } from './common'

// 获取群聊成员
export const getMemberFromChatRoom = async (
  chatRoomId: string
): Promise<Result<null>> => {
  const { data } = await request.post('/api/getMemberFromChatRoom', {
    chatRoomId
  })
  data.memberNickname = data.memberNickname.split('^G')
  data.members = data.members.split('^G')
  return data
}

// 添加成员到群聊
export const addMemberToChatRoom = async (
  chatRoomId: string,
  memberIds: string[]
): Promise<Result<null>> =>
  (
    await request.post('/api/addMemberToChatRoom', {
      chatRoomId,
      memberIds: memberIds.join(',')
    })
  ).data

// 邀请成员加入群聊(40人以上)
export const InviteMemberToChatRoom = async (
  chatRoomId: string,
  memberIds: string[]
): Promise<Result<null>> =>
  (
    await request.post('/api/InviteMemberToChatRoom', {
      chatRoomId,
      memberIds: memberIds.join(',')
    })
  ).data

// 修改群聊昵称(本人)
export const modifyNickname = async (
  chatRoomId: string,
  wxid: string,
  nickName: string
): Promise<Result<null>> =>
  (
    await request.post('/api/modifyNickname', {
      chatRoomId,
      wxid,
      nickName
    })
  ).data

// 退出群聊
export const quitChatRoom = async (chatRoomId: string): Promise<Result<null>> =>
  (
    await request.post('/api/quitChatRoom', {
      chatRoomId
    })
  ).data
