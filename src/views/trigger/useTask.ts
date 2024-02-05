import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useTriggerTaskStore, triggerMapping } from '../../store/task'
import { useContact } from '../../composables/useContact'

const formatIds = (ids: string[], contactMapping: Record<string, string>) => {
  return ids.map(id => contactMapping[id]).join('、')
}

export const useTask = () => {
  const store = useTriggerTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const { contactData, contactMapping } = useContact()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      return {
        ...task,
        type: triggerMapping[task.type],
        params: JSON.stringify(task.params),
        observer_ids: formatIds(task.observer_ids, contactMapping.value),
        receiver_ids: formatIds(task.receiver_ids, contactMapping.value)
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
