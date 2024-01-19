import { IpcMainEvent, ipcMain } from 'electron'
import { execFile } from 'child_process'

const ok = (event: IpcMainEvent) =>
  event.sender.send('inject-wxhelper-reply', 'ok')

const error = (event: IpcMainEvent, message: string) =>
  event.sender.send('inject-wxhelper-reply', 'error')

export const injector = () => {
  ipcMain.on('inject-wxhelper', (event, args) => {
    const { injectPath, processName, dllPath } = JSON.parse(args)

    console.log(`[inject-wxhelper] injectPath: ${injectPath}`)
    console.log(`[inject-wxhelper] processName: ${processName}`)
    console.log(`[inject-wxhelper] dllPath: ${dllPath}`)

    const exec_args = ['--process-name', processName, '--inject', dllPath]

    execFile(injectPath, exec_args, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`[inject-wxhelper] error: ${error.message}`)
        error(event, error.message)
        return
      }

      console.log(`[inject-wxhelper] stdout: ${stdout}`)
      console.log(`[inject-wxhelper] stderr: ${stderr}`)

      if (stdout.includes('Successfully injected module!')) {
        ok(event)
        return
      }

      error(event, 'inject failed')
    })
  })
}
