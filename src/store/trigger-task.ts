import _ from 'lodash'
import { defineStore } from 'pinia'
import { Store } from '@/utils/store'
import { computed } from 'vue'
import { SelectMode } from '@/typings'

export enum TriggerTaskType {
  FORWARD = 'forward',
  TEXT = 'text',
  RED_PACKET = 'red_packet',
  PREVENT_REVOCATION = 'prevent_revocation'
}

export const triggerMapping = {
  [TriggerTaskType.TEXT]: '文本消息',
  [TriggerTaskType.RED_PACKET]: '红包监控',
  [TriggerTaskType.PREVENT_REVOCATION]: '消息防撤回',
  [TriggerTaskType.FORWARD]: '消息转发'
}

export interface TriggerTask {
  uid: string
  type: TriggerTaskType
  name: string
  observer_ids: string[]
  receiver_mode: SelectMode
  receiver_ids: string[]
  receiver_tags: string[]
  enabled: boolean
  keyword?: string
  params: any
}

export const useTriggerTaskStore = defineStore('trigger_task', function () {
  const TRIGGER_SAVED_TASKS_KEY = 'trigger_tasks'
  const store = new Store<TriggerTask>(TRIGGER_SAVED_TASKS_KEY)
  const { data: tasks, add, edit, remove } = store

  const enabledTasks = computed(() => {
    return tasks.value.filter(task => task.enabled)
  })

  const subs = computed(() => {
    return new Set(
      enabledTasks.value.map(task => task.observer_ids).flat(Infinity)
    )
  })
  const findTaskBySub = (id: string) => {
    const task = enabledTasks.value.filter(task =>
      task.observer_ids.includes(id)
    )
    return task ? _.cloneDeep(task) : null
  }

  return {
    subs,
    tasks,

    addTask: add,
    editTask: edit,
    removeTask: remove,
    findTaskBySub
  }
})
