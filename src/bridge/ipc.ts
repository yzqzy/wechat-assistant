import { storeToRefs } from 'pinia'

import { CronTask } from '../store/task'
import { useUserStore } from '../store/user'
import { useMessage } from '../composables/useMessage'
import { RealtimeMessage } from '../typings'

const { sendMsgBatch } = useMessage()

// Cron message handler
const cronMessageHandler = (task: CronTask) => {
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

// Realtime message handler
const realtimeMessageHandler = (message: RealtimeMessage) => {
  console.log(message)
}

const bindEvents = () => {
  // dispatch message
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
  })

  // dispatch realtime message
  window.ipcRenderer.on('main-process-realtime-message', (_event, ...args) => {
    console.log(
      '[Receive Main-process realtime message]: -----------------------------------------------------------'
    )
    console.log('[Receive Main-process realtime message]:', ...args)
    const message = JSON.parse(args[0]) as RealtimeMessage
    realtimeMessageHandler(message)
  })

  // dispatch cron message
  window.ipcRenderer.on('main-process-cron-message', (_event, ...args) => {
    const store = useUserStore()
    const { isLoggedIn } = storeToRefs(store)

    console.log('[Is Logged In]:', isLoggedIn.value)
    console.log('[Receive Main-process corn message]:', ...args)

    if (!isLoggedIn.value) return

    const task = args[0] as CronTask
    cronMessageHandler(task)
  })
}

bindEvents()
