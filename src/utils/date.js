/**
 * 日期处理模块
 * @module utils/date
 */

/**
 * 日期格式转换函数
 * @param  {String|Date} dateStr 日期时间对象或字符串
 * @param  {String} [format] 输出格式，   YYYY-MM-DD hh:mm:ss
 * @param  {Object} [options] 时间偏移对象，可选 {y,M,d,h,m,s}
 * @param {Number} options.y 年偏移量，+增加， -减少
 * @param {Number} options.M 月偏移量，+增加， -减少
 * @param {Number} options.d 日偏移量，+增加， -减少
 * @param {Number} options.h 时偏移量，+增加， -减少
 * @param {Number} options.m 分偏移量，+增加， -减少
 * @param {Number} options.s 秒偏移量，+增加， -减少
 * @returns {String|Date} 如不传递format，即返回Date类型
 *
 * @example
 * // 当前时间减少一天, 并转换格式
 *  date(new Date(), 'YYYY-MM-DD', {d: -1})
 */
export default function date(dateStr = new Date(), format = 'YYYY-MM-DD hh:mm:ss', { Y = 0, M = 0, D = 0, h = 0, m = 0, s = 0 } = {}) {
    let obj = typeof dateStr === 'string' ? new Date(dateStr.replace(/-/g, '/')) : dateStr;

    obj = new Date(Y + obj.getFullYear(), M + obj.getMonth(), D + obj.getDate(), h + obj.getHours(), m + obj.getMinutes(), s + obj.getSeconds());

    let o = {
        'M+': obj.getMonth() + 1,
        'D+': obj.getDate(),
        'h+': obj.getHours(),
        'H+': obj.getHours(),
        'm+': obj.getMinutes(),
        's+': obj.getSeconds(),
        'q+': Math.floor((obj.getMonth() + 3) / 3),
        S: obj.getMilliseconds(),
    };
    if (format) {
        if (/(Y+)/i.test(format)) {
            format = format.replace(RegExp.$1, `${obj.getFullYear()}`.substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp(`(${k})`).test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
            }
        }
        return format;
    } else {
        return obj;
    }
}
