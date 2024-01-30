import * as XLSX from 'xlsx'

export const addDateSuffixToFileName = (fileName: string) => {
  const currentDate = new Date()
  const suffix = currentDate.toISOString().slice(0, 10).replace(/-/g, '')
  const [name, ext] = fileName.split('.')
  return `${name}_${suffix}.${ext}`
}

export const downloadXlsx = (fileName: string, fieds: any, data: any) => {
  return new Promise(resolve => {
    const list = [Object.values(fieds)]
    data.forEach((item: any) => {
      list.push([...Object.keys(fieds).map(key => item[key])])
    })
    const WorkSheet = XLSX.utils.aoa_to_sheet(list)
    const new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页')
    XLSX.writeFile(new_workbook, addDateSuffixToFileName(`${fileName}.xlsx`))
    resolve(null)
  })
}

export const textIncludes = (v1: string, v2: string) =>
  v1.toLocaleLowerCase().includes(v2.toLocaleLowerCase())

export const getRandomInt = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start + 1) + start)

export const delaySync = (ms: number = 600) =>
  new Promise(resolve => setTimeout(resolve, ms))
