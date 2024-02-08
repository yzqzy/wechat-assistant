import { IpcRendererEvent } from 'electron'
import { storeToRefs } from 'pinia'
import { parse as parseJson } from 'lossless-json'
import { XMLParser } from 'fast-xml-parser'

import {
  useTriggerTaskStore,
  TriggerTask,
  TriggerTaskType
} from '../../store/trigger-task'
import { useMessage } from '../../composables/useMessage'
import { useMessageStore } from '../../store/realtime'
import { useContactStore } from '../../store/contact'
import { RealtimeMessage } from '../../typings'
import { MessageType } from '../../api'

const { sendMsgBatch, forwardMsgBatch } = useMessage()

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
  message: RealtimeMessage,
  messages: RealtimeMessage[]
) => {
  if (
    !(
      message.type.value == '10002' &&
      message.content.includes('撤回了一条消息')
    )
  )
    return

  console.log('[Prevent revocation]: message:', message)

  const revocationPrefix = message.content.split('\n')[0]
  const revocationMsg = message.content.split('\n')[1]

  const parser = new XMLParser()
  const xml = parser.parse(revocationMsg) as RevocationMessage
  if (!xml.sysmsg.revokemsg) return
  console.log('[Prevent revocation]: xml:', xml.sysmsg.revokemsg)

  const { newmsgid, replacemsg } = xml.sysmsg.revokemsg

  const oldMsg = messages.find(m => m.msgId.value === newmsgid)
  if (!oldMsg) return

  const originMsgContent = oldMsg.content.replace(`${revocationPrefix}`, '')
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
  if (!(message.type.value == '10000' && message.content.includes('收到红包')))
    return

  const contactStore = useContactStore()
  const { contactMapping } = storeToRefs(contactStore)

  console.log('[Red packet]: message:', message)
  console.log('[Red packet]: task:', task.uid, task.name)

  const newMsg = `"${
    contactMapping.value[message.fromUser]
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
  if (message.type.value !== '1') return

  console.log('[Receive Realtime message]: text:', message)

  const content = message.content.split('\n')[1]

  console.log('[Receive Realtime message]: content:', content)

  const contactStore = useContactStore()
  const { contactMapping } = storeToRefs(contactStore)

  const newMsg = `来自"${
    contactMapping.value[message.fromUser]
  }"的消息 :\n\n${content}`

  console.log('[Receive Realtime message]: task:', task.uid, task.name)

  // Send message to receiver
  sendMsgBatch(task.receiver_ids, {
    mode: MessageType.TEXT,
    message: newMsg
  })
}

// Forward message
const forwardMessageHandler = async (
  task: TriggerTask,
  message: RealtimeMessage
) => {
  console.log('[Receive Realtime message]: forward:', message)
  console.log('[Receive Realtime message]: task:', task.uid, task.name)

  // Forward message to receiver
  forwardMsgBatch(task.receiver_ids, message.msgId.value)
}

// realtime message handler
const messageParser = (message: RealtimeMessage) => {
  const messageStore = useMessageStore()
  const { messages } = storeToRefs(messageStore)

  const triggerTaskStore = useTriggerTaskStore()
  const { subs } = storeToRefs(triggerTaskStore)
  const { findTaskBySub } = triggerTaskStore

  if (subs.value.has(message.fromUser)) {
    const tasks = findTaskBySub(message.fromUser)

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
          preventRevocationHandler(task, message, messages.value)
          break
        case TriggerTaskType.RED_PACKET:
          console.log('[Receive Realtime message]: red packet')
          redPacketHandler(task, message)
          break
        case TriggerTaskType.FORWARD:
          console.log('[Receive Realtime message]: forward')
          forwardMessageHandler(task, message)
          break
      }
    })

    messageStore.addMessage(message)
  }
}

export const realtimeMsgParser = (_event: IpcRendererEvent, ...args: any[]) => {
  console.log(
    '[Receive Main-process realtime message]: -----------------------------------------------------------'
  )
  try {
    messageParser(parseJson(args[0]) as RealtimeMessage)
  } catch (error) {
    console.error('[Receive Main-process realtime message]:', error)
  }
}
