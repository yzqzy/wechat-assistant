import { downloadXlsx } from '../../utils/tools'

export const useExport = () => {
  const exportXlsx = (tableData: any) => {
    downloadXlsx(
      tableData,
      {
        wxid: 'ID',
        nickname: '群聊名称',
        pinyin: '拼音缩写',
        pinyinAll: '拼音'
      },
      '群聊列表'
    )
  }

  return {
    exportXlsx
  }
}
