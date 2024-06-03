<template>
  <div class="contact-tag-form">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" label-position="left">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入标签名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="wx_ids">
        <el-select v-model="form.wx_ids" clearable multiple filterable placeholder="请选择联系人">
          <el-option v-for="item in data" :key="item.wxid" :label="item.nickname" :value="item.wxid" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :rows="2" type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.enabled"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm(ruleForm)">{{ props.contactTag ? '保存' : '新增' }}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { Contact } from '@/api';
import { ContactTag } from '@/store/contact-tag';
import { getRandomId } from '@/utils/tools';

const props = defineProps<{
  data: Contact[],
  contactTag: ContactTag | undefined
}>()

const emit = defineEmits<{
  (e: 'confirm', _: ContactTag): void
  (e: 'cancel'): void
}>()

const ruleForm = ref<FormInstance>()
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  wx_ids: [
    { type: 'array', required: true, message: '请选择联系人', trigger: 'change' }
  ]
})

const form = ref<ContactTag>(_.cloneDeep(props.contactTag) || {
  uid: getRandomId(),
  name: '',
  wx_ids: [],
  enabled: true,
  remark: ''
});


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