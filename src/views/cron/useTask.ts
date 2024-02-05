import { computed, onMounted, ref } from 'vue'

import { Contact, getContactList, messageMapping } from '../../api'

import { storeToRefs } from 'pinia'
import { useCronTaskStore, CronTaskHelper, CronTask } from '../../store/task'
import { formatCron } from '../../utils/tools'

export const useTask = () => {
  const store = useCronTaskStore()

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

  const fetchData = () => {
    getContactList().then(res => {
      contactData.value = res.data
    })
  }

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

  onMounted(() => {
    fetchData()
  })

  return {
    tasks,
    taskData,
    contactData,

    handleAddTask,
    handleRemoveTask,
    handleEditTask
  }
}
