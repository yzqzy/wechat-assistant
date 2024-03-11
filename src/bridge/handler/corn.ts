import { storeToRefs } from 'pinia'
import { IpcRendererEvent } from 'electron'

import { useMessage } from '@/composables/useMessage'
import { useUserStore } from '@/store/user'
import { CronTask } from '@/store/cron-task'

const { sendMsgBatch } = useMessage()

// cron message handler
const messageHandler = (task: CronTask) => {
  if (!Array.isArray(task.receiver_ids)) return

  // Send message to receiver
  sendMsgBatch(task.receiver_ids, {
    mode: task.type,
    ...task.params
  })

  console.log(
    '[Send Msg Batch]:',
    task.receiver_ids.join('、'),
    task.type,
    task.params
  )
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
