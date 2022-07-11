/**
 *  系统管理模块 api
 *  @module api/demo
 *  @author coder
 */

// API_HOST
import {
	API_HOST
} from '@/config'

// axios
import axios from '@u/axios'

/**
 * 新增菜单管理
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const addMenu = (data) => axios({
	method: 'post',
	data: data,
	url: API_HOST + '/system/menu/add'
})

/**
 * 更新菜单管理
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const editMenu = (data) => axios({
	method: 'put',
	data: data,
	url: API_HOST + '/system/menu/edit'
})

/**
 * 删除菜单管理
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const removeMenu = (data) => axios({
	method: 'delete',
	data: data,
	url: API_HOST + '/system/menu/remove'
})

/**
 * 获取菜单管理不分页列表
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const listMenu = (data) => axios({
	method: 'get',
	data: data,
	url: API_HOST + '/system/menu/list'
})

/**
 * 获取菜单管理单条信息详情
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const infoMenu = (data) => axios({
	method: 'get',
	data: data,
	url: API_HOST + '/system/menu/info'
})