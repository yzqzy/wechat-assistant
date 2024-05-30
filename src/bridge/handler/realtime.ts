import { IpcRendererEvent } from 'electron'
import { storeToRefs } from 'pinia'
import { parse as parseJson } from 'lossless-json'
import { XMLParser } from 'fast-xml-parser'

import {
  useTriggerTaskStore,
  TriggerTask,
  TriggerTaskType
} from '@/store/trigger-task'
import { useMessage } from '@/composables/useMessage'
import { useContactStore } from '@/store/contact'
import { RealtimeMessage, RealtimeMessageResult } from '@/typings'
import { MessageType } from '@/api'

const { sendMsgBatch } = useMessage()

interface RevocationMessage {
  sysmsg: {
    revokemsg: {
      announcement_id: string
      msg_id: string
      newmsgid: string
      replacemsg: string
      session: string
    }
  }
}

// Prevent revocation
const preventRevocationHandler = (
  task: TriggerTask,
  message: RealtimeMessage
) => {
  const type = message.msgType || message.type

  if (!(type.value == '10002' && message.content.includes('撤回了一条消息')))
    return

  console.log('[Prevent revocation]: message:', message)

  const parser = new XMLParser()
  const xml = parser.parse(message.content) as RevocationMessage
  if (!xml.sysmsg.revokemsg) return
  console.log('[Prevent revocation]: xml:', xml.sysmsg.revokemsg)

  const { replacemsg } = xml.sysmsg.revokemsg

  const oldMsg = message.revokedMsg

  console.log(oldMsg)

  if (!oldMsg || (oldMsg && oldMsg.Type !== '1')) return

  const originMsgContent = oldMsg.StrContent
  const newMsg = `${replacemsg} :\n${originMsgContent}`

  console.log('[Prevent revocation]: task:', task.uid, task.name)

  // Send message to receiver
  sendMsgBatch(task.receiver_ids, {
    mode: MessageType.TEXT,
    message: newMsg
  })
}

// Red packet
const redPacketHandler = (task: TriggerTask, message: RealtimeMessage) => {
  const type = message.msgType || message.type

  if (
    !(
      type.value == '10000' &&
      ['发出红包', '收到红包'].some(str => message.content.includes(str))
    )
  )
    return

  const contactStore = useContactStore()
  const { contactMapping } = storeToRefs(contactStore)

  console.log('[Red packet]: message:', message)
  console.log('[Red packet]: task:', task.uid, task.name)

  const newMsg = `"${
    contactMapping.value[message.talker || message.to]
  }" 正在发红包，请速去查看 ！！！`

  // Send message to receiver
  sendMsgBatch(
    task.receiver_ids,
    {
      mode: MessageType.TEXT,
      message: newMsg
    },
    {
      isAt: task.receiver_ids.some(wxid => wxid.includes('@chatroom')),
      atWxIds: ['notify@all']
    }
  )
}

// Text message
const textMessageHandler = (task: TriggerTask, message: RealtimeMessage) => {
  if (message.msgType.value !== '1') return

  console.log('[Receive Realtime message]: text:', message)

  const content = message.content

  if (!task.keyword) {
    console.log('[Receive Realtime message]: no keyword')
    return
  }
  if (task.keyword && !content.includes(task.keyword)) {
    console.log('[Receive Realtime message]: keyword not match')
    return
  }

  console.log('[Receive Realtime message]: content:', content)

  const contactStore = useContactStore()
  const { contactMapping } = storeToRefs(contactStore)

  const newMsg = `来自"${
    contactMapping.value[message.talker]
  }"的消息 :\n\n${content}`

  console.log('[Receive Realtime message]: task:', task.uid, task.name)

  // Send message to receiver
  sendMsgBatch(task.receiver_ids, {
    mode: MessageType.TEXT,
    message: newMsg
  })
}

// realtime message handler
const messageParser = (message: RealtimeMessage) => {
  const triggerTaskStore = useTriggerTaskStore()
  const { subs } = storeToRefs(triggerTaskStore)
  const { findTaskBySub } = triggerTaskStore

  console.log('[Receive Realtime message]: message:', message)
  console.log('[Receive Realtime message]: subs:', subs.value)

  const sign = message.talker || message.to

  if (subs.value.has(sign)) {
    const tasks = findTaskBySub(sign)

    console.log('[Receive Realtime message]: message:', subs, tasks)

    if (!tasks || tasks.length === 0) return

    tasks.forEach(task => {
      switch (task.type) {
        case TriggerTaskType.TEXT:
          console.log('[Receive Realtime message]: text')
          textMessageHandler(task, message)
          break
        case TriggerTaskType.PREVENT_REVOCATION:
          console.log('[Receive Realtime message]: prevent revocation')
          preventRevocationHandler(task, message)
          break
        case TriggerTaskType.RED_PACKET:
          console.log('[Receive Realtime message]: red packet')
          redPacketHandler(task, message)
          break
      }
    })
  }
}

export const realtimeMsgParser = (_event: IpcRendererEvent, ...args: any[]) => {
  console.log(
    '[Receive Main-process realtime message]: -----------------------------------------------------------'
  )
  try {
    const response = parseJson(args[0]) as RealtimeMessageResult
    messageParser(response.data)
  } catch (error) {
    console.error('[Receive Main-process realtime message]:', error)
  }
}
