import { formatTime } from './conmmon'
import Taro from '@tarojs/taro'

/**
 *
 * @param {string} name 错误名字
 * @param {string} action 错误动作描述
 * @param {string} info 错误信息，通常是 fail 返回的
 */
export const logError = (name: string, action: string, info?: string | object ) => {
  if (!info) {
    info = 'empty'
  }
  let time = formatTime(new Date())
  Taro.showToast({
    title: action,
    icon: 'none',
    duration: 2000
  })
  console.error(time, name, action, info)
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
}

