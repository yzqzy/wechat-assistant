<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-menu-item :index="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
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
        index: '/contact',
        title: '联系人管理',
    },
    {
        icon: 'ChatSquare',
        index: '/chatroom',
        title: '群聊管理',
    },
    {
        icon: 'Tools',
        index: '3',
        title: '工具集',
        subs: [
            {
                index: '/ocr',
                title: '图像文字识别',
            },
        ]
    },
    {
        icon: 'CoffeeCup',
        index: '/donate',
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
