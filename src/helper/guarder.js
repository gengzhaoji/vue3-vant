/**
 * 路由导航守卫
 * @function
 * @param {VueRouter} router 路由实例
 */
// vuex数据
import user from '@/store/user';
import guarder from '@/store/guarder';
// 获取取消正在执行的函数逻辑
import { cancelFn } from '@u/axios';
import { isExternal } from '@u/url';

//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });
/**
 * 白名单
 */
export const whiteList = ['/login'];

export default function (router) {
    /**
     * 全局前置守卫
     */
    router.beforeEach((to, from, next) => {
        // 外链地址
        if (isExternal(to.path)) {
            window.open(to.path, '_block');
        } else {
            // 缓存页面
            if (to.meta?.keepAlive && !guarder().cachedComponents.includes(to.name)) {
                guarder().cachedComponents.push(to.name);
            }
            // 缓存页面--跳转非子页面清空缓存
            if (!(to.meta?.title?.includes(from.meta.title) && to.meta?.title?.includes('-')) && from.meta?.keepAlive) {
                const index = guarder().cachedComponents.indexOf(from.name);
                if (index !== -1) guarder().cachedComponents.splice(index, 1);
            }
            // 开启进度条
            NProgress.start();
            // 清除正在进行中的所有请求
            cancelFn();
            const store = user();
            // 联合登陆功能添加token
            if (to.query.pputoken) {
                store.token = to.query.pputoken;
                store.une = to.query.une;
                to.query = {};
            }
            next();
            // if (store.token) {
            //     /** 已经登录了存在token */
            //     if (!store.rolesGets.length) {
            //         // 判断当前用户是否已拉取完user_info信息
            //         store
            //             .GetInfo()
            //             .then((res) => {
            //                 guarder()
            //                     .GenerateRoutes()
            //                     .then(() => {
            //                         next({ ...to, replace: false }); // hack方法 确保addRoutes已完成
            //                     });
            //             })
            //             .catch(() => {
            //                 store.LogOut().then(() => {
            //                     next({
            //                         path: '/login',
            //                     });
            //                 });
            //             });
            //     } else {
            //         next(); // hack方法 确保addRoutes已完成
            //     }

            // } else {
            //     // 没有token
            //     if (whiteList.includes(to.path)) {
            //         // 在免登录白名单，直接进入
            //         next();
            //     } else {
            //         next({
            //             name: '/login',
            //             query: { redirect: to.fullPath },
            //         });
            //     }
            // }
        }
    });

    /**
     * 全局后置守卫
     */
    router.afterEach((to, from) => {
        NProgress.done();
        window.scroll(0, 0);
    });
}
