import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { messageMapping } from '@/api'
import { useCronTaskStore } from '@/store/cron-task'
import { useContact } from '@/composables/useContact'
import { useContactTag } from '@/composables/useContactTag'
import { formatCron } from '@/utils/cron'

export const useTask = () => {
  const taskStore = useCronTaskStore()
  const { tasks } = storeToRefs(taskStore)
  const { addTask, editTask, removeTask } = taskStore

  const { contactData, getNamesByWxIds } = useContact()
  const { contactTags, getWxIdsByTags } = useContactTag()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      const isReceiverGroup = task.receiver_mode === 'group'
      return {
        ...task,
        mode: task.mode === 'normal' ? '普通模式' : '自定义模式',
        type: messageMapping[task.type],
        params: JSON.stringify(task.params),
        receiver_mode: isReceiverGroup ? '分组模式' : '普通模式',
        receiver_ids: isReceiverGroup
          ? getNamesByWxIds(getWxIdsByTags(task.receiver_tags))
          : getNamesByWxIds(task.receiver_ids),
        cron: formatCron(task.cron)
      }
    })
  })

  return {
    tasks,
    taskData,

    contactData,
    contactTagsData: contactTags,

    handleAddTask: addTask,
    handleRemoveTask: removeTask,
    handleEditTask: editTask
  }
}
