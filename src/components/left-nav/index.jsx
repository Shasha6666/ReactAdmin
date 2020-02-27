import React, { Component } from 'react'
import './index.less';
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd'

const { SubMenu } = Menu
class leftNav extends Component {
  render() { 
    return ( 
    <div className="left-nav">
      <Link to='/' className="left-nav-link">
        <img src={logo} alt="logo"/>
        <h1>硅谷后台</h1>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
      >
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="mail" />
              <span>Navigation One</span>
            </span>
          }
          >
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </SubMenu>
      </Menu>
    </div> 
    )
  }
}
 
export default leftNav