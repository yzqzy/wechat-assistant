import { defineStore } from 'pinia'

import { TaskStore } from '../utils/store'
import { MessageType } from '../api'

export enum CronTaskMode {
  CUSTOM = 'custom',
  NORMAL = 'normal'
}

export interface CronTask {
  uid: string
  mode: CronTaskMode
  type: MessageType
  name: string
  receiver_ids: string[]
  cron: string
  enabled: boolean
  params: any
}

export const CronTaskHelper = {
  start: (task: CronTask) => {
    window.ipcRenderer.send('start-cron-task', JSON.stringify(task))
  },
  stop: (task: CronTask) => {
    window.ipcRenderer.send('stop-cron-task', JSON.stringify(task))
  },
  remove: (task: CronTask) => {
    window.ipcRenderer.send('remove-cron-task', JSON.stringify(task))
  }
}

export const useCronTaskStore = defineStore('cron_task', function () {
  const CRON_SAVED_TASKS_KEY = 'cron_tasks'
  const store = new TaskStore<CronTask>(CRON_SAVED_TASKS_KEY)
  const { tasks, addTask, editTask, removeTask } = store

  return {
    tasks,
    addTask,
    editTask,
    removeTask
  }
})

export enum TriggerTaskType {
  RED_PACKET = 'red_packet',
  PREVENT_REVOCATION = 'prevent_revocation'
}

export interface TriggerTask {
  uid: string
  type: TriggerTaskType
  name: string
  observer_ids: string[]
  receiver_ids: string[]
  enabled: boolean
  params: any
}

export const useTriggerTaskStore = defineStore('trigger_task', function () {
  const TRIGGER_SAVED_TASKS_KEY = 'trigger_tasks'
  const store = new TaskStore<CronTask>(TRIGGER_SAVED_TASKS_KEY)
  const { tasks, addTask, editTask, removeTask } = store

  return {
    tasks,
    addTask,
    editTask,
    removeTask
  }
})
