import { createRouter, createWebHashHistory } from 'vue-router'
import guarder from '../helper/guarder'

const routes = [
  {
    path: "/login",
    name: "login",
    meta: {},
    redirect: "",
    component: () => import('@/views/login')
  },
  {
    path: "",
    name: "index",
    meta: {},
    redirect: "",
    component: () => import('@/views/index')
  },
  {
    path: "/vehicle/information",
    name: "information",
    meta: {},
    redirect: "",
    component: () => import('@/views/vehicle/information')
  },
  {
    path: "/vehicle/archives",
    name: "archives",
    meta: {},
    redirect: "",
    component: () => import('@/views/vehicle/archives')
  },
  {
    path: "/people/information",
    name: "people_information",
    meta: {},
    redirect: "",
    component: () => import('@/views//people/information')
  },
  {
    path: "/people/collection",
    name: "people_collection",
    meta: {},
    redirect: "",
    component: () => import('@/views/people/collection')
  },
  {
    path: "/people/archives",
    name: "people_archives",
    meta: {},
    redirect: "",
    component: () => import('@/views/people/archives')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * 注入路由守卫
 */
guarder(router)

export default router
