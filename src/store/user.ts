import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { UserInfo } from '../api/index'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => userInfo.value !== null)

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  return {
    userInfo,
    isLoggedIn,

    setUserInfo
  }
})
