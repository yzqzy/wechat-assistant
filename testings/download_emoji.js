import fs from 'node:fs'
import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

const emoji_url =
  'http://wxapp.tc.qq.com/262/20304/stodownload?m=fe413c62b99d4053b0057b1d46320a33&filekey=30340201010420301e02020106040253480410fe413c62b99d4053b0057b1d46320a33020253e1040d00000004627466730000000132&hy=SH&storeid=26324831b0004edae000000000000010600004f5053481fe67b40b7dfde14d&bizid=1023'

;(async () => {
  const response = await axios.get(emoji_url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data)
  const type = await fileTypeFromBuffer(buffer)

  fs.writeFileSync('emoji.png', buffer)

  console.log(type)
})()
