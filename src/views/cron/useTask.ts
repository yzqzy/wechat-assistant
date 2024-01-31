import { computed, onMounted, ref } from 'vue'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'

import { Contact, getContactList, messageMapping } from '../../api'

import { storeToRefs } from 'pinia'
import { useTaskStore } from '../../store/task'

export const useTask = () => {
  const store = useTaskStore()

  const { tasks } = storeToRefs(store)
  const { addTask, editTask, removeTask } = store

  const contactData = ref<Contact[]>([])
  const contactMapping = computed(() => {
    return contactData.value.reduce((acc, cur) => {
      acc[cur.wxid] = cur.nickname
      return acc
    }, {} as Record<string, string>)
  })

  const taskData = computed(() => {
    return tasks.value.map(task => {
      return {
        __origin__: { ...task },
        ...task,
        type: messageMapping[task.type],
        params: JSON.stringify(task.params),
        receiver_ids: task.receiver_ids
          .map(id => contactMapping.value[id])
          .join('、'),
        cron: cronstrue.toString(task.cron, {
          use24HourTimeFormat: true,
          verbose: true,
          locale: 'zh_CN'
        })
      }
    })
  })

  const fetchData = () => {
    getContactList().then(res => {
      contactData.value = res.data
    })
  }

  onMounted(() => {
    fetchData()
  })

  return {
    tasks,
    taskData,
    contactData,
    addTask,
    removeTask,
    editTask
  }
}
