import { computed } from 'vue'

import { messageMapping } from '@/api'

import { storeToRefs } from 'pinia'
import { useCronTaskStore } from '@/store/cron-task'
import { useContact } from '@/composables/useContact'
import { formatCron } from '@/utils/cron'

export const useTask = () => {
  const store = useCronTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const { contactData, contactMapping } = useContact()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      return {
        ...task,
        mode: task.mode === 'normal' ? '普通模式' : '自定义模式',
        type: messageMapping[task.type],
        params: JSON.stringify(task.params),
        receiver_ids: task.receiver_ids
          .map(id => contactMapping.value[id])
          .join('、'),
        cron: formatCron(task.cron)
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
