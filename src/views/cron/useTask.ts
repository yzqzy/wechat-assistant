import { computed, onMounted } from 'vue'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'

import { MessageType, messageMapping } from '../../api'

import { storeToRefs } from 'pinia'
import { useTaskStore, TaskMode } from '../../store/task'

export const useTask = () => {
  const store = useTaskStore()
  const { tasks } = storeToRefs(store)
  const { addTask } = store

  const tableData = computed(() => {
    return tasks.value.map(task => {
      return {
        ...task,
        type: messageMapping[task.type],
        params: JSON.stringify(task.params),
        receiver_ids: task.receiver_ids.join(','),
        cron: cronstrue.toString(task.cron, {
          use24HourTimeFormat: true,
          verbose: true,
          locale: 'zh_CN'
        })
      }
    })
  })

  return { tasks, tableData }
}
