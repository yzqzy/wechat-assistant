export const addDateSuffixToFileName = (fileName: string) => {
  const currentDate = new Date()
  const suffix = currentDate.toISOString().slice(0, 10).replace(/-/g, '')
  const [name, ext] = fileName.split('.')

  return `${name}_${suffix}.${ext}`
}

export const textIncludes = (v1: string, v2: string) =>
  v1.toLocaleLowerCase().includes(v2.toLocaleLowerCase())

export const delaySync = (ms: number = 600) =>
  new Promise(resolve => setTimeout(resolve, ms))
