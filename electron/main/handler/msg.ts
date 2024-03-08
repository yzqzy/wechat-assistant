import { ipcMain } from 'electron'

import { msgBytesExtraParser } from '../utils/protobuf'
import { decodeDat } from '../utils/decode'
import { getEmoji } from '../utils/emoji'

const bindEvents = () => {
  ipcMain.handle('msg-parser', (_, extra) =>
    JSON.stringify(msgBytesExtraParser(extra))
  )
  ipcMain.handle('decode-dat', (_, filePath, basePath) =>
    decodeDat(filePath, basePath)
  )
  ipcMain.handle('get-emoji', (_, data, basePath, thumb) =>
    getEmoji(data, basePath, thumb)
  )
}

bindEvents()
