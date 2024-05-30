import { hookSyncMsg, unhookSyncMsg, hookSyncMsgList } from '@/api'
import { delaySync } from '@/utils/tools'

const removeAllHooks = async () => {
  const response = await hookSyncMsgList()

  if (response && response.error_code === 10000) {
    const list = response.data.data

    for (const item of list) {
      await unhookSyncMsg(item.cookie)
    }
  }
}

export const useHook = () => {
  const messageHook = async () => {
    // if (
    //   !import.meta.env.VITE_HOOK_MESSAGE_ENABLE ||
    //   import.meta.env.VITE_HOOK_MESSAGE_ENABLE != 1
    // )
    //   return
    // await delaySync()
    // await removeAllHooks()
    // await delaySync()
    // await hookSyncMsg({
    //   host: import.meta.env.VITE_TCP_SERVER_HOST || '127.0.0.1',
    //   port: Number(import.meta.env.VITE_TCP_SERVER_PORT) || 19099
    // })
  }
  return {
    messageHook
  }
}
