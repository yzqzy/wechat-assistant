import fs from 'fs'
import path from 'path'
import Registry from 'winreg'

const USER_PROFILE = process.env.USERPROFILE || ''

async function getRegistryValue(key: string, name: string): Promise<string> {
  const regKey = new Registry({
    hive: Registry.HKCU,
    key
  })
  return new Promise((resolve, reject) => {
    regKey.get(name, (err, item) => {
      if (item) {
        resolve(item.value)
        return
      }
      reject(err)
    })
  })
}

export async function getWxDir() {
  let wx_dir = ''
  let is_wx_dir = false

  try {
    wx_dir = await getRegistryValue(
      '\\Software\\Tencent\\WeChat',
      'FileSavePath'
    )
    is_wx_dir = true
  } catch (error) {
    wx_dir = 'MyDocument:'
  }

  if (!is_wx_dir) {
    try {
      const path_3ebffe94 = path.join(
        USER_PROFILE,
        'AppData',
        'Roaming',
        'Tencent',
        'WeChat',
        'All Users',
        'config',
        '3ebffe94.ini'
      )
      wx_dir = fs.readFileSync(path_3ebffe94, 'utf-8')
      is_wx_dir = true
    } catch (error) {
      wx_dir = 'MyDocument:'
    }
  }

  if (wx_dir.startsWith('MyDocument:')) {
    wx_dir = path.join(USER_PROFILE, 'Documents')
  }

  return path.join(wx_dir, 'WeChat Files')
}
