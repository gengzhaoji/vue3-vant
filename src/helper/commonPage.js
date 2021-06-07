export default {
    install(App) {
        // 扫描当前目录下.vue结尾的文件，并扫描子文件夹
        const componentsContext = require.context('../components/common', true, /\.vue$/)
        // 枚举componentsContext对象组
        componentsContext.keys().forEach(component => {
            const componentConfig = componentsContext(component)
            const ctrl = componentConfig.default || componentConfig
            App.component(ctrl.name, ctrl)
        })
    }
}