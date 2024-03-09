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
      <div class="right">
        <div class="chat-info">
          <div class="info">
            <div class="remark">{{ selectedChat?.remark || selectedChat?.nickname }}</div>
            <div v-if="selectedChat?.remark" class="nickname">{{ selectedChat?.nickname }}</div>
          </div>
          <div class="btns">
            <el-button circle class="refresh-btn" :icon="Refresh" @click="refreshMessages" />
          </div>
        </div>
        <div class="message-list scroll-bar" ref="messageRef">
          <div class="refresh-spinner">
            <el-icon v-if="refreshing">
              <Loading />
            </el-icon>
          </div>

          <div class="message" :class="{ 'is-sender': msg.isSender }" v-for="(msg, idx) in messages"
            :key="msg.wxid + '' + idx">
            <div class="avator">
              <img :src="msg.user?.smalllAvatar || ''" alt="head-img" />
            </div>
            <div class="content">
              <div v-if="!msg.isSender" class="username">
                {{ msg.user?.remark || msg.user?.nickname || '' }}
              </div>
              <div class="msg">
                <div v-if="msg.type === 1 || msg.type === 10000">
                  {{ msg.content }}
                </div>
                <div v-else-if="msg.type === 3">
                  <el-image class="image" :src="msg.content" alt="image" fit="contain" />
                </div>
                <div v-else-if="msg.type === 47">
                  <el-image class="image small" :src="msg.content" alt="image" fit="contain" />
                </div>
                <div v-else>
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="wx-msg">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { useDatabase } from '../../composables/useDatabase'
import { DatabaseChat } from '../../typings'

const { loading, refreshing, chats, messages, selectedChat, setSelectedChat, getMessages, resetParams, refreshChats, loadMoreData } = useDatabase()

const keyword = ref('')
const messageRef = ref<HTMLDivElement | null>(null)

const refreshMessages = () => {
  if (!selectedChat.value) return
  resetParams()
  getMessages(selectedChat.value.wxid)
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
  setSelectedChat(chat)
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
