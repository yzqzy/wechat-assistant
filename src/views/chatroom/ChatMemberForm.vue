<template>
  <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left" label-width="120px">
    <!-- 添加成员 -->
    <el-form-item label="成员" prop="member_ids">
      <el-select v-model="form.member_ids" multiple filterable placeholder="请选择成员">
        <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
      </el-select>
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" @click="saveEdit(ruleForm)">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';
import { ref } from 'vue';

import { Contact } from '@/api';

defineProps<{
  data?: Contact[];
}>();

const emit = defineEmits<{
  (e: 'confirm', _: any): void
}>()


const ruleForm = ref<FormInstance>();
const rules = ref<FormRules>({
  member_ids: [
    { required: true, message: '请选择成员', trigger: 'change' },
  ],
})

const form = ref({
  member_ids: []
});

const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate().then(() => {
    emit('confirm', form.value);
  }).catch(() => { })
};
</script>

<style lang="scss"></style>
