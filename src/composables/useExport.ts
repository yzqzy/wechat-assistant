import { downloadXlsx, downloadPdf } from '@/utils/export'

export const useExport = () => ({
  exportXlsx: downloadXlsx,
  exportPdf: downloadPdf
})
