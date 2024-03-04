<template>
  <div>
    <div class="title">
      <h2>聊天记录备份</h2>
    </div>
    <div class="container" v-loading.fullscreen.lock="loading">
      <div class="left">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input v-model="keyword" style="width: 240px" placeholder="搜索" :prefix-icon="Search" />
          <el-button circle class="refresh-btn" :icon="Refresh" @click="refreshChats" />
        </div>

        <!-- 聊天列表 -->
        <div class="chat-list">
          <div class="chat" :class="{ active: chat.username === selectedChat?.username }" v-for="chat in searchChats"
            :key="chat.wxid" @click="handleSelectChat(chat)">
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
      <div class="message-list"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="wx-msg">
import { computed, ref } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { useDatabase } from '../../composables/useDatabase'
import { DatabaseChat } from '../../typings'

const { loading, chats, getMessages, refreshChats } = useDatabase()

const keyword = ref('')
const selectedChat = ref<DatabaseChat | null>(null)

const handleGetMsg = () => {
  if (!selectedChat.value) return
  getMessages(selectedChat.value.username)
}

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
  selectedChat.value = chat
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
