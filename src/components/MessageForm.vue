<template>
  <!-- 消息类型选择 -->
  <el-radio-group v-if="multi" class="radio-group" v-model="mode">
    <el-radio-button v-for="item in modes" :key="item.value" :label="item.value" :name="item.label">{{ item.label
    }}</el-radio-button>
  </el-radio-group>

  <el-form ref="formRef" label-position="left" :model="form" label-width="120px">
    <!-- 文本消息 -->
    <el-form-item v-if="mode === 'text'" label="内容" prop="message">
      <el-input type="textarea" placeholder="请输入消息内容" v-model="form.message" />
    </el-form-item>

    <!-- 图片消息 -->
    <el-form-item v-else-if="mode === 'image'" label="图片" prop="image_url">
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
    <el-form-item v-else-if="mode === 'file'" label="文件" prop="file_url">
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

    <!-- 确认按钮 -->
    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">发 送</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, UploadProps, UploadRawFile } from 'element-plus';
import { ref } from 'vue';

const props = defineProps({
  multi: {
    type: Boolean,
    default: true,
  },
  confirm: {
    type: Function,
    required: true
  }
});

const modes = ref([
  {
    label: '文本消息',
    value: 'text'
  },
  {
    label: '图片消息',
    value: 'image'
  },
  {
    label: '文件消息',
    value: 'file'
  },
  {
    label: '公众号消息',
    value: 'wx_article'
  }
])
const mode = ref('text');

const form = ref({
  message: '',
  image_url: '',
  file_url: '',

  app_name: '',
  user_name: '',
  title: '',
  url: '',
  thumb_url: '',
  digest: '',
});

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    props.confirm({
      mode: mode.value,
      ...form.value
    });
  });
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

<style lang="scss">
.radio-group {
  margin-bottom: 30px;
}

.el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.avatar-uploader {
  .avatar {
    width: 138px;
    height: 138px;
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  text-align: center;
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
