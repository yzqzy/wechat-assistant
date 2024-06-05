import { storeToRefs } from 'pinia'
import { IpcRendererEvent } from 'electron'

import { useMessage } from '@/composables/useMessage'
import { useContactTag } from '@/composables/useContactTag'
import { useUserStore } from '@/store/user'
import { CronTask } from '@/store/cron-task'

const { sendMsgBatch } = useMessage()

const getWxIds = (task: CronTask) => {
  if (!task) return []

  let wx_ids: string[] = []

  const { getWxIdsByTags } = useContactTag()

  if (task.receiver_mode === 'group') {
    wx_ids = getWxIdsByTags(task.receiver_tags)
  } else {
    wx_ids = task.receiver_ids
  }

  return wx_ids
}

// cron message handler
const messageHandler = (task: CronTask) => {
  if (!task) return

  const wx_ids = getWxIds(task)

  // Send message to receiver
  sendMsgBatch(wx_ids, { mode: task.type, ...task.params })

  console.log('[Send Msg Batch]:', wx_ids.join('、'), task.type, task.params)
}

export const cronMsgParser = (_event: IpcRendererEvent, ...args: any[]) => {
  const store = useUserStore()
  const { isLoggedIn } = storeToRefs(store)

  console.log('[Is Logged In]:', isLoggedIn.value)
  console.log('[Receive Main-process corn message]:', ...args)

  if (!isLoggedIn.value) return

  const task = args[0] as CronTask
  messageHandler(task)
}
