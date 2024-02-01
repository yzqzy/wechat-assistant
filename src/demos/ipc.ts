import { useMessage } from '../composables/useMessage'
import { Task } from '../store/task'

const { sendMsgBatch } = useMessage()

window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

window.ipcRenderer.on('main-process-cron-message', (_event, ...args) => {
  console.log('[Receive Main-process corn message]:', ...args)

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
