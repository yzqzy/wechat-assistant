import { BrowserWindow } from 'electron'
import net from 'net'

let win: BrowserWindow | null = null

export const createServer = (window: BrowserWindow) => {
  win = window

  if (
    !import.meta.env.VITE_HOOK_MESSAGE_ENABLE ||
    import.meta.env.VITE_HOOK_MESSAGE_ENABLE != 1
  )
    return

  const server = net.createServer(socket => {
    console.log(
      '[tcp-server]: -----------------------------------------------------------'
    )
    console.log('[tcp-server]: client connected')

    socket.on('data', chunk => {
      const size = chunk.readUInt32BE(0)
      const data = chunk.slice(4).toString('utf8')

      console.log(`[tcp-server]: received size: ${size}`)
      console.log(`[tcp-server]: received data: ${data}`)

      win?.webContents.send('main-process-realtime-message', data)
    })

    socket.on('close', () => {
      console.log('[tcp-server]: client disconnected')
    })
  })

  const port = import.meta.env.VITE_TCP_SERVER_PORT || '19099'

  server.listen(port, () => {
    console.log(`[tcp-server]: server listening on port ${port}`)
  })

  return server
}
