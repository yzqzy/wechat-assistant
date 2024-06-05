<template>
  <div class="trigger-edit-form">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" label-position="left">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.type">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showKeywordField" label="关键词">
        <el-input v-model="form.keyword" placeholder="请输入触发关键词（默认全部）"></el-input>
      </el-form-item>
      <el-form-item label="观察者" prop="observer_ids">
        <el-select v-model="form.observer_ids" multiple filterable placeholder="请选择观察者">
          <el-option v-for="item in contactData" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
        <p class="label-desc">观察者: 需要被监听的群聊或者联系人</p>
      </el-form-item>

      <el-form-item label="接收者">
        <el-form-item prop="receiver_mode">
          <el-select class="receiver-mode-select" style="width: 120px;" v-model="form.receiver_mode"
            placeholder="请选择接收者模式">
            <el-option label="普通模式" value="normal" />
            <el-option label="分组模式" value="group" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.receiver_mode === 'normal'" prop="receiver_ids">
          <el-select style="min-width: 200px;" v-model="form.receiver_ids" multiple filterable placeholder="请选择接收者">
            <el-option v-for="item in contactData" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
          </el-select>
        </el-form-item>
        <el-form-item v-else prop="receiver_tags">
          <el-select style="min-width: 200px;" v-model="form.receiver_tags" multiple filterable placeholder="请选择接收者分组">
            <el-option v-for="item in contactTagsData" :key="item.uid" :label="item.name" :value="item.uid" />
          </el-select>
        </el-form-item>
        <p class="label-desc">接收者: 当任务被触发时，将会发送给这些人</p>
      </el-form-item>


      <el-form-item label="是否启用">
        <el-switch v-model="form.enabled"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm(ruleForm)">{{ props.task ? '保存' : '新增' }}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script lang="ts" setup>
import _ from 'lodash';
import { computed, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { TriggerTask, TriggerTaskType, triggerMapping } from '@/store/trigger-task'
import { ContactTag } from '@/store/contact-tag';
import { Contact } from '@/api';
import { getRandomId } from '@/utils/tools';
import { SelectMode } from '@/typings';

const props = defineProps<{
  contactData: Contact[]
  contactTagsData: ContactTag[],
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

const ruleForm = ref<FormInstance>()
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  observer_ids: [
    { type: 'array', required: true, message: '请选择观察者', trigger: 'change' }
  ],
  receiver_ids: [
    { type: 'array', required: true, message: '请选择接收者', trigger: 'change' }
  ],
  receiver_tags: [
    { type: 'array', required: true, message: '请选择接收者分组', trigger: 'change' }
  ],
})

const normalizedTaskForm = (task: TriggerTask | undefined) => {
  if (!task) return
  return {
    ...task,
    receiver_mode: task.receiver_mode || SelectMode.NORMAL,
    receiver_ids: task.receiver_ids || [],
    receiver_tags: task.receiver_tags || [],
  }
}

const form = ref<TriggerTask>(_.cloneDeep(normalizedTaskForm(props.task)) || {
  uid: getRandomId(),
  type: TriggerTaskType.TEXT,
  name: '',
  observer_ids: [],
  receiver_mode: SelectMode.NORMAL,
  receiver_ids: [],
  receiver_tags: [],
  enabled: false,
  keyword: '',
  params: {}
});
const showKeywordField = computed(() => {
  return form.value.type === TriggerTaskType.TEXT || form.value.type === TriggerTaskType.FORWARD
})

const onConfirm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate().then(() => {
    emit('confirm', form.value);
  }).catch(() => { })
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

.el-select {
  &.receiver-mode-select {
    margin-right: 10px;
  }
}
</style>