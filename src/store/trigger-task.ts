import _ from 'lodash'
import { defineStore } from 'pinia'
import { TaskStore } from '../utils/store'
import { computed } from 'vue'

export enum TriggerTaskType {
  RED_PACKET = 'red_packet',
  PREVENT_REVOCATION = 'prevent_revocation'
}

export const triggerMapping = {
  [TriggerTaskType.RED_PACKET]: '红包监控',
  [TriggerTaskType.PREVENT_REVOCATION]: '消息防撤回'
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
  const store = new TaskStore<TriggerTask>(TRIGGER_SAVED_TASKS_KEY)
  const { tasks, addTask, editTask, removeTask } = store

  const enabledTasks = computed(() => {
    return tasks.value.filter(task => task.enabled)
  })

  const subs = computed(() => {
    return new Set(
      enabledTasks.value
        .filter(task => task.enabled)
        .map(task => task.observer_ids)
        .flat(Infinity)
    )
  })
  const findTaskBySub = (id: string) => {
    const task = tasks.value.filter(task => task.observer_ids.includes(id))
    return task ? _.cloneDeep(task) : null
  }

  return {
    subs,
    tasks,

    addTask,
    editTask,
    removeTask,
    findTaskBySub
  }
})
