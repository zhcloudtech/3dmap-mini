
import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

import Taro from "@tarojs/taro"
import LoginBg from '../../images/bg.jpg'
import Eaarth from '../../images/diqiu.png'

type PageState = {
  windowWidth: number;
  windowHeight: number;
};

type IProps = {}

export default class Login extends Component<IProps, PageState> {

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
    console.log(systemInfo)
    this.setState({
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

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
    const { windowWidth, windowHeight } = this.state;
    return (
      <View style={{position: 'relative'}}>
        <View className='earth-panel'>
          <Text className='title'>首个真三维GIS</Text>
          <Text className='title'>机场净空管理小程序</Text>
          <Image className='earth-img' src={Eaarth}></Image>
          <Button className='login-btn' onClick={this.getUserProfile}>微信授权</Button>
        </View>
        <Image className='login-bg' style={{width: windowWidth, height: windowHeight}} src={LoginBg}></Image>
      </View>
    )
  }
}
