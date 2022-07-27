import { Component } from 'react'
import Taro from "@tarojs/taro"
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import api from '../../api/request'
import { formatDegree } from '../../utils/conmmon'
import * as echarts from '../../components/ec-canvas/echarts'

type PageState = {
  airportInfo: AirportInfo[];
  ec: any;
}
type AirportInfo = {
  name: string;
  value: string;
}

type IProps = {}

const FontFamily = 'PingFang SC-Regular, PingFang SC'

export default class VariationtDetail extends Component<IProps, PageState> {

  constructor(props) {
    super(props);
    this.state = {
      airportInfo: [
        { name: '机场名：', value: '' },
        { name: '经纬度：', value: '' },
        { name: '公布磁差：', value: '' },
        { name: '模型磁差：', value: '' }
      ],
      ec: null
    }
  }

  setEc = ({ years, datas, unit }) => {
    return {
      onInit: (canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: 2, // 解决移动端模糊的问题
        });
        canvas.setChart(chart);
        const option = {
          // color: ["#37A2DA"],
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          // grid: {
          //   containLabel: true
          // },
          xAxis: {
            name: "年",
            // min: parseInt('2016') - 0.5,
            // max: parseInt('2022') + 0.5,
            // name: "年",
            nameTextStyle: {
              padding: [26, 0, 0, 0],
              fontSize: 12,
              fontFamily: FontFamily,
            },
            data: years,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['white'],
                opacity: 0.5,
              }
            },
            //  改变x轴颜色
            axisLine:{
              lineStyle:{
                color:'white',
              }
            },
            axisLabel: {
              textStyle: {
                color: 'white',
                fontSize: 11,
                fontFamily: FontFamily,
              },
              formatter: (value) => {
                return value.toString()
              }
            },
          },
          yAxis: {
            name: `磁差（°${unit}）`,
            type: 'value',
            scale: true,
            minInterval: 0.05,
            nameTextStyle: {
              padding: [0, 0, 15, 20],
              fontSize: 12,
              fontFamily: FontFamily,
            },
            axisLine:{
              show: true,
              lineStyle:{
                color:'white',
                opacity: 1
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['white'],
                opacity: 0.5,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'white',
                fontSize: 11,
                fontFamily: FontFamily,
              },
            },
          },
          series: [
            {
              type: 'line',
              color: ['white'],
              lineStyle: {
                width: 1,
              },
              label: {
                show: true,
                position: 'top',
                color: '#84FFC4',
              },
              data: datas
            }
          ]
        };
        chart.setOption(option)
        return chart;
      }
    }
  }

  onLoad (option) {
    const airportId = parseFloat(option.id)
    this.getAirports(airportId)
  }

  componentWillMount () {
  }

  componentDidMount () {
    // const systemInfo = Taro.getSystemInfoSync()
    // console.log(systemInfo)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 机场列表
  getAirports = (airportId: number) => {
    api.get('/api/var/getByAirportId', { airportId }).then((result) => {
      const { code } = result.data
      if (code === 200) {
        const { data } = result.data
        // 纬度
        const lat = formatDegree(data.latitude)
        // 经度
        const lng = formatDegree(data.longitude)
        console.log(JSON.parse(data.extend))
        const extend = JSON.parse(data.extend)
        const { latest } = extend
        const years = extend.wmmLogs.map(val => val.year)
        const datas = extend.wmmLogs.map(val => parseFloat(val.degree))
        this.setState({
          airportInfo: [
            { name: '机场名：', value: `${data.airport.name}机场` },
            { name: '经纬度：', value: `${lng}, ${lat}` },
            { name: '公布磁差：', value: `${data.degree}${data.year ? `（${data.year}年）` : ''}` },
            { name: '模型磁差：', value: `${latest.degreeStr}（${latest.year}年）` }
          ],
          ec: this.setEc({
            years,
            datas,
            unit: latest.bearing,
          })
        })
        // wmmLogs
      }
    })
  }

  render () {
    const { airportInfo, ec } = this.state
    return (
      <View className='variationt-detail'>
        <View className='detail-empty'></View>
        {
          airportInfo.map((val) => {
            return <>
              <View className='detail-title'>{ val.name }</View>
              <View className='detail-input'>{ val.value }</View>
            </>
          })
        }
        <View className='var-chart'>
          {
            ec && <ec-canvas id="mychart-dom-line" canvas-id="mychart-bar" ec={ec}></ec-canvas>
          }
        </View>
        <View className='detail-empty'></View>
      </View>
    )
  }
}
