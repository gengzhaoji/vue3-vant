/**
 * 解决两个数相加精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export function floatAdd(a, b) {
    var c, d, e;
    if (undefined == a || null == a || '' == a || isNaN(a)) {
        a = 0;
    }
    if (undefined == b || null == b || '' == b || isNaN(b)) {
        b = 0;
    }
    try {
        c = a.toString().split('.')[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split('.')[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (floatMul(a, e) + floatMul(b, e)) / e;
}
/**
 * 解决两个数相减精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export function floatSub(a, b) {
    return (floatMul(a, e) - floatMul(b, e)) / e;
}
/**
 * 解决两个数相乘精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export function floatMul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split('.')[1].length;
    } catch (f) {}
    try {
        c += e.split('.')[1].length;
    } catch (f) {}
    return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
}
/**
 * 解决两个数相除精度丢失问题
 * @param a
 * @param b
 * @returns
 */
export function floatDiv(a, b) {
    var c,
        d,
        e = 0,
        f = 0;
    try {
        e = a.toString().split('.')[1].length;
    } catch (g) {}
    try {
        f = b.toString().split('.')[1].length;
    } catch (g) {}
    return (c = Number(a.toString().replace('.', ''))), (d = Number(b.toString().replace('.', ''))), floatMul(c / d, Math.pow(10, f - e));
}

/**
 * 保留有效数字并且4舍5入
 * @param {*} v 表示要转换的值 表示要保留的位数
 * @param {*} e 表示要保留的位数
 * @returns
 */
export function round(v, e) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
}
