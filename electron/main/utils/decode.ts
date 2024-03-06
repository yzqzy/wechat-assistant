import fs from 'node:fs'
import path from 'node:path'

/**
 * 图片字节头信息
 * [0][1] jpg 头信息
 * [2][3] png 头信息
 * [4][5] gif 头信息
 */
const picHead = [0xff, 0xd8, 0x89, 0x50, 0x47, 0x49]

const getCode = (datRead: Buffer) => {
  try {
    if (!datRead || datRead.length === 0) {
      return [-1, -1]
    }

    let headIndex = 0
    while (headIndex < picHead.length) {
      const code = datRead[0] ^ picHead[headIndex]
      const idfCode = datRead[1] ^ code
      headIndex++

      if (idfCode === picHead[headIndex]) {
        return [headIndex, code]
      }

      headIndex++
    }

    return [-1, -1]
  } catch (error) {
    console.error(`image解析发生了错误:\n\n${error}`)
    return [-1, -1]
  }
}

const getPicName = (fileType: number, filePath: string) => {
  let picName: string
  switch (fileType) {
    case 1:
      picName = path.basename(filePath, path.extname(filePath)) + '.jpg'
      break
    case 3:
      picName = path.basename(filePath, path.extname(filePath)) + '.png'
      break
    case 5:
      picName = path.basename(filePath, path.extname(filePath)) + '.gif'
      break
    default:
      picName = path.basename(filePath, path.extname(filePath)) + '.jpg'
      break
  }
  return picName
}

export const decodeDat = (filePath: string, outPath: string) => {
  if (!fs.existsSync(filePath)) return null
  if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true })

  const data = fs.readFileSync(filePath)

  const [fileType, decodeCode] = getCode(data.slice(0, 2))
  if (decodeCode === -1) return ''

  const picName = getPicName(fileType, filePath)
  const fileOutPath = path.join(outPath, picName)
  if (fs.existsSync(fileOutPath)) return fileOutPath

  const decodedData = Buffer.from(data.map(byte => byte ^ decodeCode))
  fs.writeFileSync(fileOutPath, decodedData)

  return fileOutPath
}
