const BaseUrl = {
  // https://3dmap.zhcloud.tech
  // https://3dmap-test.zhcloud.tech
  // http://192.168.0.190:3000
  domain: 'https://3dmap.zhcloud.tech',
  // https://clearance.zhcloud.tech
  // https://clearance-test.zhcloud.tech
  requestUrl: 'https://3dmap.zhcloud.tech'
}
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
console.log(process.env.NODE_ENV)
switch (env) {
    case 'development':
      BaseUrl.domain = 'https://3dmap-test.zhcloud.tech'
      BaseUrl.requestUrl = 'https://3dmap-test.zhcloud.tech'
        break
    case 'production':
      BaseUrl.domain = 'https://3dmap.zhcloud.tech'
      BaseUrl.requestUrl = 'https://3dmap.zhcloud.tech'
        break
}
export const baseUrl = BaseUrl
