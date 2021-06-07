/**
 * 程序入口
 * @author 
 *
 */
import { createApp } from 'vue'

// 根组件
import App from './App.vue'

// 按需加载ui
import ui from './helper/ui'

// 公用组件
import commonPage from './helper/commonPage'

// 初始路由
import router from './router'

// 初始化store
import store from './store'

// 全局混入
import mixin from './helper/mixin'

// 解决移动端click时间 300ms 延迟的问题
import FastClick from 'fastclick'
FastClick.attach(document.body)

createApp(App).use(store).use(router).use(ui).use(commonPage).mixin(mixin).mount('#app')

