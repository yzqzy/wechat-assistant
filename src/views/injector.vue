<template>
  <div class="injector-page">
    <div class="injector-tip">请参照说明文档，对微信进程进行注入。</div>
    <el-form ref="fromRef" label-position="left" :model="form" label-width="120px" class="injector-form">
      <div class="injector-item">
        <el-form-item label="进程名">
          <el-input v-model="form.processName" placeholder="请输入进程名"></el-input>
        </el-form-item>
      </div>
      <div class="injector-item">
        <el-form-item label="注入程序">
          <el-upload class="file-uploader" action="" :before-upload="beforeFileUploadWithInject">
            <template v-if="injectFile">
              <p :src="injectFile" class="name">{{ injectFile.name }}</p>
            </template>
            <el-button v-else plain>请选择注入程序</el-button>
          </el-upload>
        </el-form-item>
      </div>
      <div class="injector-item">
        <el-form-item label="DLL 文件">
          <el-upload class="file-uploader" action="" :before-upload="beforeFileUploadWithDll">
            <template v-if="dllFile">
              <p :src="dllFile" class="name">{{ dllFile.name }}</p>
            </template>
            <el-button v-else plain>请选择 dll 文件</el-button>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <div class="injector-btns">
      <el-button type="primary" class="injector-btn" size="large" @click="injectWxHelper">注入</el-button>
      <router-link to="/">
        <el-button type="warning" class="injector-btn" size="large">返回首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts" name="injector">
import { ref } from 'vue';
import { ElMessage, UploadProps, UploadRawFile } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

const fromRef = ref(null);
const form = ref({
  processName: 'WeChat.exe',
  injectPath: '',
  dllPath: '',
});

const injectWxHelper = () => {
  if (form.value.processName === '' || form.value.dllPath === '') {
    ElMessage.error('请填写所有必填项');
    return
  }

  window.ipcRenderer.send('inject-wxhelper', JSON.stringify(form.value));
  window.ipcRenderer.on('inject-wxhelper-reply', (_, msg) => {
    if (msg === 'ok') {
      ElMessage.success('注入成功, 即将返回首页');

      setTimeout(() => {
        router.replace('/');
      }, 1000);
      return
    }
    ElMessage.error('注入失败, 请重启微信并检查进程名是否正确');
  })
}

type UploadUserFile = Partial<Record<keyof UploadProps['fileList'][0], any>>

const createUploadUserFile = (rawFile: UploadRawFile) => {
  return {
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    raw: rawFile,
    status: 'success',
    uid: new Date().getTime()
  }
}

const injectFile = ref<UploadUserFile>();
const beforeFileUploadWithInject: UploadProps['beforeUpload'] = rawFile => {
  injectFile.value = createUploadUserFile(rawFile);
  form.value.injectPath = rawFile.path
  return false;
};

const dllFile = ref<UploadUserFile>();
const beforeFileUploadWithDll: UploadProps['beforeUpload'] = rawFile => {
  dllFile.value = createUploadUserFile(rawFile);;
  form.value.dllPath = rawFile.path
  return false;
};

</script>

<style lang="scss" scoped>
.injector-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;

  .injector-tip {
    font-size: 24px;
    color: #777;
  }

  .injector-form {
    max-width: 600px;
    margin: 30px auto;

    .injector-item {
      margin: 20px 0;
    }
  }

  .injector-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .injector-btn {
      margin: 0 10px;
    }

  }
}
</style>
