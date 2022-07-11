/**
 * dom操作模块, 更多dom操作可以使用 element-ui/lib/util/dom
 * @module utils/dom
 */

/**
 * 获取元素 offsetLeft
 * @deprecated el.getBoundingClientRect().left
 * @param {HtmlElement} el DOM元素
 * @returns {Number}
 */
export function offsetLeft(el) {
    return el.getBoundingClientRect().left;
}

/**
 * 获取元素 offsetTop
 * @deprecated el.getBoundingClientRect().top
 * @param {HtmlElement} el DOM元素
 * @returns {Number}
 */
export function offsetTop(el) {
    return el.getBoundingClientRect().top;
}

/**
 * 获取的窗体的滚动距离
 * @param {Window|HtmlElement} target window 或 DOM元素
 * @param {Boolean} top 是否垂直方向
 * @returns {Number} 滚动距离
 */
export function getScroll(target, top) {
    if (!target) return 0;
    if (target === window) {
        const prop = top ? 'pageYOffset' : 'pageXOffset';
        const method = top ? 'scrollTop' : 'scrollLeft';

        let ret = target[prop];

        if (typeof ret !== 'number') {
            ret = window.document.documentElement[method];
        }

        return ret;
    } else {
        const method = top ? 'scrollTop' : 'scrollLeft';
        return target[method];
    }
}

/**
 * 获取元素的 offset
 * @deprecated  el.getBoundingClientRect()
 * @param {HtmlElement} element DOM元素
 * @returns {Object} offset {left, top}
 */
export function getOffset(element) {
    const rect = element.getBoundingClientRect();

    const scrollTop = getScroll(window, true);
    const scrollLeft = getScroll(window);

    const docEl = window.document.body;
    const clientTop = docEl.clientTop || 0;
    const clientLeft = docEl.clientLeft || 0;

    return {
        top: rect.top + scrollTop - clientTop,
        left: rect.left + scrollLeft - clientLeft,
    };
}

/**
 * 动画滚动到顶部 scrollTop animation
 * @param {HtmlElement} el DOM元素
 * @param {Number} [from=0] 开始位置
 * @param {Number} to  滚动到位置
 * @param {Number} [duration=500] 动画持续时间
 */
export function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = start + step > end ? end : start + step;
        if (start > end) {
            d = start - step < end ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }

    scroll(from, to, step);
}

/**
 * 在元素前插入元素
 * @param {HTMLElement} newEl 新DOM元素
 * @param {HTMLElement} targetEl 在指定目标DOM元素前插入
 */
export function insertAfter(newEl, targetEl) {
    const parentEl = targetEl.parentNode;
    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

/**
 * 判断元素是否隐藏
 * @param  {HTMLElement} el 元素DOM对象
 * @return {boolean} 是否隐藏
 */
export function isHidden(el) {
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden';
}

/**
 * dom添加监听事件
 * @param {*} element
 * @param {*} event
 * @param {*} handler
 * @param {*} useCapture
 */
export function on(element, event, handler, useCapture = false) {
    if (element && event && handler) {
        element == null ? void 0 : element.addEventListener(event, handler, useCapture);
    }
}
/**
 * dom取消监听事件
 * @param {*} element
 * @param {*} event
 * @param {*} handler
 * @param {*} useCapture
 */
export function off(element, event, handler, useCapture = false) {
    if (element && event && handler) {
        element == null ? void 0 : element.removeEventListener(event, handler, useCapture);
    }
}

/**
 * 使用ResizeObserver 监听任意HTML元素尺寸变化
 */
import ResizeObserver from 'resize-observer-polyfill';

export function addResizeListener(element, fn) {
    if (!element) return;
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = [];
        element.__ro__ = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const listeners = entry.target.__resizeListeners__ || [];
                if (listeners.length) {
                    listeners.forEach((fn) => {
                        fn();
                    });
                }
            }
        });
        element.__ro__.observe(element);
    }
    element.__resizeListeners__.push(fn);
}
export function removeResizeListener(element, fn) {
    var _a;
    if (!element || !element.__resizeListeners__) return;
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
        (_a = element.__ro__) == null ? void 0 : _a.disconnect();
    }
}
