import { downloadXlsx, downloadPdf } from '@/utils/export'

interface ExportProps<T> {
  title: string
  columns: Record<string, string>
  data: T
}

export const useExport = () => {
  const exportXlsx = async (props: ExportProps<any>) => {
    const { title, columns, data } = props
    await downloadXlsx(title, columns, data)
  }

  const exportPdf = async (props: ExportProps<any>) => {
    const { title, columns, data } = props
    await downloadPdf(title, columns, data)
  }

  return {
    exportXlsx,
    exportPdf
  }
}
