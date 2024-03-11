import { downloadXlsx } from '@/utils/tools'

interface ExportProps {
  title: string
  columns: Record<string, string>
  data: any
}

export const useExport = () => {
  const exportXlsx = async (props: ExportProps) => {
    const { title, columns, data } = props
    downloadXlsx(title, columns, data)
  }

  return {
    exportXlsx
  }
}
