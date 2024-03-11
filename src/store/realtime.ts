import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { RealtimeMessage } from '@/typings'

export const useMessageStore = defineStore('realtime-message', function () {
  const maxQueueSize =
    (import.meta.env.VITE_HOOK_MESSAGE_BATCH_SIZE as number) || 200

  // realtime message queue
  const messages = ref<RealtimeMessage[]>([])

  watchEffect(() => {
    console.log('realtime message queue size:', messages.value.length)
  })

  // add message to queue
  const addMessage = (message: RealtimeMessage) => {
    if (messages.value.length >= maxQueueSize) {
      shiftMessage()
    }
    messages.value.push(message)
  }

  // clear message queue
  const clearMessages = () => {
    messages.value = []
  }

  // shifts the message queue to the left by one
  const shiftMessage = () => {
    messages.value.shift()
  }

  return {
    messages,

    addMessage,
    clearMessages,
    shiftMessage
  }
})
