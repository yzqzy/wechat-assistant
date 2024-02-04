import { ref } from 'vue'
import { defineStore } from 'pinia'

import { Store } from '../utils/store'
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

const SAVED_TASKS_KEY = 'cron_tasks'

export const useTaskStore = defineStore('task', function () {
  const cron_store = new Store<CronTask[]>(SAVED_TASKS_KEY)
  const tasks = ref<CronTask[]>([])

  const initialize = () => {
    cron_store.get().then(savedTasks => {
      tasks.value = savedTasks
    })
  }

  const updateStore = () => cron_store.set(tasks.value)

  const addTask = (task: CronTask) => {
    tasks.value.push(task)
    updateStore()
  }

  const editTask = (index: number, task: CronTask) => {
    tasks.value[index] = task
    updateStore()
  }

  const removeTask = (index: number) => {
    tasks.value.splice(index, 1)
    updateStore()
  }

  initialize()

  return {
    tasks,

    addTask,
    editTask,
    removeTask
  }
})
