import { ComputedRef, ref } from 'vue'
import { Contact, Room } from '@/api'
import { ElTable } from 'element-plus'

type Props = {
  tableData: ComputedRef<Contact[] | Room[]>
}

export const useSection = (props: Props) => {
  const multipleSelection = ref<Contact[]>([])
  const multipleTableRef = ref<InstanceType<typeof ElTable>>()

  const handleSelectionAllChange = (selection: Contact[]) => {
    if (selection.length != 0) return

    for (const item of props.tableData.value) {
      handleSelectionRowChange([], item)
    }
  }
  const handleSelectionRowChange = (contact: Contact[], row: Contact) => {
    const isDelete = contact.every(item => item.wxid !== row.wxid)
    if (!isDelete) return
    const index = multipleSelection.value.findIndex(
      item => item.wxid === row.wxid
    )
    if (index === -1) return
    handleRemoverSeclection(index)
  }
  const handleSelectionChange = (contact: Contact[]) => {
    if (contact.length === 0) return
    multipleSelection.value = [
      ...new Set(contact.concat(multipleSelection.value))
    ]
  }
  const handleRemoverSeclection = (index: number) => {
    const row = multipleSelection.value[index]
    multipleTableRef.value!.toggleRowSelection(row, false)
    multipleSelection.value.splice(index, 1)
  }
  const handleClearSelection = () => {
    multipleTableRef.value!.clearSelection()
    multipleSelection.value = []
  }

  return {
    multipleSelection,
    multipleTableRef,

    handleSelectionAllChange,
    handleSelectionRowChange,
    handleSelectionChange,
    handleRemoverSeclection,
    handleClearSelection
  }
}
