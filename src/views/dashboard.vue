<template></template>

<script setup lang="ts" name="dashboard">
// import imgurl from '../assets/img/img.jpg';

const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';
</script>

<style lang="scss" scoped></style>
