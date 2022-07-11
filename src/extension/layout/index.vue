<template>
    <div id="layout">
        <!-- 开启顶部安全区适配 -->
        <van-nav-bar safe-area-inset-top />
        <!-- 内容区 -->
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in" appear>
                <keep-alive :include="$store.guarder.cachedComponents">
                    <component :is="Component" :key="$route.path" />
                </keep-alive>
            </transition>
        </router-view>
        <!-- 开启底部安全区适配 -->
        <van-number-keyboard safe-area-inset-bottom />
    </div>
</template>

<script setup name="layout"></script>

<style lang="scss" scoped>
#layout {
    height: 100%;
    width: 100%;
    display: flex;
}
</style>
