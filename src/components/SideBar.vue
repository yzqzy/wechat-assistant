<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened router>
            <template v-for="route in mainRoutes">
                <template v-if="route.children">
                    <el-sub-menu :index="route.path" :key="route.path">
                        <template #title>
                            <el-icon>
                                <component :is="route.meta?.icon"></component>
                            </el-icon>
                            <span>{{ route.meta?.title }}</span>
                        </template>
                        <template v-for="subRoute in route.children">
                            <el-menu-item :index="route.path + '/' + subRoute.path">
                                {{ subRoute.meta?.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="route.path" :key="route.path">
                        <el-icon>
                            <component :is="route.meta?.icon"></component>
                        </el-icon>
                        <template #title>{{ route.meta?.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { mainRoutes } from '@/router';

const route = useRoute();
const onRoutes = computed(() => {
    return route.path.split('/')[1];
});

</script>

<style lang="scss" scoped>
.sidebar {
    position: absolute;
    left: 0;
    top: 90px;
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
