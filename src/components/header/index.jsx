import React, { Component } from 'react'
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import { reqWeather } from '../../api'
import muneList from '../../config/menuConfig'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
import LinkButton from '../link-button'

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    temperature: '', // 今日温度
    weather: '', // 天气的文本
  }
  getTime = () => {
    // 每隔1s获取当前时间，并更新状态数据
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000);
  }
  getWeather = async() => {
    const result = await reqWeather('北京')
    const {temperature,weather} = result
    this.setState({temperature,weather})
  }
  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    muneList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if(cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }
  // 退出登录的函数
  logout = () => {
    Modal.confirm({
      content: '确定退出登录吗？',
      onOk : () => {
        console.log('ok')
       this.props.logout()
      },
      onCancel: () => {
        console.log('cancle')
      }
    })
  }
  // 第一次render()之后执行，一般在此执行异步操作：发ajax请求/启动定时器
  componentDidMount() {
    // 获取当前时间
    this.getTime()
    // 获取当前天气显示
    // this.getWeather()
  }
  // 当前组件卸载之前调用
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }
  render() { 
    const {currentTime, temperature, weather} = this.state
    const username = this.props.user.username
    // const title = this.getTitle()
    const title = this.props.headTitle
    return ( 
      <div className="header">
        <div className="header-top">
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{title}</span>
          </div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <span>{temperature}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
      )
    }
}
 
export default connect(
  state => ({headTitle: state.headTitle, user:state.user}),
  {logout}
)(withRouter(Header))