<template>
  <div class="selection-box">
    <div>
      已选择：<span class="selected-count">{{ multipleSelection.length }}</span>
      <template v-if="multipleSelection.length">
        <el-button type="primary" size="small" class="btn" plain @click="handleShowDialog('multiple')">
          发消息
        </el-button>
        <el-button type="danger" size="small" class="btn" plain @click="handleClearSelection">
          清空
        </el-button>
      </template>
    </div>
    <div class="selected-content">
      <div class="selected-item" v-for="(item, index) in multipleSelection" :key="index"
        @click="handleRemoverSeclection(index)">
        <div class="info">
          <span>{{ item.nickname }}</span>
          <el-icon :size="18" class="icon">
            <CircleClose />
          </el-icon>
          <span v-if="index !== multipleSelection.length - 1">、</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T extends Contact | Room">
import type { Contact, Room } from '../../api'

defineProps<{
  multipleSelection: T[],
  handleShowDialog: (action: string | number) => void,
  handleClearSelection: () => void,
  handleRemoverSeclection: (index: number) => void
}>();
</script>

<style lang="scss" scoped>
.selection-box {
  margin-bottom: 20px;
  font-size: 14px;

  .selected-count {
    margin-right: 15px;
  }

  .selected-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 5px;

    .selected-item {
      .info {
        line-height: 24px;

        .icon {
          margin-left: 2px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
