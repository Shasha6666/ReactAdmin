import React, { Component } from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
class Header extends Component {
  render() { 
    return ( 
      <div className="header">
        <div className="header-top">
          <span>欢迎，admin</span>
          <a href="javascript:">退出</a>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>首页</span>
          </div>
          <div className="header-bottom-right">
            <span>2020-2-28 20:54:32</span>
            <img src={logo} alt="weather"/>
            <span>晴</span>
          </div>
        </div>
      </div>
      )
    }
}
 
export default Header