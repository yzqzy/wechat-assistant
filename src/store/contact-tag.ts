import { defineStore } from 'pinia'

import { Store } from '@/utils/store'

export interface ContactTag {
  uid: string
  name: string
  wx_ids: string[]
  remark: string
  enabled: boolean
}

export const useContactTagStore = defineStore('contact-tag', function () {
  const CONTACT_TAG_SAVED_KEY = 'contact-tags'
  const store = new Store<ContactTag>(CONTACT_TAG_SAVED_KEY)
  const { data, add, remove, edit } = store

  return {
    contactTags: data,
    addContactTag: add,
    editContactTag: edit,
    removeContactTag: remove
  }
})
