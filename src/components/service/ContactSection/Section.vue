<template></template>

<script lang="ts" setup>

const props = defineProps({
  multipleSelection: {
    type: Boolean,
    default: true,
  },
  confirm: {
    type: Function,
    required: true
  }
});
</script>