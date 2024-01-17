<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened router>
            <template v-for="item in items">
                <el-menu-item :index="item.index">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'HomeFilled',
        index: '/dashboard',
        title: '看板',
    },
    {
        icon: 'User',
        index: '/403',
        title: '好友管理',
    },
    {
        icon: 'ChatSquare',
        index: '/403',
        title: '群聊管理',
    },
    {
        icon: 'CoffeeCup',
        index: '/403',
        title: '支持作者',
    },
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

</script>

<style lang="scss" scoped>
.sidebar {
    position: absolute;
    left: 0;
    top: 80px;
    bottom: 0;
    display: flex;
    width: 306px;
    overflow-y: scroll;
    padding: 20px 28px 20px 28px;
    box-sizing: border-box;

    .sidebar-el-menu:not(.el-menu--collapse) {
        flex: 1;
    }

    &::-webkit-scrollbar {
        width: 0;
    }

    .sidebar>ul {
        height: 100%;
    }

    .el-menu {
        border: none;

        .el-menu-item {
            border-radius: 14px;
            margin-bottom: 10px;
        }
    }

    .el-sub-menu {
        :deep(.el-sub-menu__title) {
            border-radius: 14px !important;
        }
    }
}
</style>
