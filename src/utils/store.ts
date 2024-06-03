import { Ref, ref } from 'vue'

class BaseStore<T> {
  constructor(private readonly key: string) {}

  get(): Promise<T[]> {
    return new Promise(resolve => {
      window.ipcRenderer.invoke('get-store-value', this.key).then(value => {
        resolve((value && JSON.parse(value)) || [])
      })
    })
  }

  set(value: T[]) {
    window.ipcRenderer.invoke(
      'set-store-value',
      this.key,
      JSON.stringify(value)
    )
  }
}

export class Store<T> {
  private store: BaseStore<T>
  private _data: Ref<T[]> = ref([])

  constructor(key: string) {
    this.store = new BaseStore<T>(key)
    this.initialize()
  }

  private initialize() {
    this.store.get().then(savedTasks => {
      this._data.value = savedTasks
    })
  }

  private updateStore() {
    this.store.set(this._data.value)
  }

  get data() {
    return this._data
  }

  add = (task: T) => {
    this._data.value.push(task)
    this.updateStore()
  }

  edit = (index: number, task: T) => {
    this._data.value[index] = task
    this.updateStore()
  }

  remove = (index: number) => {
    this._data.value.splice(index, 1)
    this.updateStore()
  }
}
