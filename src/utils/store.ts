import { Ref, ref } from 'vue'

export class Store<T> {
  constructor(private readonly key: string) {}

  get(): Promise<T> {
    return new Promise(resolve => {
      window.ipcRenderer.invoke('get-store-value', this.key).then(value => {
        resolve((value && JSON.parse(value)) || [])
      })
    })
  }

  set(value: T) {
    window.ipcRenderer.invoke(
      'set-store-value',
      this.key,
      JSON.stringify(value)
    )
  }
}
