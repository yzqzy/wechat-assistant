import fs from 'node:fs'
import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

export const downloadFile = async (
  buffer: Buffer,
  dest: string,
  md5: string,
  thumb: boolean
) => {
  const type = await fileTypeFromBuffer(buffer)
  const ext = type?.ext || 'png'
  const outPath = `${dest}${thumb ? 'th_' : ''}${md5}.${ext}`
  fs.writeFileSync(outPath, buffer)
  return outPath
}

export const downloadEmoji = async (
  url: string,
  dest: string,
  md5: string,
  thumb: boolean
) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data)
  return downloadFile(buffer, dest, md5, thumb)
}
