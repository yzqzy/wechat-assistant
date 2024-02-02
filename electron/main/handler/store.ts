import { ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store()

const bindEvents = () => {
  ipcMain.handle('get-store-value', (_, key) => {
    return store.get(key)
  })
  ipcMain.handle('set-store-value', (_, key, value) => {
    store.set(key, value)
    return store.get(key)
  })
  ipcMain.handle('clear-store', () => {
    store.clear()
  })
}

bindEvents()

export default store
