import { createWebHistory, createRouter } from 'vue-router';
import Layout from '@/extension/layout/index.vue';
// 路由守卫
import guarder from '@/helper/guarder.js';

// 公共路由
export const constantRoutes = [
    {
        path: '/',
        name: '/',
        component: Layout,
        children: [
            {
                path: '',
                name: 'index',
                meta: { title: '首页' },
                component: () => import('@/views/index.vue'),
            },
            {
                path: 'vehicle/information',
                name: 'information',
                meta: { title: '车辆信息' },
                component: () => import('@/views/vehicle/information.vue'),
            },
            {
                path: 'vehicle/archives',
                name: 'archives',
                meta: { title: '车辆信息' },
                component: () => import('@/views/vehicle/archives.vue'),
            },
            {
                path: 'people/information',
                name: 'people_information',
                meta: { title: '人员信息' },
                component: () => import('@/views//people/information.vue'),
            },
            {
                path: 'people/collection',
                name: 'people_collection',
                meta: { title: '人员采集' },
                component: () => import('@/views/people/collection.vue'),
            },
            {
                path: 'people/archives',
                name: 'people_archives',
                meta: { title: '人员档案' },
                component: () => import('@/views/people/archives.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: '/login',
        component: () => import('../extension/login/login.vue'),
        meta: { title: '登陆页面' },
    },
];

const router = createRouter({ history: createWebHistory(), routes: constantRoutes });

guarder(router);

export default router;
