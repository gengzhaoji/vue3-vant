<template>
    <div id="refApp">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script setup name="App">
/**
 * 全局挂载方法的注入和使用
 */
let {
    appContext: {
        app: {
            config: {
                globalProperties: { $$confirm, $confirm, $router, $store, clone, cloneDeep, getImgUrl, msgError, msgInfo, msgSuccess, resetForm },
            },
        },
    },
} = getCurrentInstance();

provide('$vm', {
    $$confirm,
    $confirm,
    $router,
    $store,
    clone,
    cloneDeep,
    getImgUrl,
    msgError,
    msgInfo,
    msgSuccess,
    resetForm,
});
</script>

<style scoped lang="scss">
#refApp {
    width: 100%;
    height: 100%;
}
</style>
