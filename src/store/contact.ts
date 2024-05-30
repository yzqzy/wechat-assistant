import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Contact } from '@/api'

export const useContactStore = defineStore('contact', function () {
  const contactData = ref<Contact[]>([])

  const contactMapping = computed(() => {
    return contactData.value.reduce((acc, cur) => {
      acc[cur.UserName] = cur.NickName
      return acc
    }, {} as Record<string, string>)
  })

  const addContactData = (data: Contact[]) => {
    contactData.value = data
  }

  return {
    contactData,
    contactMapping,

    addContactData
  }
})
