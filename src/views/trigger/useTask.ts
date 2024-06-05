import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useTriggerTaskStore, triggerMapping } from '@/store/trigger-task'
import { useContact } from '@/composables/useContact'
import { useContactTag } from '@/composables/useContactTag'

export const useTask = () => {
  const store = useTriggerTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const { contactData, getNamesByWxIds } = useContact()
  const { contactTags, getWxIdsByTags } = useContactTag()

  const taskData = computed(() => {
    return tasks.value.map(task => {
      const isReceiverGroup = task.receiver_mode === 'group'
      return {
        ...task,
        type: triggerMapping[task.type],
        params: JSON.stringify(task.params),
        observer_ids: getNamesByWxIds(task.observer_ids),
        receiver_mode: isReceiverGroup ? '分组模式' : '普通模式',
        receiver_ids: isReceiverGroup
          ? getNamesByWxIds(getWxIdsByTags(task.receiver_tags))
          : getNamesByWxIds(task.receiver_ids)
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
