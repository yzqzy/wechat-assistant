import exceljs from 'exceljs'

export const addDateSuffixToFileName = (fileName: string, ext: string) => {
  const currentDate = new Date()
  const suffix = currentDate.toISOString().slice(0, 10).replace(/-/g, '')
  return `${fileName.replace(/\s/g, '_')}_${suffix}.${ext}`
}

const frontend_download = (fileName: string, buffer: any) => {
  const blob = new Blob([buffer])
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}

const create_xlsx_Buffer = async (config: any) => {
  const { headers, list } = config
  const workbook = new exceljs.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  worksheet.columns = headers
  list.forEach((item: any) => worksheet.addRow(item).commit())
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

const normalizedContent = (columns: Record<string, string>, item: any) => {
  return Object.keys(columns).reduce((pre, key) => {
    const fields = key.split('.')
    pre[key] = fields.reduce((pre, field) => pre[field], item)
    return pre
  }, {} as any)
}

const normalizedConfig = (columns: Record<string, string>, data: any) => {
  const columnsKeys = Object.keys(columns)
  const headers = columnsKeys.map(key => ({ key, header: columns[key] }))
  const list = data.map((item: any) => normalizedContent(columns, item))
  return { headers, list }
}

export const downloadXlsx = async (
  fileName: string,
  columns: Record<string, string>,
  data: any
) => {
  const filename = addDateSuffixToFileName(fileName, 'xlsx')
  const config = normalizedConfig(columns, data)
  const buffer = await create_xlsx_Buffer(config)
  frontend_download(filename, buffer)
}

const create_pdf = async (buffer: any) => {
  // TODO: Implement PDF export
}

export const downloadPdf = async (
  fileName: string,
  columns: Record<string, string>,
  data: any
) => {
  const filename = addDateSuffixToFileName(fileName, 'pdf')
  const config = normalizedConfig(columns, data)
  const buffer = await create_xlsx_Buffer(config)
  frontend_download(filename, buffer)
}
