import { ipcMain } from 'electron'

import { decodeDat } from '../utils/decode'
import { msgBytesExtraParser } from '../utils/protobuf'

const bindEvents = () => {
  ipcMain.handle('msg-parser', (_, extra) =>
    JSON.stringify(msgBytesExtraParser(extra))
  )
  ipcMain.handle('decode-dat', (_, filePath, basePath) =>
    decodeDat(filePath, basePath)
  )
}

bindEvents()
