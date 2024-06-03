import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { ContactTag } from '@/store/contact-tag'
import { useContact } from '@/composables/useContact'
import { useContactTagStore } from '@/store/contact-tag'

export const useContactTag = () => {
  const store = useContactTagStore()

  const { contactTags } = storeToRefs(store)
  const { addContactTag, editContactTag, removeContactTag } = store
  const { contactData, contactMapping } = useContact()

  const contactTagsData = computed(() => {
    return contactTags.value.map((tag: ContactTag) => ({
      ...tag,
      wx_ids: tag.wx_ids.map(id => contactMapping.value[id])
    }))
  })

  return {
    contactData,
    contactTagsData,

    addContactTag,
    editContactTag,
    removeContactTag
  }
}
