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

    let data = Buffer.from('')

    socket.on('data', chunk => {
      data = Buffer.concat([data, chunk])
    })

    socket.on('end', () => {
      const decodedData = data.toString('utf8')
      console.log(`[tcp-server]: received data: ${decodedData}`)
      win?.webContents.send('main-process-realtime-message', decodedData)
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
