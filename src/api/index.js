import axios from '@/utils/axios'

/**
 * 新增
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const personnelInsert = (data) => axios({ method: 'post', data, url: '/service/personnel/insert' })

/**
 * 查询
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const personnelQuery = (data) => axios({ data, url: '/service/personnel/query' })

/**
 * 查询
 * @param {object} [data] 发送键值对数据
 * @returns {promise}
 */
export const vehicleQuery = (data) => axios({ data, url: '/service/vehicle/query' })
