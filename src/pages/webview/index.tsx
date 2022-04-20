
import { Component } from 'react'
import { WebView } from '@tarojs/components'

export default class Webview extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleMessage() {}

  render () {
    return (
      <WebView src='http://localhost:4000/' onMessage={this.handleMessage} />
    )
  }
}
