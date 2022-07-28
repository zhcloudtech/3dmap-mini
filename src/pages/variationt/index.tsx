import { Component } from 'react'
import Taro from "@tarojs/taro"
import { pinyin } from 'pinyin-pro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIndexes, AtSearchBar } from 'taro-ui'
import './index.scss'
import api from '../../api/request'
// import LoginBg from '../../images/bg.jpg'
// import Eaarth from '../../images/diqiu.png'
// import { getGlobalData, setGlobalData } from '../../utils/global'

// import 'taro-ui/dist/style/index.scss'
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/indexes.scss";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";

type PageState = {
  airportList: any;
  indexList: any;
  searchWorld: string;
}

type ListItem = {
  id: number;
  name: string;
}

type ListType = {
  title: string;
  key: string;
  items: ListItem[];
}

type IProps = {}

export default class Variationt extends Component<IProps, PageState> {

  constructor(props) {
    super(props);
    this.state = {
      // 接口返回的列表数据
      airportList: [],
      // 处理后的列表
      indexList: [],
      searchWorld: '',
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const pinyinTest = pinyin('汉', {
      pattern: 'first'
    })
    console.log(pinyinTest.toLocaleUpperCase())
    this.getAirports()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 机场列表
  getAirports = () => {
    api.get('/api/ols/getAirports', { all: 1 }).then((result) => {
      const { code } = result.data
      if (code === 200) {
        const { data } = result.data
        this.setState({
          airportList: data,
        })
        this.transformList(data)
      }
    })
  }
  // 转为indexs格式
  transformList = (list) => {
    const transList: ListType[] = []
    list.forEach((item) => {
      const name = item.name
      const icaoCode = item.icaoCode
      // 首字母
      const firstLetter =  pinyin(name.charAt(0), { pattern: 'first', toneType: 'none' }).toLocaleUpperCase()
      const findNameIndex = transList.findIndex(val => val.title === firstLetter)
      if (findNameIndex > -1) {
        transList[findNameIndex].items.push({ name: `${name}机场 ${icaoCode}`, id: item.id })
      } else {
        const newOne = {
          title: firstLetter,
          key: firstLetter,
          items: [{ name: `${name}机场 ${icaoCode}`, id: item.id }]
        }
        transList.push(newOne)
      }
    })
    // 按字母顺序排序
    transList.sort((a, b) => {
      return a.key.localeCompare(b.key)
    })
    // console.log(transList)
    this.setState({
      indexList: transList
    })
  }

  // 选中机场
  onClick = (item) => {
    Taro.navigateTo({
      url: `/pages/variationtDetail/index?id=${item.id}`
    })
  }
  onSearchChange = (value) => {
    this.setState({
      searchWorld: value
    })
  }
  onSearchClick = () => {
    const { searchWorld, airportList } = this.state
    // console.log(searchWorld)
    const searchList = airportList.filter(val => (val.name.indexOf(searchWorld) > -1) || (val.icaoCode.toLowerCase().indexOf(searchWorld.toLowerCase()) > -1))
    // console.log(searchList)
    if (searchList && searchList.length) {
      this.transformList(searchList)
    } else {
      Taro.showToast({
        title: '暂无搜索结果',
        icon: 'none',
        duration: 2000
      })
    }
  }
  onClearChange = () => {
    this.setState({
      searchWorld: ''
    })
    const { airportList } = this.state
    this.transformList(airportList)
  }
  onScroll = () => {
    console.log(123123)
  }

  render () {
    const { indexList, searchWorld } = this.state
    return (
      <View className='variationt-wrap'>
        <View className='variationt-empty'>
          <AtSearchBar
              showActionButton
              value={this.state.searchWorld}
              placeholder='输入机场名称或四字代码'
              onClear={this.onClearChange.bind(this)}
              onBlur={this.onSearchClick.bind(this)}
              onChange={this.onSearchChange.bind(this)}
              onActionClick={this.onSearchClick.bind(this)} />
        </View>
        <View className='variationt-content'>
          <AtIndexes
            topKey=''
            list={indexList}
            isShowToast={false}
            onClick={this.onClick.bind(this)}
            // onScrollIntoView={this.onScroll.bind(this)}
          >
          </AtIndexes>
        </View>
      </View>
    )
  }
}
