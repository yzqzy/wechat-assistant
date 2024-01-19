import * as XLSX from 'xlsx'
import { addDateSuffixToFileName } from '../../utils/tools'

export const useExport = () => {
  const exportXlsx = (tableData: any) => {
    const list = [['ID', '群聊名称', '拼音缩写', '拼音']]
    tableData.map((item: any, i: number) => {
      const arr: any[] = [i + 1]
      arr.push(...[item.wxid, item.nickname, item.pinyin, item.pinyinAll])
      list.push(arr)
    })
    let WorkSheet = XLSX.utils.aoa_to_sheet(list)
    let new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页')
    XLSX.writeFile(new_workbook, addDateSuffixToFileName('群聊列表.xlsx'))
  }

  return {
    exportXlsx
  }
}
