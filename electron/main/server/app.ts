import { BrowserWindow } from 'electron'
import express from 'express'

let win: BrowserWindow | null = null

export const createServer = (window: BrowserWindow) => {
  win = window

  if (
    !import.meta.env.VITE_HOOK_MESSAGE_ENABLE ||
    import.meta.env.VITE_HOOK_MESSAGE_ENABLE != 1
  )
    return

  const app = express()

  app.use(express.json())

  app.post('/api/recv_msg', (req: any, res: any) => {
    const data = req.body

    console.log(`[http-server]: received data: ${JSON.stringify(data)}`)

    win?.webContents.send('main-process-realtime-message', JSON.stringify(data))

    res.json({ success: 'true' })
  })

  const port = import.meta.env.VITE_HTTP_SERVER_PORT || 3000
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
