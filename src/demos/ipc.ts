import { storeToRefs } from 'pinia'

import { Task } from '../store/task'
import { useUserStore } from '../store/user'
import { useMessage } from '../composables/useMessage'

const { sendMsgBatch } = useMessage()

window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

window.ipcRenderer.on('main-process-cron-message', (_event, ...args) => {
  const store = useUserStore()
  const { isLoggedIn } = storeToRefs(store)

  console.log('[Is Logged In]:', isLoggedIn.value)
  console.log('[Receive Main-process corn message]:', ...args)

  if (!isLoggedIn.value) return

  const task = args[0] as Task

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
})
