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
      <div>
        <el-upload class="avatar-uploader" action="" :before-upload="beforeAvatarUpload" multiple>
          <el-icon class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="avatar-box" v-if="fileList.length">
          <div v-for="(file, index) in fileList" :key="index" class="avatar">
            <el-icon class="delete" size="18" @click="handleRemoveFile(index)">
              <CircleClose />
            </el-icon>
            <el-image :src="file.url" fit="contain" class="img" :preview-src-list="fileList.map(item => item.url)" />
          </div>
        </div>
      </div>
    </el-form-item>

    <!-- 文件消息 -->
    <el-form-item v-else-if="mode === 'file'" label="文件">
      <div>
        <el-upload class="file-uploader" action="" :before-upload="beforeFileUpload" multiple>
          <el-button plain>Click to upload</el-button>
        </el-upload>
        <div class="file-box" v-if="fileList.length">
          <p v-for="(file, index) in fileList" :key="index" :src="file.url" class="name">{{ file.name.length > 20 ?
    `${file.name.slice(0, 17)}...` : file.name }}
            <el-icon class="delete" size="18" @click="handleRemoveFile(index)">
              <CircleClose />
            </el-icon>
          </p>
        </div>
      </div>
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
        <el-button :disabled="disabled" type="primary" @click="saveEdit(ruleForm)">发 送</el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps, UploadRawFile } from 'element-plus';
import { computed, ref, watchEffect, watch } from 'vue';

import { MessageType, messageMapping } from '@/api'

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

const disabled = ref(false);

const mode = ref(props.mode || MessageType.TEXT);
const form = ref(props.form || {
  message: '',
  image_url: [],
  file_url: [],

  title: '',
  url: '',
  thumb_url: '',
  digest: '',
});


watch(mode, () => {
  fileList.value = [];
  form.value.image_url = [];
  form.value.file_url = [];
})

const clean = () => {
  if (mode.value !== MessageType.WX_ARTICLE) {
    form.value.title = '';
    form.value.url = '';
    form.value.thumb_url = '';
    form.value.digest = '';
  }
  if (mode.value != MessageType.IMAGE) {
    form.value.image_url = [];
  }
  if (mode.value != MessageType.FILE) {
    form.value.file_url = [];
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
    disabled.value = true;

    emit('confirm', {
      mode: mode.value,
      ...form.value
    });

    setTimeout(() => {
      disabled.value = false;
    }, 1000)
  }).catch(() => { })
};

const fileList = ref<UploadProps['fileList']>([]);
const cache = computed(() => new Set(fileList.value.map(f => f.raw)))

const handleRemoveFile = (index: number) => {
  fileList.value.splice(index, 1);

  if (mode.value === MessageType.IMAGE) {
    form.value.image_url.splice(index, 1);
  } else if (mode.value === MessageType.FILE) {
    form.value.file_url.splice(index, 1);
  }
}

const addFile = (rawFile: UploadRawFile, field: 'image_url' | 'file_url'): void => {
  if (cache.value.has(rawFile)) return;

  fileList.value = [...fileList.value, {
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    raw: rawFile,
    status: 'success',
    uid: new Date().getTime()
  }];
  form.value[field] = [...form.value[field], rawFile.path]
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  addFile(rawFile, 'image_url')
  return false;
};
const beforeFileUpload: UploadProps['beforeUpload'] = rawFile => {
  addFile(rawFile, 'file_url')
  return false;
};
</script>

<style lang="scss" scoped>
.radio-group {
  margin-bottom: 30px;
}

.avatar-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 240px;
  overflow-y: auto;

  .avatar {
    position: relative;
    display: block;
    width: 120px;
    height: 120px;
    border: 1px dashed var(--el-border-color);
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    box-sizing: border-box;

    .delete {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 999;
      cursor: pointer;
    }

    .img {
      width: 100%;
      height: 100%;
    }
  }
}

.file-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 240px;
  overflow-y: auto;

  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 220px;

    .delete {
      margin-left: 2px;
    }
  }
}
</style>
