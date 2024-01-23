<template>
  <div>
    <div class="title">
      <h2>图像文字识别 - OCR</h2>
    </div>
    <div class="container">
      <div class="upload">
        <el-upload class="avatar-uploader" action="" :before-upload="beforeAvatarUpload">
          <template v-if="fileList.length">
            <img v-for="(file, index) in fileList" :key="index" :src="file.url" class="avatar" />
          </template>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <div class="result-board">
        <div>识别结果:</div>
        <div class="result">
          <p v-html="result"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ocr">
import { ElMessage, UploadProps, UploadRawFile } from 'element-plus';
import { ref } from 'vue';

import { delaySync } from '../utils/tools';
import { ocr } from '../api';

const fileList = ref<UploadProps['fileList']>([]);
const result = ref<string>('');

const addFile = (rawFile: UploadRawFile): void => {
  fileList.value = [{
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    raw: rawFile,
    status: 'success',
    uid: new Date().getTime()
  }];
}

const handleSumit = async (image_url: string, count = 0) => {
  const res = await ocr(image_url);

  if (res.code === 0) {
    ElMessage.success('识别成功');
    result.value = res.data
    return
  }

  if (count < 3) {
    await delaySync()
    handleSumit(image_url, count + 1)
    return
  }

  ElMessage.error('识别失败');
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
  handleSumit(rawFile.path)
  return false;
};

</script>

<style lang="scss" scoped>
.title {
  padding-left: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.result-board {
  padding: 20px 0;

  div {
    margin-bottom: 10px;
  }

  .result {
    max-height: 60vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    p {
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      color: #333;
      white-space: pre-wrap;
    }
  }
}
</style>
