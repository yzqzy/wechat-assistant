<template>
  <el-form ref="formRef" label-position="left" :model="form" label-width="120px">
    <!-- 添加成员 -->
    <el-form-item label="成员" prop="member_id">
      <el-select v-model="form.member_ids" multiple filterable placeholder="请选择成员">
        <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
      </el-select>
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus';
import { PropType, ref } from 'vue';

import { Contact } from '../../api';

const props = defineProps({
  data: {
    type: Array as PropType<Contact[]>,
    required: false
  },
  confirm: {
    type: Function,
    required: true
  }
});

const form = ref({
  member_ids: []
});

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    props.confirm(form.value);
  });
};
</script>

<style lang="scss"></style>
