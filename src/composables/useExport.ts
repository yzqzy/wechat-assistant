import { ElMessage } from 'element-plus'
import { downloadXlsx } from '../utils/tools'

interface ExportProps {
  title: string
  columns: Record<string, string>
  data: any
}

export const useExport = () => {
  const exportXlsx = async (props: ExportProps) => {
    const { title, columns, data } = props
    await downloadXlsx(title, columns, data)
    ElMessage.success('导出成功')
  }

  return {
    exportXlsx
  }
}
