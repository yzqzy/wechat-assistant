import exceljs from 'exceljs'
import axios from 'axios'

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

const insert_image_to_xlsx = (options: any) => {
  const { workbook, worksheet, item, index } = options

  if (!Array.isArray(item)) return item

  item.forEach((value, idx) => {
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      item[idx] = ''

      const imageId = workbook.addImage({
        base64: value.replace('data:image/png;base64,', ''),
        extension: 'png'
      })

      worksheet.addImage(imageId, {
        tl: { col: idx + 0.5, row: index },
        ext: { width: 80, height: 80 },
        editAs: 'oneCell'
      })
    }
  })

  return item
}

const create_xlsx_data = (options: any) => {
  const { list, workbook, worksheet, hasPic } = options

  return new Promise((resolve, reject) => {
    list.forEach((item: any, index: number) => {
      insert_image_to_xlsx({
        workbook,
        worksheet,
        item,
        index
      })

      const row = worksheet.addRow(item)

      row.height = hasPic ? 60 : 20

      const fontHeight = 12
      const cellHeight = row.height || worksheet.properties.defaultRowHeight
      const verticalOffset = (cellHeight - fontHeight) / 2
      row.alignment = { vertical: 'middle', verticalOffset }

      row.commit()
    })

    resolve(null)
  })
}

const create_xlsx_Buffer = async (config: any) => {
  const { headers, list, hasPic } = config
  const workbook = new exceljs.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  worksheet.columns = headers
  worksheet.properties.defaultColWidth = 20

  await create_xlsx_data({ list, workbook, worksheet, hasPic })

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

const remoteFileToBase64 = async (url: string) => {
  return await axios.get(url, { responseType: 'arraybuffer' }).then(res => {
    const base64 = btoa(
      new Uint8Array(res.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )
    return `data:image/png;base64,${base64}`
  })
}

const normalizedContent = async (
  columns: Record<string, string>,
  item: any,
  imageFields: string[]
) => {
  const keys = Object.keys(columns)
  const data = []

  for (const key of keys) {
    const fields = key.split('.')
    const value = fields.reduce((pre, field) => pre[field], item)

    if (imageFields.includes(key)) {
      item[key] = await remoteFileToBase64(value)
    } else {
      item[key] = value
    }

    data.push(item[key])
  }

  return data
}

const normalizedConfig = async (
  columns: Record<string, string>,
  data: any[],
  imageFields: string[]
) => {
  const columnsKeys = Object.keys(columns)
  const headers = columnsKeys.map(key => ({ key, header: columns[key] }))
  const hasPic = imageFields.length > 0
  const list = await Promise.all(
    data.map((item: any) => normalizedContent(columns, item, imageFields))
  )
  return { headers, list, hasPic }
}

export interface ExportProps<T> {
  title: string
  columns: Record<string, string>
  data: T
  imageFields?: string[]
}

export const downloadXlsx = async (props: ExportProps<any>) => {
  const { title, columns, data, imageFields = [] } = props
  const filename = addDateSuffixToFileName(title, 'xlsx')
  const config = await normalizedConfig(columns, data, imageFields)
  const buffer = await create_xlsx_Buffer(config)
  frontend_download(filename, buffer)
}

export const downloadPdf = async (props: ExportProps<any>) => {
  // TODO: Implement PDF export
}
