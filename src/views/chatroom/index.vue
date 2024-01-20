<template>
  <div>
    <div class="title">
      <h2>群聊列表</h2>
    </div>
    <div class="container">
      <div class="search-box">
        <el-input v-model="query.keyword" placeholder="请输入群聊名称" class="search-input mr10" clearable></el-input>
        <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="warning" plain @click="handleExportXlsx">导出Excel</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" height="740px" class="table" header-cell-class-name="table-header">
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
              <el-button type="info" class="btn" plain @click="handleShowDialog(scope.$index, 'add_member')">
                邀请成员
              </el-button>
            </div>
            <div>
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'image')">
                发图片
              </el-button>
              <el-button type="warning" class="btn" plain @click="handleShowDialog(scope.$index, 'file')">
                发文件
              </el-button>
              <el-button type="danger" class="btn" plain @click="handleQuitChatRoom(scope.$index)">
                退出群聊
              </el-button>
            </div>
            <div>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index, 'text')">
                发消息
              </el-button>
              <el-button type="primary" class="btn" plain @click="handleShowDialog(scope.$index, 'wx_article')">
                发公众号消息
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

    <el-dialog :title="optMode == 'add_member' ? '添加成员' : '编辑消息'" v-model="visible" width="500px" destroy-on-close
      :close-on-click-modal="false" @close="visible = false">
      <chat-room-form :mode="optMode" :data="contactData" :confirm="handleConfirm"></chat-room-form>
    </el-dialog>

    <el-dialog :title="roomTitle" v-model="roomVisible" width="800px" destroy-on-close :close-on-click-modal="false"
      @close="handleCloseRoom">
      <chat-room-table :isAdmin="isAdmin" :chatroom="memberData" :confirm="handleShowRoomDialog"
        :delete="handleDeleteMember"></chat-room-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

import ChatRoomForm from './ChatRoomForm.vue';
import ChatRoomTable from './ChatRoomTable.vue';

import { useUserStore } from '../../store/user'
import type { Contact, ChatRoom } from '../../api'
import {
  sendTextMsg, sendAtTextMsg, sendImagesMsg, sendFileMsg, forwardPublicMsg,
  getMemberFromChatRoom, quitChatRoom,
  addMemberToChatRoom, inviteMemberToChatRoom, delMemberFromChatRoom
} from '../../api';

import { useSearchTable } from './useSearch';
import { useExport } from './useExport';

const {
  query, pageTotal, allTableData, tableData, filterData, initialSize,
  handleSearch, handlePageSizeChange, handlePageChange, handleRefreshData, lazyFetchMembers
} = useSearchTable()
const { exportXlsx } = useExport()

const loading = ref(false)

const optMode = ref('') //  'text' or 'room_text' or 'room_at_text' or 'image' or 'file' or 'wx_article' or 'add_member'

const { userInfo } = useUserStore()

const visible = ref(false)
const roomData = ref<Contact>()
const contactData = computed(() =>
  allTableData.value.filter((item) => !(item.wxid.includes('chatroom') || /^gh_/.test(item.wxid))))

const roomTitle = ref('')
const roomVisible = ref(false)
const memberData = ref<ChatRoom>()

const isAdmin = computed(() => userInfo?.wxid === memberData.value?.admin)

const handleExportXlsx = () => exportXlsx(filterData.value)

const handleShowDialog = (index: number, mode: string) => {
  optMode.value = mode;
  roomData.value = tableData.value[index];
  visible.value = true;
}
const handleShowRoomDialog = (item: { mode: string, wx_ids: string[] }) => {
  optMode.value = item.mode;
  roomData.value = {
    wxid: item.wx_ids.join(','),
  } as any;
  visible.value = true;
}

const handleViewDetail = async (index: number) => {
  try {
    const contact = tableData.value[index]
    const chatroom = await getMemberFromChatRoom(contact.wxid, initialSize)

    if (!chatroom) {
      ElMessage.error('查看详情失败');
      return
    }

    roomTitle.value = `成员列表 - ${contact.nickname}` +
      `${chatroom.adminNickname && `(${chatroom.adminNickname})`}`

    memberData.value = chatroom
    roomVisible.value = true

    lazyFetchMembers(chatroom.members)
  } catch (error) { }
}

const tableReset = () => {
  memberData.value = undefined;
  roomVisible.value = false;
}

const handleCloseRoom = tableReset

const handleDeleteMember = async (wx_ids: string[]) => {
  ElMessageBox.confirm('确定要删除该成员吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      if (!memberData.value) return

      loading.value = true;

      const res = await delMemberFromChatRoom(memberData.value.chatRoomId, wx_ids)

      if (res.code > 0) {
        ElMessage.success('删除成功');
      } else {
        ElMessage.error('删除失败');
      }

      loading.value = false;
      tableReset()
    })
    .catch(() => { });
}

const formReset = () => {
  roomData.value = undefined;
  visible.value = false;
}

const handleConfirm = async (data: any) => {
  if (!roomData.value) return

  let res: any;
  let successMsg = '发送成功'
  let errorMsg = '发送失败'

  if (data.mode === 'text') {
    res = await sendTextMsg(roomData.value.wxid, data.message)
  } else if (data.mode === 'image') {
    res = await sendImagesMsg(roomData.value.wxid, data.image_url)
  } else if (data.mode === 'file') {
    res = await sendFileMsg(roomData.value.wxid, data.file_url)
  } else if (data.mode === 'wx_article') {
    res = await forwardPublicMsg({
      wxid: roomData.value.wxid,
      title: data.title,
      url: data.url,
      thumbUrl: data.thumb_url,
      digest: data.digest
    })
  } else if (data.mode === 'add_member') {
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
  } else if (memberData.value) {
    if (data.mode === 'room_text') {
      res = await sendTextMsg(memberData.value.chatRoomId, data.message)
    } else if (data.mode === 'room_at_text') {
      res = await sendAtTextMsg(
        memberData.value.chatRoomId,
        roomData.value.wxid.split(','),
        data.message
      )
    }
  }

  if (res.code >= 1) {
    ElMessage.success(successMsg);
  } else {
    ElMessage.error(errorMsg);
  }

  formReset()
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
