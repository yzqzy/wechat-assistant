import { DatabaseMsg } from '@/typings'
import convert from 'xml-js'

const { ipcRenderer } = window

export const msgBytesExtraParser = (bytesExtra: string) => {
  return new Promise<any>(resolve => {
    ipcRenderer.invoke('msg-parser', bytesExtra).then(data => {
      resolve((data && JSON.parse(data)) || {})
    })
  })
}

const decodeDat = (filePath: string, basePath: string) => {
  return new Promise<any>(resolve => {
    ipcRenderer.invoke('decode-dat', filePath, basePath).then(resolve)
  })
}

const getEmoji = (data: string, basePath: string, thumb: boolean) => {
  return new Promise<any>(resolve => {
    ipcRenderer.invoke('get-emoji', data, basePath, thumb).then(resolve)
  })
}

export const getWxidByBytesExtra = (data: any) => {
  data = data && data.message2
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.field1 !== 1) continue
      return item.field2
    }
  }
  return null
}

const normalizedContentImage = (message: DatabaseMsg) => {
  const { content, bytesExtra } = message
  for (const item of bytesExtra.message2) {
    if (item.field1 != 4) continue
    let pathh = item.field2
    pathh = pathh.split('\\').slice(1).join('\\')
    return pathh
  }
  return content
}

export const getImagePath = (message: DatabaseMsg, dataSavePath: string) => {
  const pathh = normalizedContentImage(message)
  const absPath = `${dataSavePath}${pathh}`
  const outPath = `${dataSavePath}Decode\\image`
  return decodeDat(absPath, outPath)
}

const normalizedEmoji = async (content: string) => {
  try {
    const convertData = convert.xml2json(content, { compact: true, spaces: 4 })
    const tempData = JSON.parse(convertData)
    const data = Object.keys(tempData.msg).reduce((pre, key) => {
      let item = tempData.msg[key]
      if (item['_attributes']) item = item['_attributes']
      pre[key] = item
      return pre
    }, {} as any)
    const { md5, cdnurl, thumburl, androidmd5, width, height } =
      data.emoji || {}
    return {
      width,
      height,
      cdnurl,
      thumburl: thumburl || cdnurl,
      md5: md5 || androidmd5
    }
  } catch (error) {
    return null
  }
}

export const getEmojiPath = async (
  content: string,
  dataSavePath: string,
  thumb: boolean = true
) => {
  let emoji_info = await normalizedEmoji(content)

  const { cdnurl, thumburl, md5 } = emoji_info || {}

  const url = thumb ? thumburl : cdnurl

  if ((!url || url == '') && md5) {
    // TODO: md5 parse from content
    console.log(emoji_info, content)
    return ''
  }

  const outPath = `${dataSavePath}Decode\\emoji\\`
  const data = await getEmoji(JSON.stringify(emoji_info), outPath, thumb)

  return data
}
