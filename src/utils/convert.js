/**
 * 数据转换工具函数模块
 * @module utils/convert
 */

/**
 * 对象数组的去重函数  依照某个 id去重
 * @param {Object[]} list 对象数组
 * @param {string} [idKey=id] id字段名称
 */
export function duplicateArr(list = [], idKey = 'id') {
    let obj = {},
        Arr = [];
    list.forEach((item) => {
        if (!obj[item[idKey]]) {
            Arr.push(item);
            obj[item[idKey]] = item;
        }
    });
    return Arr;
}

/**
 * 深度拷贝对象或数组，采用JSON.parse 和 JSON.stringify 实现, 相同功能的方法 [cloneDeep]{@link module:utils/convert.cloneDeep}
 * @param {Object|Array} obj 要拷贝的对象或数组
 * @returns {Object|Array} 拷贝后的对象副本
 */
export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 检测数据类型
 * @param {*} obj 需要检测的数据
 * @returns {string} boolean / number / string / function / array / date / regExp / undefined / null / object
 */
export function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
        '[object Promise]': 'Promise',
    };
    return map[toString.call(obj)];
}

/**
 * 深度拷贝对象或数据
 * @param {*} data 需要拷贝的数据
 * @returns {*} 拷贝后的数据副本
 * @see [clone]{@link module:utils/convert.clone}
 */
export function cloneDeep(data) {
    if (typeof data !== 'object') return data;
    var newData = Array.isArray(data) ? [] : {};
    for (var key in data) {
        // hasOwnProperty表示是否有自己的属性。这个方法会查找一个对象是否有某个属性，但是不会去查找它的原型链。
        if (data.hasOwnProperty(key)) {
            newData[key] = cloneDeep(data[key]);
        }
    }
    return newData;
}
