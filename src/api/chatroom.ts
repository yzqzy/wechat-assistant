import request from '@/utils/request'
import { Result } from './common'

export interface Member {
  account: string
  headImage: string
  nickname: string
  v3: string
  wxid: string
}

// 获取群成员信息
export const getContactProfile = async (wxid: string): Promise<Result<null>> =>
  (await request.post('/api/getContactProfile', { wxid })).data

export interface ChatRoom {
  admin: string
  adminNickname: string
  chatRoomId: string
  memberNickname: string[]
  members: Member[]
}

// 获取指定群成员信息
export const getMembers = async (memberIds: string[]) => {
  const memberData = await Promise.all(
    memberIds.map((member: string) => getContactProfile(member))
  )
  const members = memberData.map((member: Result<Member | null>) => {
    if (member.code === 1) {
      return member.data
    }
    return null
  })
  return members
}

// 获取群聊成员
export const getMemberFromChatRoom = async (
  chatRoomId: string,
  size: number = 10,
  fetch: boolean = true
): Promise<ChatRoom | null> => {
  const { data: response } = await request.post('/api/getMemberFromChatRoom', {
    chatRoomId
  })

  let data = null

  if (response.code === 1) {
    data = response.data
    data.memberNickname = data.memberNickname.split('^G')
    data.members = data.members.includes('^G') ? data.members.split('^G') : []

    if (fetch) {
      data.members = [
        ...(await getMembers(data.members.slice(0, size))),
        ...data.members.slice(size)
      ]
    }
  }

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
export const inviteMemberToChatRoom = async (
  chatRoomId: string,
  memberIds: string[]
): Promise<Result<null>> =>
  (
    await request.post('/api/InviteMemberToChatRoom', {
      chatRoomId,
      memberIds: memberIds.join(',')
    })
  ).data

// 删除群聊成员
export const delMemberFromChatRoom = async (
  chatRoomId: string,
  memberIds: string[]
): Promise<Result<null>> =>
  (
    await request.post('/api/delMemberFromChatRoom', {
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
