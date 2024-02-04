<template>
  <div class="cron-edit-form">
    <el-form :model="form" label-width="120px" label-position="left">
      <el-form-item label="任务名称">
        <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <message-form multi :mode="form.type" :form="form.params" @change="handleChange">
          <template v-slot:footer><span></span></template>
        </message-form>
      </el-form-item>

      <!-- 执行模式 -->
      <el-form-item label="执行模式">
        <el-radio-group v-model="form.mode">
          <el-radio-button label="normal">普通模式</el-radio-button>
          <el-radio-button label="custom">自定义模式</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 执行模式 custom -->
      <el-form-item v-if="form.mode === 'custom'" label="cron表达式">
        <el-input v-model="form.cron" placeholder="请输入cron表达式"></el-input>
        <p class="cron-desc">执行时间: {{ cronDesc }}</p>
      </el-form-item>
      <!-- 执行模式 normal -->
      <form :model="form.params" class="inner-form" v-else>
        <el-form-item label="生成频率">
          <el-select v-model="form.params.frequency">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成时间">
          <el-select v-if="form.params.frequency === 'weekly'" v-model="form.params.week">
            <el-option v-for="i in 7" :label="weekConverter(i - 1)" :value="i" :key="i" />
          </el-select>
          <el-select v-if="form.params.frequency === 'monthly'" v-model="form.params.day">
            <el-option v-for="i in 28" :label="`${i}号`" :value="i" :key="i" />
          </el-select>
          <el-select v-model="form.params.time">
            <el-option v-for="i in 24" :label="`${i}点`" :value="i" :key="i" />
          </el-select>
        </el-form-item>
        <p class="cron-desc">执行时间: {{ cronDesc }}</p>
      </form>

      <el-form-item label="接收者">
        <el-select v-model="form.receiver_ids" multiple filterable placeholder="请选择接收者">
          <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.enabled"></el-switch>
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
import MessageForm from '../../components/service/MessageForm.vue';
import { CronTask, CronTaskMode } from '../../store/task'
import { MessageType, Contact } from '../../api';
import { formatCron, getRandomId } from '../../utils/tools';
import { useCron } from './useCron'

const props = defineProps<{
  data: Contact[]
  task?: CronTask
}>()

const emit = defineEmits<{
  (e: 'confirm', _: CronTask): void
  (e: 'cancel'): void
}>()

const { genCron, weekConverter } = useCron()

const form = ref<CronTask>(props.task || {
  uid: getRandomId(),
  mode: CronTaskMode.NORMAL,
  type: MessageType.TEXT,
  name: '',
  receiver_ids: [],
  cron: '',
  enabled: false,
  params: {
    frequency: 'daily',
    week: 1,
    day: 1,
    time: 24
  }
});
const cronDesc = computed(() => {
  try {
    if (form.value.mode === CronTaskMode.CUSTOM) {
      if (!form.value.cron) return ''
      return formatCron(form.value.cron)
    }
    if (form.value.params.frequency && form.value.params.time) {
      form.value.cron = genCron(form.value.params)
      return formatCron(form.value.cron)
    }
    return ''
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
.cron-desc {
  color: #909399;
}

.el-form-item__content {
  width: 200px;
}

:deep(.inner-form) {
  padding-left: 120px;
  padding-bottom: 20px;
  box-sizing: border-box;

  .el-select {
    width: 300px;
    margin-right: 10px;
  }

  .el-form-item__content {
    flex-direction: row;

    .el-select {
      width: 120px;
    }
  }
}
</style>