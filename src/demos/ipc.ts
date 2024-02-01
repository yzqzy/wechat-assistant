window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

window.ipcRenderer.on('main-process-cron-message', (_event, ...args) => {
  console.log('[Receive Main-process corn message]:', ...args)
  // TODO: send message
})
