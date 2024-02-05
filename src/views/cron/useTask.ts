import { computed } from 'vue'

import { messageMapping } from '../../api'

import { storeToRefs } from 'pinia'
import { useCronTaskStore, CronTaskHelper, CronTask } from '../../store/task'
import { useContact } from '../../composables/useContact'
import { formatCron } from '../../utils/cron'

export const useTask = () => {
  const store = useCronTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const { contactData, contactMapping } = useContact()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      return {
        ...task,
        type: messageMapping[task.type],
        params: JSON.stringify(task.params),
        receiver_ids: task.receiver_ids
          .map(id => contactMapping.value[id])
          .join('、'),
        cron: formatCron(task.cron)
      }
    })
  })

  const handleAddTask = (task: CronTask) => {
    CronTaskHelper.start(task)
    addTask(task)
  }

  const handleRemoveTask = (index: number) => {
    CronTaskHelper.remove(tasks.value[index])
    removeTask(index)
  }

  const handleEditTask = (index: number, task: CronTask) => {
    CronTaskHelper.stop(task)

    if (task.enabled) {
      CronTaskHelper.start(task)
    }

    editTask(index, task)
  }

  return {
    tasks,
    taskData,
    contactData,

    handleAddTask,
    handleRemoveTask,
    handleEditTask
  }
}
