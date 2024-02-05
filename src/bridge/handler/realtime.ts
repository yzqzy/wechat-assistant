import { IpcRendererEvent } from 'electron'
import { storeToRefs } from 'pinia'
import { parse as parseJson } from 'lossless-json'
import { XMLParser } from 'fast-xml-parser'

import {
  useTriggerTaskStore,
  TriggerTask,
  TriggerTaskType
} from '../../store/trigger-task'
import { useMessageStore } from '../../store/realtime'
import { useMessage } from '../../composables/useMessage'
import { RealtimeMessage } from '../../typings'
import { MessageType } from '../../api'

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
  const newMsg = `${replacemsg}: ${originMsgContent}`

  console.log('[Prevent revocation]: task:', task.uid, task.name)

  // Send message to receiver
  sendMsgBatch(task.receiver_ids, {
    mode: MessageType.TEXT,
    message: newMsg
  })
}

// Red packet
const redPacketHandler = (task: TriggerTask) => {
  // TODO: implement red packet
  console.log('[Red packet]')
}

// realtime message handler
const messageParser = (message: RealtimeMessage) => {
  const messageStore = useMessageStore()
  const { messages } = storeToRefs(messageStore)

  const triggerTaskStore = useTriggerTaskStore()
  const { subs } = storeToRefs(triggerTaskStore)
  const { findTaskBySub } = triggerTaskStore

  if (subs.value.has(message.fromUser)) {
    const task = findTaskBySub(message.fromUser)

    if (!task) return

    switch (task.type) {
      case TriggerTaskType.PREVENT_REVOCATION:
        console.log('[Receive Realtime message]: prevent revocation')
        preventRevocationHandler(task, message, messages.value)
        break
      case TriggerTaskType.RED_PACKET:
        console.log('[Receive Realtime message]: red packet')
        redPacketHandler(task)
        break
    }

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
