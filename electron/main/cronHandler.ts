import { BrowserWindow, ipcMain } from 'electron'
import ElectronStore from 'electron-store'
import { CronJob } from 'cron'

let win: BrowserWindow | null = null

const SAVED_TASKS_KEY = 'cron_tasks'
const taskMap = new Map()

const createTask = (task: any) => {
  const { uid, cron, enabled } = task

  console.log(`[corn job]: ${uid} loaded with cron ${cron}, ${enabled}`)

  const job = CronJob.from({
    cronTime: cron,
    onTick: () => {
      console.log(`[corn job]: ${uid} triggered`)
      win?.webContents.send('main-process-cron-message', task)
    },
    timeZone: 'Asia/Shanghai'
  })

  if (enabled) {
    job.start()
    console.log(`[corn job]: ${uid} starting`)
  }

  taskMap.set(uid, job)
}

const bindEvents = () => {
  ipcMain.on('start-cron-task', (_, task) => {
    task = JSON.parse(task)

    const { uid } = task
    const job = taskMap.get(uid)

    if (job) {
      job.start()
      console.log(`[corn job]: ${uid} restarted`)
      return
    }

    createTask(task)
  })
  ipcMain.on('stop-cron-task', (_, task) => {
    const { uid } = JSON.parse(task)
    const job = taskMap.get(uid)

    if (!job) return

    job.stop()
    taskMap.delete(uid)

    console.log(`[corn job]: ${uid} stopped`)
  })
  ipcMain.on('remove-cron-task', (_, task) => {
    const { uid } = JSON.parse(task)
    const job = taskMap.get(uid)

    if (!job) return

    job.stop()
    taskMap.delete(uid)

    console.log(`[corn job]: ${uid} removed`)
  })
}

bindEvents()

export function cronHandler(window: BrowserWindow, store: ElectronStore) {
  win = window

  const tasks = store.get(SAVED_TASKS_KEY, '[]') as string
  const savedTasks = JSON.parse(tasks)

  if (Array.isArray(savedTasks)) {
    savedTasks.forEach(createTask)
  }
}
