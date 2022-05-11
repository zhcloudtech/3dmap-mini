
import { Component } from 'react'
import Taro from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import api from '../../api/request'
import './index.scss'
import { baseUrl } from '../../utils/config'

type userInfo = {
  avatarUrl: string
  city: string
  country: string
  gender: number
  language: string
  nickName: string
  province: string
}

type PageState = {
  baseUrl: string;
  token: string;
  userInfo: userInfo;
  url: string
};

type IProps = {}
export default class Index extends Component<IProps, PageState> {

  constructor(props) {
    super(props)
    this.state = {
      baseUrl: baseUrl.domain,
      token: '',
      userInfo: {
        avatarUrl: '',
        city: '',
        country: '',
        gender: 0,
        language: '',
        nickName: '',
        province: '',
      },
      url: '',
    }
  }

  componentWillMount () {
  }
  componentDidMount () {
    this.login()
  }
  login() {
    Taro.login({
      success: (res) => {
        const { code } = res
        if (code) {
          api.post('/wechat/login', { code }).then((result) => {
            const { data } = result.data
            const { baseUrl } = this.state
            try {
              Taro.setStorageSync('token', data.accessToken)
            } catch (e) {}
            this.setState({
              token: data.accessToken,
              userInfo: data.userInfo,
              url: `${baseUrl}?token=${data.accessToken}&name=${encodeURIComponent(data.userInfo.nickName)}#wechat_redirect`
            })
          })
        } else {
          Taro.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  }
  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }
  handleMessage(data) {
    console.log('handleMessage', data)
  }

  onShareAppMessage() {
    return {
      title: '净空管理小程序',
      path: '/pages/index/index',
    }
  }

  render () {
    const { url } = this.state
    return (
      <WebView src={url} onMessage={this.handleMessage} />
    )
  }
}
