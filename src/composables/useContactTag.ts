import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { ContactTag, useContactTagStore } from '@/store/contact-tag'
import { useContact } from './useContact'

export function useContactTag() {
  const contactTagStore = useContactTagStore()
  const { data } = storeToRefs(contactTagStore)
  const { add, edit, remove } = contactTagStore

  const { getNamesByWxIds } = useContact()

  const contactTagsMapping = computed(() => {
    return data.value.reduce((acc, cur) => {
      acc[cur.uid] = cur.name
      return acc
    }, {} as Record<string, string>)
  })

  const contactTagsData = computed(() => {
    return data.value.map((tag: ContactTag) => ({
      ...tag,
      wx_ids: getNamesByWxIds(tag.wx_ids)
    }))
  })

  const getWxIdsByTags = (ids: string[]): string[] => {
    const wx_ids = data.value
      .filter(item => ids.includes(item.uid))
      .reduce((acc, cur) => {
        acc.push(...cur.wx_ids)
        return acc
      }, [] as string[])
    return [...new Set(wx_ids)]
  }

  return {
    contactTags: data,
    contactTagsMapping,
    contactTagsData,

    getWxIdsByTags,
    addContactTag: add,
    editContactTag: edit,
    removeContactTag: remove
  }
}
