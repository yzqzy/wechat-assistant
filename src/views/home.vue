<template>
  <v-header />
  <v-sidebar />

  <div class="content-box">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import vHeader from '../components/layout/Header.vue';
import vSidebar from '../components/layout/SideBar.vue';
</script>
