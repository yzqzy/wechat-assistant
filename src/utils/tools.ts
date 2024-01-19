export const addDateSuffixToFileName = (fileName: string) => {
  const currentDate = new Date()
  const suffix = currentDate.toISOString().slice(0, 10).replace(/-/g, '')
  const [name, ext] = fileName.split('.')

  return `${name}_${suffix}.${ext}`
}
