<template>
  <div class="trigger-edit-form">
    <el-form :model="form" label-width="120px" label-position="left">
      <el-form-item label="任务名称">
        <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.type">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="观察者">
        <el-select v-model="form.observer_ids" multiple filterable placeholder="请选择观察者">
          <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
        <p class="label-desc">观察者: 需要被监听的群聊或者联系人</p>
      </el-form-item>
      <el-form-item label="接收者">
        <el-select v-model="form.receiver_ids" multiple filterable placeholder="请选择接收者">
          <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
        <p class="label-desc">接收者: 当任务被触发时，将会发送给这些人</p>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.enabled"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm">{{ props.task ? '编辑' : '新增' }}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import { TriggerTask, TriggerTaskType, triggerMapping } from '../../store/trigger-task'
import { Contact } from '../../api';
import { getRandomId } from '../../utils/tools';

const props = defineProps<{
  data: Contact[]
  task?: TriggerTask
}>()

const types = ref(Object.keys(triggerMapping).map((k) => {
  const key = k as TriggerTaskType
  return {
    label: triggerMapping[key],
    value: key
  }
}))

const emit = defineEmits<{
  (e: 'confirm', _: TriggerTask): void
  (e: 'cancel'): void
}>()

const form = ref<TriggerTask>(_.cloneDeep(props.task) || {
  uid: getRandomId(),
  type: TriggerTaskType.RED_PACKET,
  name: '',
  observer_ids: [],
  receiver_ids: [],
  enabled: false,
  params: {}
});

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

.label-desc {
  color: #909399;
  font-size: 12px;
}
</style>../../store/cron-task