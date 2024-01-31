<template>
  <div class="cron-edit-form">
    <el-form :model="form" ref="cronForm" label-width="120px" label-position="left">
      <el-form-item label="任务名称">
        <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <message-form multi :mode="form.type" :form="form.params" @change="handleChange">
          <template v-slot:footer><span></span></template>
        </message-form>
      </el-form-item>
      <el-form-item label="执行模式">
        <el-radio-group disabled v-model="form.mode">
          <el-radio-button label="normal">普通模式</el-radio-button>
          <el-radio-button label="custom">自定义模式</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="cron表达式">
        <el-input v-model="form.cron" placeholder="请输入cron表达式"></el-input>
        <p>{{ cronDesc }}</p>
      </el-form-item>
      <el-form-item label="接收者">
        <el-select v-model="form.receiver_ids" multiple filterable placeholder="请选择接收者">
          <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.enable"></el-switch>
      </el-form-item>
      <el-form-item label="任务参数">
        <textarea class="textarea" disabled :value="JSON.stringify(form.params, null, 2)" cols="100" rows="10"></textarea>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm">{{ props.task ? '编辑' : '新增' }}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'

import MessageForm from '../../components/service/MessageForm.vue';

import { Task, TaskMode } from '../../store/task'
import { MessageType, Contact } from '../../api';
import { getRandomId } from '../../utils/tools';

const props = defineProps<{
  data: Contact[]
  task?: Task
}>()

const emit = defineEmits<{
  (e: 'confirm', _: Task): void
  (e: 'cancel'): void
}>()

const form = ref<Task>(props.task || {
  uid: getRandomId(),
  type: MessageType.TEXT,
  name: '',
  mode: TaskMode.CUSTOM,
  receiver_ids: [],
  cron: '',
  enable: false,
  params: {}
});
const cronDesc = computed(() => {
  try {
    if (!form.value.cron) return ''
    return cronstrue.toString(form.value.cron, {
      use24HourTimeFormat: true,
      verbose: true,
      locale: 'zh_CN'
    })
  } catch (error) {
    return error
  }
})

const handleChange = (data: any) => {
  const { mode, ...args } = data
  form.value.type = mode
  form.value.params = { ...args }
}

const onConfirm = () => {
  emit('confirm', form.value);
}

const onCancel = () => {
  emit('cancel');
}
</script>

<style lang="scss" scoped>
.el-form-item__content {
  width: 200px;
}

.error {
  color: red;
}
</style>