import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useTriggerTaskStore, triggerMapping } from '@/store/trigger-task'
import { useContact } from '@/composables/useContact'

export const useTask = () => {
  const store = useTriggerTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const { contactData, getNamesByWxIds } = useContact()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      return {
        ...task,
        type: triggerMapping[task.type],
        params: JSON.stringify(task.params),
        observer_ids: getNamesByWxIds(task.observer_ids),
        receiver_ids: getNamesByWxIds(task.receiver_ids)
      }
    })
  })

  return {
    tasks,
    taskData,
    contactData,

    handleAddTask: addTask,
    handleRemoveTask: removeTask,
    handleEditTask: editTask
  }
}
