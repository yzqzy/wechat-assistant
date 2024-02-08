<template>
  <!-- 消息类型选择 -->
  <el-radio-group v-if="multi" class="radio-group" v-model="mode">
    <el-radio-button v-for="item in modes" :key="item.value" :label="item.value">{{ item.label
    }}</el-radio-button>
  </el-radio-group>

  <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left" label-width="120px">
    <!-- 文本消息 -->
    <el-form-item v-if="mode === 'text'" label="内容" prop="message">
      <el-input type="textarea" placeholder="请输入消息内容" v-model="form.message" />
    </el-form-item>

    <!-- 图片消息 -->
    <el-form-item v-else-if="mode === 'image'" label="图片">
      <el-upload class="avatar-uploader" action="" :before-upload="beforeAvatarUpload">
        <template v-if="fileList.length">
          <img v-for="(file, index) in fileList" :key="index" :src="file.url" class="avatar" />
        </template>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>

    <!-- 文件消息 -->
    <el-form-item v-else-if="mode === 'file'" label="文件">
      <el-upload class="file-uploader" action="" :before-upload="beforeFileUpload">
        <template v-if="fileList.length">
          <p v-for="(file, index) in fileList" :key="index" :src="file.url" class="name">{{ file.name }}</p>
        </template>
        <el-button v-else plain>Click to upload</el-button>
      </el-upload>
    </el-form-item>

    <!-- 公众号消息 -->
    <template v-if="mode === 'wx_article'">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章名称" />
      </el-form-item>
      <el-form-item label="文章地址" prop="url">
        <el-input v-model="form.url" placeholder="请输入文章地址" />
      </el-form-item>
      <el-form-item label="缩略图地址" prop="thumb_url">
        <el-input v-model="form.thumb_url" placeholder="请输入缩略图地址" />
      </el-form-item>
      <el-form-item label="摘要" prop="digest">
        <el-input v-model="form.digest" placeholder="请输入摘要" />
      </el-form-item>
    </template>

    <!-- 发送按钮 -->
    <slot name="footer">
      <el-form-item>
        <el-button type="primary" @click="saveEdit(ruleForm)">发 送</el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps, UploadRawFile } from 'element-plus';
import { ref, watchEffect } from 'vue';

import { MessageType, messageMapping } from '../../api'

const props = defineProps<{
  mode?: MessageType,
  multi?: boolean,
  form?: any,
}>();

const emit = defineEmits<{
  (e: 'confirm', _: any): void,
  (e: 'change', _: any): void,
}>()

const modes = ref(Object.keys(messageMapping).map((k) => {
  const key = k as MessageType
  return {
    label: messageMapping[key],
    value: key
  }
}))

const ruleForm = ref<FormInstance>();
const rules = ref<FormRules>({
  message: [
    { required: true, message: '请输入消息内容', trigger: 'blur' },
  ],
  title: [
    { required: true, message: '请输入文章名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入文章地址', trigger: 'blur' },
  ],
  thumb_url: [
    { required: true, message: '请输入缩略图地址', trigger: 'blur' },
  ],
  digest: [
    { required: true, message: '请输入摘要', trigger: 'blur' },
  ],
});

const mode = ref(props.mode || MessageType.TEXT);
const form = ref(props.form || {
  message: '',
  image_url: '',
  file_url: '',

  title: '',
  url: '',
  thumb_url: '',
  digest: '',
});


const clean = () => {
  if (mode.value !== MessageType.WX_ARTICLE) {
    form.value.title = '';
    form.value.url = '';
    form.value.thumb_url = '';
    form.value.digest = '';
  }
  if (mode.value != MessageType.IMAGE) {
    form.value.image_url = '';
  }
  if (mode.value != MessageType.FILE) {
    form.value.file_url = '';
  }
  if (mode.value !== MessageType.TEXT) {
    form.value.message = '';
  }
}

watchEffect(() => {
  clean()
  emit('change', {
    mode: mode.value,
    ...form.value
  })
})

const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate().then(() => {
    emit('confirm', {
      mode: mode.value,
      ...form.value
    });
  }).catch(() => { })
};

const fileList = ref<UploadProps['fileList']>([]);
const addFile = (rawFile: UploadRawFile): void => {
  fileList.value = [{
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    raw: rawFile,
    status: 'success',
    uid: new Date().getTime()
  }];
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  addFile(rawFile)
  form.value.image_url = rawFile.path
  return false;
};
const beforeFileUpload: UploadProps['beforeUpload'] = rawFile => {
  addFile(rawFile)
  form.value.file_url = rawFile.path
  return false;
};
</script>

<style lang="scss" scoped>
.radio-group {
  margin-bottom: 30px;
}

.file-uploader {
  .el-upload {
    border: 1px solid var(--el-border-color);
  }

  .name {
    width: 220px;
    padding: 5px 10px;
  }
}
</style>
