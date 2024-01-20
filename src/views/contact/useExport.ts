import { downloadXlsx } from '../../utils/tools'

export const useExport = () => {
  const exportXlsx = (tableData: any) => {
    downloadXlsx(
      tableData,
      {
        wxid: 'ID',
        nickname: '昵称',
        customAccount: '微信号',
        pinyin: '拼音缩写',
        pinyinAll: '拼音'
      },
      '联系人列表'
    )
  }

  return {
    exportXlsx
  }
}
