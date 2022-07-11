/**
 * 常用辅助函数
 * @module utils/util
 */

import { clone } from './convert';

/**
 * 防抖函数
 * @param {function} fn 事件处理函数
 * @param {number} [delay=20] 延迟时间
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @param {object} [context=this] 上下文对象
 * @returns {Function} 事件处理函数
 */
export function debounce(fn, delay = 20, isImmediate = false, context = this) {
    // 使用闭包，保存执行状态，控制函数调用顺序
    let timer;
    return function () {
        const _args = [].slice.call(arguments);
        clearTimeout(timer);
        const _fn = function () {
            timer = null;
            if (!isImmediate) fn.apply(context, _args);
        };
        // 是否滚动时立刻执行
        const callNow = !timer && isImmediate;
        timer = setTimeout(_fn, delay);
        if (callNow) fn.apply(context, _args);
    };
}

const raFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

/**
 * 动画延时函数
 * @function
 * @param {function} callback 动画回调函数
 * @return {number} id
 */
export const requestAnimationFrame = raFrame;

/**
 * 清除动画延时
 * @function
 * @param {number} id
 */
export const cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (id) {
        window.clearTimeout(id);
    };

/**
 * 节流函数 isLocked在执行中时禁止后续相同函数执行
 * @param {function} fn 事件处理函数
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @param {object} [context=this] 上下文对象
 * @returns {Function} 事件处理函数
 */
export function throttle(fn, isImmediate = false, context = this) {
    let isLocked;
    return function () {
        const _args = arguments;
        if (isLocked) return;
        isLocked = true;
        raFrame(function () {
            isLocked = false;
            fn.apply(context, _args);
        });
        isImmediate && fn.apply(context, _args);
    };
}

/**
 * 回显数据字典（字符串数组）
 * @param {*} datas 数组原始数据
 * @param {*} value 需要查找的值 多个时按照separator拼接
 * @param {*} separator 多个值时拼接的标识（默认为 , ）
 * @param {*} param2 需要对应的 val和key
 * @returns
 */
export function selectDictLabel(datas, value, separator = ',', { dictValue = 'dictValue', dictLabel = 'dictLabel' } = {}) {
    if (!['', undefined].includes(value)) {
        var actions = [];
        var temp = String(value)?.split(separator);
        Object.keys(String(value)?.split(separator)).some((val) => {
            Object.keys(datas).some((key) => {
                if (datas[key][dictValue] == temp[val]) {
                    actions.push(datas[key][dictLabel]);
                }
            });
        });
        return actions.join(',');
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    let search = clone(params);
    const str = typeof dateRange === 'string';
    let startTime, endTime;
    [startTime = '', endTime = ''] = str ? search[dateRange] : dateRange;
    if (typeof propName === 'undefined') {
        search['startTime'] = startTime;
        search['endTime'] = endTime;
    } else {
        search['start' + propName] = startTime;
        search['end' + propName] = endTime;
    }
    if (str) delete search[dateRange];
    return search;
}

/**
 * 数字转换为文字形式
 * @param {*} num  表示要转换的值
 * @returns
 */
export function convertToChinese(num) {
    var N = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var str = num.toString();
    var len = num.toString().length;
    var C_Num = [];
    for (var i = 0; i < len; i++) {
        C_Num.push(N[str.charAt(i)]);
    }
    return C_Num.join('');
}
/**
 * 数字转换为文字形式-1
 * @param {*} number  表示要转换的值
 * @returns
 */
export function numberChinese(number) {
    var units = '个十百千万@#%亿^&~',
        chars = '零一二三四五六七八九';
    var a = (number + '').split(''),
        s = [];
    if (a.length > 12) {
        throw new Error('too big');
    } else {
        for (var i = 0, j = a.length - 1; i <= j; i++) {
            if (j == 1 || j == 5 || j == 9) {
                //两位数 处理特殊的 1*
                if (i == 0) {
                    if (a[i] != '1') s.push(chars.charAt(a[i]));
                } else {
                    s.push(chars.charAt(a[i]));
                }
            } else {
                s.push(chars.charAt(a[i]));
            }
            if (i != j) {
                s.push(units.charAt(j - i));
            }
        }
    }
    //return s;
    return s
        .join('')
        .replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {
            //优先处理 零百 零千 等
            b = units.indexOf(d);
            if (b != -1) {
                if (d == '亿') return d;
                if (d == '万') return d;
                if (a[j - b] == '0') return '零';
            }
            return '';
        })
        .replace(/零+/g, '零')
        .replace(/零([万亿])/g, function (m, b) {
            // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        })
        .replace(/亿[万千百]/g, '亿')
        .replace(/[零]$/, '')
        .replace(/[@#%^&~]/g, function (m) {
            return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
        })
        .replace(/([亿万])([一-九])/g, function (m, d, b, c) {
            c = units.indexOf(d);
            if (c != -1) {
                if (a[j - c] == '0') return d + '零' + b;
            }
            return m;
        });
}

/**
 * 生成随机GUID
 * @return {string}
 */
export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .toUpperCase();
}
