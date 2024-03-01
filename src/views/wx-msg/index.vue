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
          <el-button circle class="refresh-btn" :icon="Refresh" />
        </div>

        <!-- 联系人列表 -->
        <div class="contact-list">
          <div class="contact" :class="{ active: contact.username === selectedContact?.username }"
            v-for="contact in searchContacts" :key="contact.username" @click="handleSelectContact(contact)">
            <div class="avator">
              <img :src="contact.smale_head_img_url" alt="head-img" />
            </div>
            <div class="nickname">{{ contact.nickname }}</div>
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
import { DatabaseContact } from '../../typings'

const { loading, contacts, getMessages } = useDatabase()

const keyword = ref('')
const selectedContact = ref<DatabaseContact | null>(null)

const handleGetMsg = () => {
  if (!selectedContact.value) return
  getMessages(selectedContact.value.username)
}

const searchContacts = computed(() => {
  if (!contacts.value) return []
  return contacts.value.filter(contact => contact.nickname.includes(keyword.value))
})

const handleSelectContact = (contact: DatabaseContact) => {
  selectedContact.value = contact
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
