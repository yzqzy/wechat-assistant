<template>
  <div>
    <div class="title">
      <h2>聊天记录备份</h2>
    </div>
    <div class="container" v-loading.fullscreen.lock="loading">
      <div class="left">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input v-model="keyword" style="width: 80%" placeholder="搜索" :prefix-icon="Search" />
          <el-button circle class="refresh-btn" :icon="Refresh" @click="refreshChats" />
        </div>

        <!-- 聊天列表 -->
        <div class="chat-list scroll-bar">
          <div class="chat"
            :class="{ active: chat.username === selectedChat?.username, disabled: chat.wxid.includes('gh_') }"
            v-for="chat in searchChats" :key="chat.wxid" @click="handleSelectChat(chat)">
            <div class="avator">
              <img :src="chat.smalllAvatar" alt="head-img" />
            </div>
            <div class="info">
              <div class="nickname">{{ formattedName(chat) }}</div>
              <div class="last-msg">{{ formattedContent(chat) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天记录 -->
      <div class="right">
        <div class="chat-info">
          <div class="info">
            <div class="remark">{{ selectedChat?.remark || selectedChat?.nickname }}</div>
            <div v-if="selectedChat?.remark" class="nickname">{{ selectedChat?.nickname }}</div>
          </div>
          <div class="btns">
            <el-button circle class="refresh-btn" :icon="Refresh" @click="refreshMessages" />
            <el-button circle class="download-btn" :icon="Download" @click="downloadMessages" />
          </div>
        </div>
        <div v-loading="messageLoading" class="message-list scroll-bar" ref="messageRef">
          <div class="refresh-spinner">
            <el-icon v-if="refreshing && !loading">
              <Loading />
            </el-icon>
          </div>

          <div class="message" :class="{ 'is-sender': msg.isSender }" v-for="(msg, idx) in messages"
            :key="msg.wxid + '' + idx">
            <template v-if="enabled_message_types.includes(msg.type)">
              <div class="avator">
                <img :src="msg.user?.smalllAvatar || ''" alt="head-img" />
              </div>
              <div class="content">
                <div v-if="!msg.isSender" class="username">
                  {{ msg.user?.remark || msg.user?.nickname || '' }}
                </div>
                <div class="msg">
                  <div class="text" v-if="msg.type === 1">
                    {{ msg.content }}
                  </div>
                  <div class="image" v-else-if="msg.type === 3">
                    <el-image class="image" :src="msg.content" fit="contain" />
                  </div>
                  <div class="image" v-else-if="msg.type === 47">
                    <el-image class="image small" :src="msg.content" fit="contain" />
                  </div>
                  <div class="system" v-else-if="msg.type === 10000">
                    {{ msg.content }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="wx-msg">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Search, Refresh, Download } from '@element-plus/icons-vue';

import { DatabaseChat } from '@/typings'
import { useExport } from '@/composables/useExport'
import { useDatabase } from './useDatabase'

const { loading, messageLoading, refreshing, chats, messages, selectedChat, setSelectedChat, getMessages, resetParams, refreshChats, loadMoreData } = useDatabase()
const { exportXlsx } = useExport()

const keyword = ref('')
const messageRef = ref<HTMLDivElement | null>(null)

// message types that are enabled to display in chat history
const enabled_message_types = [1, 3, 47, 10000]

const refreshMessages = () => {
  if (!selectedChat.value) return
  resetParams()
  getMessages(selectedChat.value.wxid)
}

const downloadMessages = async () => {
  if (!selectedChat.value) return

  await exportXlsx({
    title: `聊天记录_${selectedChat.value.remark || selectedChat.value.nickname}`,
    columns: {
      ['user.wxid']: '微信ID',
      ['user.remark']: '备注',
      ['user.nickname']: '昵称',
      type: '分类',
      subType: '子分类',
      content: '聊天内容',
      createTime: '发送时间',
    },
    data: messages.value.filter(msg => enabled_message_types.includes(msg.type))
  })
}

const scrollToBottom = () => {
  messageRef.value?.scrollTo({
    top: messageRef.value?.scrollHeight,
    behavior: 'smooth'
  })
}

watch(selectedChat, () => {
  if (selectedChat.value == null) return
  scrollToBottom()
  resetParams()
  getMessages(selectedChat.value.wxid)
})

watch(messages, () => {
  try {
    if (refreshing.value) return
    setTimeout(scrollToBottom, 300)
  } catch (error) {
    console.log(error)
  }
})

const handleScroll = () => {
  const { scrollTop } = messageRef.value!
  if (messages.value.length == 0) return

  const scrollHeight = messageRef.value!.scrollHeight
  const scrollValue = Math.abs(scrollTop) + messageRef.value!.offsetHeight

  if (scrollValue >= scrollHeight - 20) {
    loadMoreData()
  }
}

onMounted(() => {
  setTimeout(() => {
    messageRef.value?.addEventListener('scroll', handleScroll)
  }, 1000)
})
onBeforeUnmount(() => {
  messageRef.value?.removeEventListener('scroll', handleScroll)
})

const formattedName = computed(() => {
  return (chat: DatabaseChat) => {
    const name = chat.remark || chat.nickname
    return name.length > 10 ? `${name.slice(0, 10)}...` : name
  }
})
const formattedContent = computed(() => {
  return (chat: DatabaseChat) => {
    const msg = `${chat.unReadCount > 0 ? `[${chat.unReadCount}条] ` : ''}${chat.lastMsg}`
    return msg.length > 15 ? `${msg.slice(0, 15)}...` : msg
  }
})

const searchChats = computed(() => {
  if (!chats.value) return []
  return chats.value.filter(chat => chat.nickname.includes(keyword.value))
})

const handleSelectChat = (chat: DatabaseChat) => {
  if (chat.wxid.includes('gh_')) return
  setSelectedChat(chat)
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
