import { Ref, ref } from 'vue'

class Store<T> {
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

export class TaskStore<T> {
  private store: Store<T>
  private _tasks: Ref<T[]> = ref([])

  constructor(key: string) {
    this.store = new Store<T>(key)
    this.initialize()
  }

  private initialize() {
    this.store.get().then(savedTasks => {
      this._tasks.value = savedTasks
    })
  }

  private updateStore() {
    this.store.set(this._tasks.value)
  }

  get tasks() {
    return this._tasks
  }

  addTask = (task: T) => {
    this._tasks.value.push(task)
    this.updateStore()
  }

  editTask = (index: number, task: T) => {
    this._tasks.value[index] = task
    this.updateStore()
  }

  removeTask = (index: number) => {
    this._tasks.value.splice(index, 1)
    this.updateStore()
  }
}
