import { cronMsgParser } from './handler/corn'
import { realtimeMsgParser } from './handler/realtime'

const bindEvents = () => {
  // dispatch message
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
  })

  // dispatch realtime message
  window.ipcRenderer.on('main-process-realtime-message', realtimeMsgParser)

  // dispatch cron message
  window.ipcRenderer.on('main-process-cron-message', cronMsgParser)
}

bindEvents()
