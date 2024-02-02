import { hookSyncMsg, unhookSyncMsg } from '../api'

export const useHook = () => {
  const messageHook = async () => {
    if (
      !import.meta.env.VITE_HOOK_MESSAGE_ENABLE ||
      import.meta.env.VITE_HOOK_MESSAGE_ENABLE != 1
    )
      return

    await unhookSyncMsg()
    await hookSyncMsg({
      ip: import.meta.env.VITE_TCP_SERVER_HOST || '127.0.0.1',
      port: import.meta.env.VITE_TCP_SERVER_PORT || '19099'
    })
  }
  return {
    messageHook
  }
}
