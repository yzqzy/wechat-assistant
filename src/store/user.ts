import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { UserInfo } from '../api/index'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => userInfo.value !== null)

  const dataSavePath = computed(() => {
    return userInfo.value?.dataSavePath || ''
  })

  const addUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  return {
    userInfo,
    isLoggedIn,
    dataSavePath,

    addUserInfo
  }
})
