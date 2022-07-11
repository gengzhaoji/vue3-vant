/**
 *  Axios 实例, ajax请求底层方法
 *  官方文档 [https://github.com/axios/axios]{@link https://github.com/axios/axios}
 *  @module utils/axios
 */

import axios from 'axios';

import date from '@u/date';

import qs from 'qs';

// vuex数据
import user from '@/store/user';

import router from '@/router';

import { compile } from 'path-to-regexp';

import { getHost } from './url';

import { downloadBlob } from '@u/download';

// AJAX_SUCCESS
import { AJAX_SUCCESS } from '@/config';

import { Toast } from 'vant';

import { nextTick } from 'vue';

// 请求错误自定义
const errorCode = {
    401: '认证失败，无法访问系统资源',
    403: '当前操作没有权限',
    404: '访问资源不存在',
    default: '系统未知错误,请反馈给管理员',
};

// 编译过的url缓存 全局loading
let pathToRegexCaches = {},
    loadingInstance;

// 请求存储
const axiosPromiseArr = new Map();

/**
 * Axios实例化参数选项对象
 * @const
 * @type {object}
 * @property {object} headers 请求头对象对象，默认：null
 * @property {number} timeout 超时时间，默认：0， 不限制
 * @property {boolean} withCredentials 是否带上验证信息， 默认：true
 * @property {number} maxContentLength 限制最大发送内容长度，默认：-1 不限制
 * @property {strin} baseURL 默认请求拼接的前缀
 */
const service = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // ie浏览器get请求兼容问题
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '0',
    },
    timeout: 0,
    withCredentials: false,
    responseType: 'json',
    maxContentLength: -1,
    baseURL: import.meta.env.VITE_APP_BASE_API,
});

/**
 * 判断是否为JSON格式
 * @param {*} str
 * @returns
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}

/**
 * 创建缓存key, 由请求url、类型、参数、发送数据构成的标识符
 * @param {string} url 请求url
 * @param {string} type 请求类型
 * @param {object} params url参数对象
 * @param {object} data 请求数据
 * @return {string}
 */
function createKey(config) {
    const { url, method, params = '', data = '' } = config;
    return encodeURIComponent([url, method, isJSON(params) ? params : JSON.stringify(params), isJSON(data) ? data : JSON.stringify(data)].join(','));
}

/**
 * 在请求发送数据之前，对发送数据进行转换
 */
service.interceptors.request.use(
    (config) => {
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false,
            { token, une } = user();
        if (token && !isToken) {
            config.headers['Authorization'] = 'Bearer ' + token; // 让每个请求携带自定义token
        }

        // 创建全局loading，排除不需要loading的接口
        if (axiosPromiseArr.size === 0 && !['/auth/login', '/auth/logout', '/captcha/image', '/system/user/profile/info', '/home/routers'].includes(config.url)) {
            loadingInstance = '';
        }

        // 联合登陆携带une
        if (une) config.headers['une'] = une;

        /**
         * 请求未完成时保存取消的cancelToken
         */
        config.cancelToken = new axios.CancelToken((cancel) => {
            // 判断是否重复
            const key = createKey(config);
            if (axiosPromiseArr.has(key)) {
                cancel();
            } else {
                axiosPromiseArr.set(key, cancel);
            }
        });

        // get请求参数转换
        if (config.method === 'get') config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'comma' });

        return config;
    },
    (error) => {
        ElMessage.error({ message: '加载超时' });
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        // 请求成功后从正在进行的请求数组中删除
        const key = createKey(res.config);
        if (axiosPromiseArr.has(key)) axiosPromiseArr.delete(key);
        // 全部请求结束关闭loading
        if (axiosPromiseArr.size === 0) {
            nextTick(() => {
                loadingInstance?.close();
            });
        }
        // 未设置状态码则默认成功状态
        const code = (res.data && res.data.code) || AJAX_SUCCESS;

        // 获取错误信息
        const msg = errorCode[code] || (res.data && res.data.msg) || errorCode['default'];

        if ([401, 418].includes(code)) {
            cancelFn();
            if (code === 418) {
                user().LogOutSET();
                router.replace('/login');
                Toast.fail(msg);
            }
            if (code === 401) {
                user()
                    .LogOut()
                    .then(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath,
                            },
                        });
                    });
                Toast.fail(msg);
            }
        } else if (code !== 200) {
            Toast.fail(msg);
            return Promise.reject(res.data);
        } else {
            return Promise.resolve(res.data);
        }
    },
    // 服务器状态码不是200的情况
    (error) => {
        let { message } = error;
        if (message) {
            if (message == 'Network Error') {
                message = '后端接口连接异常';
            } else if (message.includes('timeout')) {
                message = '系统接口请求超时';
            } else if (message.includes('Request failed with status code')) {
                message = '系统接口' + message.substr(message.length - 3) + '异常';
            }
            Toast.fail(message);
            cancelFn();
        }
        return Promise.reject(error);
    }
);

/**
 * 请求系统错误时 取消所有正在进行的请求函数
 * @returns
 */
export function cancelFn() {
    for (let cancel of axiosPromiseArr.values()) {
        cancel();
    }
    axiosPromiseArr.clear();
    // 关闭全局loading
    loadingInstance?.close();
}

/**
 * Axios 实例
 * @example
 *
 *  // 基础用法
 *  import axios from '@/utils/axios'
 *  axios({
 *    method: 'post',
 *    url: '/user/123',
 *    data: {
 *      firstName: 'Fred',
 *      lastName: 'Flintstone'
 *    }
 *  })
 *
 *  @example
 *
 *  // 实例方法
 *  axios.request(config)
 *  axios.get(url[, config])
 *  axios.delete(url[, config])
 *  axios.head(url[, config])
 *  axios.options(url[, config])
 *  axios.post(url[, data[, config]])
 *  axios.put(url[, data[, config]])
 *  axios.patch(url[, data[, config]])
 */

/**
 *
 * @param {object} options
 * 请求配置参数
 * url请求地址必须传
 * method请求方法默认为get方法
 * data请求参数
 */
export default function (options) {
    // 处理默认参数，传参和默认参数合并
    let config = Object.assign({ method: 'get' }, options || {});

    // 必须要传入url
    if (!config.url) {
        throw new Error('ajax url is required!');
    }

    let { url, method, data } = config;
    // page接口默认添加needCount：1，需要总数
    if (config.url.split('/').pop() === 'page') {
        data = Object.assign({ needCount: 1 }, data || {});
    }
    // export接口默认responseType = 'blob'
    if (config.url.split('/').pop() === 'export') {
        config.responseType = 'blob';
    }

    // 从缓存中提取已经解析过的url
    // url 支持参数信息，如： /api/path/:id
    // 这种情况需要把url解析成一个正则表达式，然后再跟参数匹配组成一个真正要请求的url
    let compileCache = pathToRegexCaches[url];
    let host = getHost(url);
    if (!compileCache) {
        // 先排除host段，因为host段的端口号与参数写法有冲突
        compileCache = pathToRegexCaches[url] = compile(url.replace(host, ''), {});
    }
    // 出去传输过来的url参数，并补回host段
    url = host + compileCache(config.params);

    delete config.url;
    delete config.method;
    delete config.data;
    delete config.params;

    const http = ['get', 'head', 'delete'].includes(method)
        ? service[method](url, {
              ...config,
              params: data,
          })
        : service[method](url, data, config);

    return http;
}
