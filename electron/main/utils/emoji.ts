import fs from 'node:fs'
import path from 'node:path'

import { downloadEmoji, downloadFile } from './download'

const image_format = ['.png', '.gif', '.jpeg']

export const getEmoji = async (data: any, outPath: string, thumb = true) => {
  if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true })

  data = typeof data === 'string' ? JSON.parse(data) : data

  const { md5, thumburl, cdnurl } = data

  for (const f of image_format) {
    const perfix = thumb ? 'th_' : ''
    const filePath = path.join(outPath, `${perfix}${md5}${f}`)
    if (fs.existsSync(filePath)) return filePath
  }

  console.log(
    '[emoji]:',
    '-----------------------------------------------------------'
  )

  console.log('[emoji]: origin:', data)

  let url = thumb ? thumburl : cdnurl

  console.log('[emoji]: params:', thumb, thumburl, cdnurl)

  try {
    if (!url || url === '') {
      console.log('[emoji]: No emoji found')
      throw new Error('No emoji found')
    }

    if (typeof url === 'string' && url !== '') {
      const emoji_path = await downloadEmoji(url, outPath, md5, thumb)
      console.log('[emoji]: string:', emoji_path)
      return emoji_path
    }

    if (typeof url === 'object' && url instanceof Buffer) {
      const emoji_path = await downloadFile(url, outPath, md5, thumb)
      console.log('[emoji]: object:', emoji_path)
      return emoji_path
    }
  } catch (error) {
    console.log('[emoji]: error:', error)
    return '404'
  }
}
