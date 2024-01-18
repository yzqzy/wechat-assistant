<template>
  <el-form ref="formRef" label-position="left" :model="form" label-width="120px">
    <el-form-item v-if="mode === 'text'" label="内容" prop="message">
      <el-input type="textarea" v-model="form.message"></el-input>
    </el-form-item>
    <el-form-item v-if="mode === 'image'" label="图片" prop="image_url">
      <el-upload class="avatar-uploader" action="" :before-upload="beforeAvatarUpload">
        <template v-if="fileList.length">
          <img v-for="(file, index) in fileList" :key="index" :src="file.url" class="avatar" />
        </template>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">发 送</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, UploadProps } from 'element-plus';
import { ref } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: 'text' // or 'image' or 'file'
  },
  data: {
    type: Object,
    required: true
  },
  edit: {
    type: Boolean,
    required: false
  },
  confirm: {
    type: Function,
    required: true
  }
});

const defaultData = {
  mode: props.mode,
  message: '',
  image_url: [],
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    props.confirm(form.value);
  });
};


const fileList = ref<UploadProps['fileList']>([]);

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }

  fileList.value = [{
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    raw: rawFile,
    status: 'ready',
    uid: new Date().getTime()
  }];
  form.value.image_url = rawFile.path

  return false;
};
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .avatar {
    width: 178px;
    height: 178px;
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
