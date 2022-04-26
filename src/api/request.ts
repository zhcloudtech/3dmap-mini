import Taro from '@tarojs/taro'
import { logError } from '../utils/errors'

export default {
  baseUrl: 'https://clearance-test.zhcloud.tech',
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      // mode: string,
      success: any,
      error: any,
      xhrFields: object,
    }
    const setCookie = (res: {
      cookies: Array<{
        name: string,
        value: string,
        expires: string,
        path: string
      }>,
      header: {
        'Set-Cookie': string
      }
    }) => {
      if (res.cookies && res.cookies.length > 0 && url.indexOf('login/cellphone') !== -1) {
        // console.info("res ===>", res)
        let cookies = '';
        res.cookies.forEach((cookie, index) => {
          // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
          if (cookie.name && cookie.value) {
            cookies += index === res.cookies.length - 1 ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}` : `${cookie.name}=${cookie.value};`
          } else {
            cookies += `${cookie}`
          }
        });
        Taro.setStorageSync('cookies', cookies)
      }
    }
    data = {
      ...data,
      timestamp: new Date().getTime(),
      cookie: Taro.getStorageSync('cookies')
    }
    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : this.baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        auth: Taro.getStorageSync('token')
      },
      // mode: 'cors',
      xhrFields: { withCredentials: true },
      success: (res) => {
        const { code, message } = res.data
        // setCookie(res)
        if (code === 404) {
          return logError('api', '请求资源不存在')
        } else if (code === 502) {
          return logError('api', '服务端出现了问题')
        } else if (code === 403) {
          return logError('api', '没有权限访问')
        } else if (code === 401) {
          Taro.clearStorage()
          Taro.navigateTo({
            url: '/pages/login/index'
          })
          return logError('api', '请先登录')
        } else if (code === 200) {
          return res.data.data
        } else {
          return logError('api', message || '请求出错')
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
}
