import fs from 'node:fs'
import path from 'node:path'

import { downloadEmoji, downloadFile } from './download'

const image_format = ['.png', '.gif', '.jpeg']

export const getEmoji = (data: any, outPath: string, thumb = true) => {
  if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true })

  data = typeof data === 'string' ? JSON.parse(data) : data

  const { md5, thumburl, cdnurl } = data

  for (const f of image_format) {
    const perfix = thumb ? 'th_' : ''
    const filePath = path.join(outPath, `${perfix}${md5}${f}`)
    if (fs.existsSync(filePath)) return filePath
  }

  let url = thumb ? thumburl : cdnurl

  try {
    if (!url || url === '') {
      console.log('[get emoji]: No emoji found')
      throw new Error('No emoji found')
    }

    if (typeof url === 'string' && url !== '') {
      const emoji_path = downloadEmoji(url, outPath, md5, thumb)
      return emoji_path
    }

    if (typeof url === 'object' && url instanceof Buffer) {
      const emoji_path = downloadFile(url, outPath, md5, thumb)
      return emoji_path
    }
  } catch (error) {
    console.log('[get emoji]:', error)
    return '404'
  }
}
