import { computed, onMounted, ref } from 'vue'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'

import { Contact, getContactList, messageMapping } from '../../api'

import { storeToRefs } from 'pinia'
import { useTaskStore, Task } from '../../store/task'

const CronTask = {
  start: (task: Task) => {
    window.ipcRenderer.send('start-cron-task', JSON.stringify(task))
  },
  stop: (task: Task) => {
    window.ipcRenderer.send('stop-cron-task', JSON.stringify(task))
  },
  remove: (task: Task) => {
    window.ipcRenderer.send('remove-cron-task', JSON.stringify(task))
  }
}

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

  const handleAddTask = (task: Task) => {
    CronTask.start(task)
    addTask(task)
  }

  const handleRemoveTask = (index: number) => {
    CronTask.remove(tasks.value[index])
    removeTask(index)
  }

  const handleEditTask = (index: number, task: Task) => {
    CronTask.stop(task)

    if (task.enabled) {
      CronTask.start(task)
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
