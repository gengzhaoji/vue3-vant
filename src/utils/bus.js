/**
 * 组件之间的消息总线，用作组件间消息传递
 * @module utils/bus
 */
import mitt from 'mitt';

/**
 *  mitt 实例
 *
 * @example
 * A组件：
 *  import bus from '@/utils/bus'
 *  // 触发事件
 *  bus.emit('message', data)
 *
 *  B组件：
 *  import bus from '@/utils/bus'
 *
 *  // 侦听事件
 *  bus.on('message', data => {
 *    // 收到A组件发送过来的消息
 *  })
 *  // 显式卸载
 *  onUnmounted(() => {
 *     bus.off('message', changeMsg)
 *  })
 */
export default mitt();
