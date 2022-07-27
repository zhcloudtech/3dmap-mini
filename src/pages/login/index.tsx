
import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import api from '../../api/request'

import Taro from "@tarojs/taro"
import LoginBg from '../../images/bg.jpg'
import Eaarth from '../../images/diqiu.png'
import { getGlobalData, setGlobalData } from '../../utils/global'

type PageState = {
  windowWidth: number;
  windowHeight: number;
  userName: string,
  userPhone: string,
};

type IProps = {}

export default class Login extends Component<IProps, PageState> {

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      userName: '',
      userPhone: '',
    };
  }

  componentWillMount () { }

  componentDidMount () {
    const systemInfo = Taro.getSystemInfoSync()
    console.log(systemInfo)
    const userPhone = getGlobalData('userPhone')
    const userName = getGlobalData('userName')
    console.log('componentDidMount', userPhone)
    this.setState({
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
      userName: userName,
      userPhone: userPhone,
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getUserProfile = () => {
    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (loginInfo) => {
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        // console.log(loginInfo)
        api.post('/api/wechat/saveUserInfo', {
          encryptedData: loginInfo.encryptedData,
          iv: loginInfo.iv
        }).then((result) => {
          const { code } = result.data
          if (code === 200) {
            const { userPhone } = this.state
            console.log('success')
            Taro.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 1500
            })
            this.setState({
              userName: loginInfo.userInfo.nickName
            })
            setGlobalData('userName', loginInfo.userInfo.nickName)
            if (userPhone) {
              Taro.redirectTo({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    })
  }
  getPhoneNumber = (e) => {
    const { detail } = e
    if (detail.errMsg === 'getPhoneNumber:ok') {
      // console.log('成功', detail)
      api.post('/api/wechat/saveUserPhone', {
        code: detail.code,
      }).then((result) => {
        const { code } = result.data
        if (code === 200) {
          this.setState({
            userPhone: detail.code
          })
          setGlobalData('userPhone', detail.code)
          const { userName } = this.state
          if (userName) {
            Taro.redirectTo({
              url: '/pages/index/index'
            })
          }
        }
      })
    } else {
      console.log('失败', detail)
    }
  }

  render () {
    const { windowWidth, windowHeight, userName, userPhone } = this.state
    return (
      <View style={{position: 'relative'}}>
        <View className='earth-panel'>
          <Text className='title'>首个真三维GIS</Text>
          <Text className='title'>机场净空管理小程序</Text>
          <Image className='earth-img' src={Eaarth}></Image>
          {
            !userName && <Button className='login-btn' onClick={this.getUserProfile}>微信授权</Button>
          }
          {
            !userPhone && <Button className='login-btn' openType="getPhoneNumber" onGetPhoneNumber={this.getPhoneNumber}>授权手机号</Button>
          }
        </View>
        <Image className='login-bg' style={{width: windowWidth, height: windowHeight}} src={LoginBg}></Image>
      </View>
    )
  }
}
