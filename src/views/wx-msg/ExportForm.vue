<template>
  <el-form :model="form" ref="ruleForm" label-position="left" label-width="120px">
    <el-form-item label="消息类型" prop="enabledTypes">
      <el-checkbox-group disabled v-model="form.enabledTypes">
        <el-checkbox v-for="item in msg_types" :key="item.value" :label="item.label" :value="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="时间范围" prop="time">
      <el-date-picker v-model="form.time" type="datetimerange" :shortcuts="shortcuts" range-separator="To"
        start-placeholder="Start date" end-placeholder="End date" />
    </el-form-item>
    <el-form-item label="导出格式" prop="format">
      <el-radio-group v-model="form.format" disabled>
        <el-radio value="xlsx">Excel 2007+</el-radio>
        <el-radio value="pdf">PDF</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button :disabled="disabled" type="primary" @click="handleConfirm">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'confirm', _: any): void
}>()

const disabled = ref(false)

const startOfDay = moment().subtract(2, 'days').startOf('day');
const endOfDay = moment().endOf('day');

const form = ref({
  enabledTypes: [1, 3, 47, 10000], // 1, 3, 34, 43, 47, 49, 10000
  format: 'xlsx', // xlsx or pdf
  time: [startOfDay.toDate(), endOfDay.toDate()]
})

const msg_types = [
  { value: 1, label: '文本' },
  { value: 3, label: '图片' },
  { value: 34, label: '语音' },
  { value: 43, label: '视频' },
  { value: 47, label: '动画表情' },
  { value: 10000, label: '系统消息' },
  { value: 49, label: '其他' },
]

const shortcuts = [
  {
    text: '近三天',
    value: () => {
      return [startOfDay.toDate(), endOfDay.toDate()]
    },
  },
  {
    text: '上周',
    value: () => {
      const startOfWeek = moment().subtract(1, 'weeks').startOf('week');
      const endOfWeek = moment().subtract(1, 'weeks').endOf('week');
      return [startOfWeek.toDate(), endOfWeek.toDate()]
    },
  },
  {
    text: '上月',
    value: () => {
      const startOfMonth = moment().subtract(1, 'months').startOf('month');
      const endOfMonth = moment().subtract(1, 'months').endOf('month');
      return [startOfMonth.toDate(), endOfMonth.toDate()]
    },
  },
  {
    text: '近三个月',
    value: () => {
      const startOfMonth = moment().subtract(3, 'months').startOf('month');
      const endOfMonth = moment().endOf('month');
      return [startOfMonth.toDate(), endOfMonth.toDate()]
    },
  },
]

const handleConfirm = () => {
  disabled.value = true
  emit('confirm', {
    ...form.value,
    time: [
      moment(form.value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      moment(form.value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
    ],
  })
  setTimeout(() => {
    disabled.value = false
  }, 3000)
}
</script>

<style lang="scss" scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.block:last-child {
  border-right: none;
}

.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
