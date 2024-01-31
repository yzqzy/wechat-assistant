<template>
  <div class="cron-edit-form">
    <el-form :model="from" ref="cronForm" label-width="100px">
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  task?: any
}>()

const from = ref({
  minute: '',
  hour: '',
  day: '',
  month: '',
  week: '',
});
</script>

<style lang="scss" scoped></style>