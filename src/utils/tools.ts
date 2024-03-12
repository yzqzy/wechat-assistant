export const delaySync = (ms: number = 600) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const textIncludes = (v1: string, v2: string) =>
  v1.toLocaleLowerCase().includes(v2.toLocaleLowerCase())

export const getRandomInt = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start + 1) + start)
export const getRandomId = () => {
  const timestamp = Date.now().toString()
  const randomId = `${timestamp}${Math.random().toString(36).substring(2, 5)}`
  return randomId
}
