
import { Component } from 'react'
import Taro from "@tarojs/taro"
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      windowHeight: 0
    };
  }

  componentWillMount () { }

  componentDidMount () {
    const systemInfo = Taro.getSystemInfoSync()
    this.setState({
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  jumpWebview() {
    Taro.navigateTo({
      url: '/pages/webview/index'
    })
  }

  getUserProfile() {
    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (loginInfo) => {
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        console.log(loginInfo)
        Taro.login({
          success: (res) => {
            if (res.code) {
              //发起网络请求
              console.log(res)
              // Taro.request({
              //   url: 'https://test.com/onLogin',
              //   data: {
              //     code: res.code
              //   }
              // })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  }

  render () {
    return (
      <View className='index'>
        <Text onClick={ this.jumpWebview }>webview1</Text>
        <Button onClick={this.getUserProfile}> 获取头像昵称 </Button>
        {/* <Button openType="getPhoneNumber" onClick={handleBtnClick} onGetPhoneNumber={handleGetPhoneNumber}>
          获取手机号
        </Button> */}
      </View>
    )
  }
}
