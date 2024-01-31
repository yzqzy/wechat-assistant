import { ref } from 'vue'
import { defineStore } from 'pinia'

import { MessageType } from '../api'

export enum TaskMode {
  CUSTOM = 'custom',
  NORMAL = 'normal'
}

export interface Task {
  uid: string
  mode: TaskMode
  type: MessageType
  name: string
  receiver_ids: number[]
  cron: string
  enable: boolean
  params: any
}

const Store = {
  get: (key: string, defaultValue: Task[]): Promise<Task[]> => {
    return new Promise(resolve => {
      window.ipcRenderer.invoke('get-store-value', key).then(value => {
        resolve((value && JSON.parse(value)) || defaultValue)
      })
    })
  },
  set: (key: string, value: Task[]) => {
    window.ipcRenderer.invoke('set-store-value', key, JSON.stringify(value))
  }
}

const SAVED_TASKS_KEY = 'cron_tasks'

export const useTaskStore = defineStore('task', function () {
  const tasks = ref<Task[]>([])

  const initialize = () => {
    Store.get(SAVED_TASKS_KEY, []).then(savedTasks => {
      tasks.value = savedTasks
    })
  }

  const updateStore = () => {
    Store.set(SAVED_TASKS_KEY, tasks.value)
  }

  const addTask = (task: Task) => {
    tasks.value.push(task)
    updateStore()
  }

  const editTask = (index: number, task: Task) => {
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
