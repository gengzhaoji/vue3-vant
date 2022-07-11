import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

// import { homeRouters } from '@/api/public';
import Layout from '@/extension/layout/index.vue';
import ParentView from '@/extension/ParentView/index.vue';
import router from '@/router';
import { Toast } from 'vant';
import { clone } from '@u/convert';
import { find } from '@u/tree';

// 处理解决import动态加载组件 打包部署为空的问题
const modules = import.meta.glob('../views/**/*.vue');

export default defineStore({
    id: 'guarder', // id必填，且需要唯一
    state: () => ({
        cachedComponents: [],
        Menus: [],
        RoutersList: [],
        addRouter: [],
    }),
    actions: {
        // 生成路由
        GenerateRoutes() {
            return new Promise((resolve) => {
                // 向后端请求路由数据
                homeRouters().then((res) => {
                    if (res?.data?.length) {
                        const { Menus, Routes } = filterAsyncRouter(clone(res.data));
                        this.Menus = Menus;
                        // 添加首页路由、404路由
                        this.addRouter = [
                            {
                                path: '/',
                                name: '/',
                                redirect: find(Menus, true, (item) => !item.children).path,
                                meta: {
                                    hideTabs: true,
                                },
                            },
                            ...Routes,
                            {
                                path: '/:pathMatch(.*)',
                                name: '/:pathMatch(.*)',
                                redirect: '/404',
                                meta: {
                                    hideTabs: true,
                                },
                            },
                        ];
                        this.addRouter.forEach((item) => {
                            router.addRoute(item);
                        });
                        this.RoutersList = [...new Set(router.getRoutes().map((item) => item.path))];
                        resolve();
                    } else {
                        Toast('该角色用户暂无可视页面，请管理员分配角色权限！');
                    }
                });
            });
        },
    },
});

// 遍历后台传来的路由字符串，转换为组件对象  动态添加路由
function filterAsyncRouter(data) {
    let RoutesData = Object.create(null),
        MenusData = Object.create(null),
        Routes = [],
        Menus = [];
    // 数据转换为对象
    data.forEach((item) => {
        /**
         * id 数据ID
         * parentId 父类ID
         * component .vue文件路径
         * layoutPath 布局路径 layoutPath == undefined为默认布局，layoutPath == 'ParentView'全屏布局，modules[`../views/${layoutPath}.vue`]自定义页面布局
         * icon 菜单图标
         * menuName 菜单名称
         * menuType 菜单类型  M——目录、C——菜单
         * path 菜单路由
         * visible 是否显示
         * isCache 是否缓存
         * orderNum 排序
         */
        let { id, parentId, component, layoutPath, icon, menuName, menuType, path, visible, isCache, orderNum } = item;
        if (parentId == '0' && menuType == 'M' && !component) {
            // 一层目录页面默认布局
            component = shallowRef(Layout);
        } else if (parentId !== '0' && menuType == 'M' && !component) {
            // 非第一层目录布局为 ParentView
            component = shallowRef(ParentView);
        } else {
            component = modules[`../views/${component}.vue`] || '';
        }
        if (component == '') return;
        // 无目录菜单
        if (parentId == '0' && menuType == 'C') {
            // 布局 layoutPath为默认布局，layoutPath == 'ParentView'全屏布局，modules[`../views/${layoutPath}.vue`]自定义页面布局
            let layout = !layoutPath ? shallowRef(Layout) : layoutPath == 'ParentView' ? shallowRef(ParentView) : modules[`../views/${layoutPath}.vue`];
            let Path = !/^(\/)/.test(path) ? `/${path}` : path;
            RoutesData[id] = {
                path: Path,
                name: Path,
                component: layout,
                parentId: '0',
                children: [
                    {
                        component: component,
                        hidden: visible == 1,
                        meta: { title: menuName, icon, keepAlive: isCache == 1 },
                        name: '',
                        path: '',
                        orderNum,
                        id,
                    },
                ],
            };
        } else {
            let Path = parentId == '0' ? (!/^(\/)/.test(path) ? `/${path}` : path) : path;
            RoutesData[id] = {
                component: component,
                hidden: visible == 1,
                meta: { title: menuName, icon, keepAlive: isCache == 1 },
                name: Path,
                path: Path,
                parentId,
                orderNum,
                id,
            };
        }
        // 左边菜单数据
        if (visible !== 1) {
            let Path = parentId == '0' ? (!/^(\/)/.test(path) ? `/${path}` : path) : path;
            MenusData[id] = {
                component: component,
                hidden: visible == 1,
                meta: { title: menuName, icon, keepAlive: isCache == 1 },
                name: Path,
                path: Path,
                parentId,
                orderNum,
                id,
            };
        }
    });
    // 组成路由树形结构
    for (let key in RoutesData) {
        let item = RoutesData[key];
        if (item.parentId == '0') {
            Routes.push(item);
        } else {
            let parent = RoutesData[item.parentId];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                item.path = `${parent.path}/${item.path}`;
                item.name = item.path;
                parent.children.push(item);
            }
        }
    }
    // 组成菜单树形结构
    for (let key in MenusData) {
        let item = MenusData[key];
        if (item.parentId == '0') {
            Menus.push(item);
            Menus.sort((a, b) => {
                return a.orderNum - b.orderNum;
            });
        } else {
            let parent = MenusData[item.parentId];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                item.path = `${parent.path}/${item.path}`;
                parent.children.push(item);
                parent.children.sort((a, b) => {
                    return a.orderNum - b.orderNum;
                });
            }
        }
    }
    return { Menus, Routes };
}
