<template>
  <div>
    <div class="title">
      <h2>群聊列表</h2>
    </div>
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input v-model="query.keyword" placeholder="请输入群聊名称" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
      </div>

      <!-- 选择区域 -->
      <chat-room-section :data="tableData" :multiple-selection="multipleSelection" :handle-show-dialog="handleShowDialog"
        :handle-clear-selection="handleClearSelection"
        :handle-remover-seclection="handleRemoverSeclection"></chat-room-section>

      <!-- 表格区域 -->
      <el-table v-loading="loading" ref="multipleTableRef" :data="tableData" height="70vh" class="table"
        header-cell-class-name="table-header" @selection-change="handleSelectionChange" @select="handleSelectionRowChange"
        @select-all="handleSelectionAllChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="wxid" label="ID" width="220"></el-table-column>
        <el-table-column prop="nickname" label="群聊名称" align="center"></el-table-column>
        <el-table-column prop="pinyin" label="拼音缩写" align="center"></el-table-column>
        <el-table-column prop="pinyinAll" label="拼音" align="center"></el-table-column>
        <el-table-column label="操作" width="340" align="center">
          <template #default="scope">
            <div>
              <el-button type="success" class="btn" plain @click="handleViewDetail(scope.$index)">
                查看群成员
              </el-button>
              <el-button type="success" class="btn" plain @click="handleShowMemberDialog(scope.$index)">
                添加成员
              </el-button>
            </div>
            <div>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index)">
                发消息
              </el-button>
              <el-button type="danger" class="btn" plain @click="handleQuitChatRoom(scope.$index)">
                退出群聊
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="handlePageSizeChange" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <el-dialog title="编辑消息" v-model="visible" width="500px" destroy-on-close :close-on-click-modal="false"
      @close="handleCloseDialog">
      <message-form :multi="!isAtMode" :confirm="handleConfirm"></message-form>
    </el-dialog>

    <el-dialog title="添加成员" v-model="memberVisible" width="500px" destroy-on-close :close-on-click-modal="false"
      @close="handleCloseMemberDialog">
      <chat-member-form :data="contactData" :confirm="handleAddMember"></chat-member-form>
    </el-dialog>

    <el-dialog :title="roomTitle" v-model="roomVisible" width="800px" destroy-on-close :close-on-click-modal="false"
      @close="handleCloseRoom">
      <chat-room-table :title="roomTitle" :isAdmin="isAdmin" :chatroom="roomMemberData" :confirm="handleShowAtDialog"
        :delete="handleDeleteMember"></chat-room-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="chatroom">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import ChatRoomSection from '../../components/service/MultipleSection/Section.vue';
import MessageForm from '../../components/service/MessageForm.vue';
import ChatMemberForm from './ChatMemberForm.vue';
import ChatRoomTable from './ChatRoomTable.vue';

import { useUserStore } from '../../store/user'
import type { Room, ChatRoom } from '../../api'
import {
  getMemberFromChatRoom, quitChatRoom,
  addMemberToChatRoom, inviteMemberToChatRoom, delMemberFromChatRoom
} from '../../api';

import { useSection } from '../../components/service/MultipleSection/useSection'
import { useMessage } from '../../composables/useMessage'
import { useSearchTable } from './useSearch';
import { useExport } from './useExport';

const {
  query, pageTotal, allTableData, tableData, filterData, initialSize,
  handleSearch, handlePageSizeChange, handlePageChange, handleRefreshData, lazyFetchMembers
} = useSearchTable()
const {
  multipleTableRef, multipleSelection,
  handleSelectionChange, handleSelectionRowChange, handleSelectionAllChange,
  handleRemoverSeclection, handleClearSelection
} = useSection({ tableData })

const { sendMsgBatch } = useMessage()
const { exportXlsx } = useExport()

const loading = ref(false)

const { userInfo } = useUserStore()
const isAdmin = computed(() => userInfo?.wxid === roomMemberData.value?.admin)

const isAtMode = ref(false)
const atWxIds = ref<string[]>([])

const visible = ref(false)
const memberVisible = ref(false)
const roomVisible = ref(false)
const isMultiple = ref(false)

const roomTitle = ref('')
const roomData = ref<Room>()
const contactData = computed(() =>
  allTableData.value.filter((item) => !(item.wxid.includes('chatroom') || /^gh_/.test(item.wxid))))
const roomMemberData = ref<ChatRoom>()

const handleExportXlsx = () => exportXlsx(filterData.value)

const handleShowDialog = (action: number | string) => {
  if (typeof action === 'number') {
    roomData.value = tableData.value[action];
  } else {
    isMultiple.value = true;
  }
  visible.value = true;
}
const handleShowMemberDialog = (index: number) => {
  roomData.value = tableData.value[index];
  memberVisible.value = true;
}
const handleShowAtDialog = (wx_ids: string[]) => {
  isAtMode.value = true
  atWxIds.value = wx_ids
  visible.value = true;
}

const lazyFetchController = ref()

const handleViewDetail = async (index: number) => {
  try {
    const room = tableData.value[index]
    const chatroom = await getMemberFromChatRoom(room.wxid, initialSize)

    if (!chatroom) {
      ElMessage.error('查看详情失败');
      return
    }

    roomTitle.value = `成员列表 - ${room.nickname}` +
      `${chatroom.adminNickname && `(${chatroom.adminNickname})`}`

    roomData.value = room
    roomMemberData.value = chatroom
    roomVisible.value = true

    lazyFetchController.value = lazyFetchMembers(chatroom.members)
  } catch (error) { }
}

const handleCloseRoom = () => {
  if (lazyFetchController.value) {
    lazyFetchController.value.abort()
    lazyFetchController.value = undefined
  }

  roomMemberData.value = undefined;
  roomVisible.value = false;
}
const handleDeleteMember = async (wx_ids: string[]) => {
  ElMessageBox.confirm('确定要删除该成员吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      if (!roomMemberData.value) return

      loading.value = true;

      const res = await delMemberFromChatRoom(roomMemberData.value.chatRoomId, wx_ids)

      if (res.code > 0) {
        ElMessage.success('删除成功');
      } else {
        ElMessage.error('删除失败');
      }

      loading.value = false;
      handleCloseRoom()
    })
    .catch(() => { });
}


const handleCloseMemberDialog = () => {
  roomData.value = undefined;
  memberVisible.value = false;
}
const handleAddMember = async (data: any) => {
  if (!roomData.value) return

  let res: any;
  let successMsg = '发送成功'
  let errorMsg = '发送失败'

  const chatroom = await getMemberFromChatRoom(roomData.value.wxid, initialSize, false)

  if (chatroom && chatroom.members.length >= 40) {
    successMsg = '邀请成功'
    errorMsg = '邀请失败'
    res = await inviteMemberToChatRoom(roomData.value.wxid, data.member_ids)
  } else {
    successMsg = '添加成功'
    errorMsg = '添加失败'
    res = await addMemberToChatRoom(roomData.value.wxid, data.member_ids)
  }

  if (res.code >= 1) {
    ElMessage.success(successMsg);
  } else {
    ElMessage.error(errorMsg);
  }

  handleCloseMemberDialog()
}

const handleCloseDialog = () => {
  handleClearSelection()
  isAtMode.value = false
  atWxIds.value = []
  roomData.value = undefined;
  visible.value = false;
  loading.value = false;
}
const handleConfirm = async (data: any) => {
  if (!roomData.value && (isMultiple.value && multipleSelection.value.length === 0)) return

  const wx_ids = isMultiple.value
    ? multipleSelection.value.map(item => item.wxid)
    : roomData.value && [roomData.value.wxid] || []

  if (wx_ids.length > 2)
    loading.value = true

  await sendMsgBatch(wx_ids, data, {
    isAt: isAtMode.value,
    atWxIds: atWxIds.value,
  })

  handleCloseDialog()
}

const handleQuitChatRoom = (index: number) => {
  const { wxid } = tableData.value[index]

  ElMessageBox.confirm('确定要退出该群聊吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      loading.value = true;

      const res = await quitChatRoom(wxid);

      if (res.code > 0) {
        handleRefreshData(() => {
          loading.value = false;
          ElMessage.success('退出成功');
        })
        return
      }

      loading.value = false;
      ElMessage.error('退出失败');
    })
    .catch(() => { });
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
