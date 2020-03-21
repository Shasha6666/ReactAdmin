import React, { Component } from 'react'
import './index.less';
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu
class leftNav extends Component {
  /* 根据指定菜单数据列表产生<Menu>的子节点数组
     map()+递归
   */
  getMenuNodes_map(menuList) {
    // 获取到当前页面的路径
    const path = this.props.location.pathname
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to = {item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        //查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => path.indexOf(cItem) === 0)
        // 如果存在，说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
            >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )

      }
    })
  }
  /* 根据指定菜单数据列表产生<Menu>的子节点数组
     reduce()+递归
   */
  getMenuNodes = (menuList) => {
    // 获取到当前页面的路径
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        // 向pre添加<Menu.Item>
        pre.push(
          (
            <Menu.Item key={item.key}>
              <Link to = {item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        )
      } else {
        // 向pre添加<SubMenu>
        //查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        // 如果存在，说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        pre.push(
          (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
              >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        )
      }
      return pre
    }, [])
  }
  /**
   * 在第一次render()之前执行一次，
   * 一般可以在此同步为第一次render()准备数据
   */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() { 
    // 获取到当前页面的路径
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0) {
      path = '/product'
    }
    const openKey = this.openKey
    return ( 
    <div className="left-nav">
      <Link to='/' className="left-nav-link">
        <img src={logo} alt="logo"/>
        <h1>硅谷后台</h1>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
      >
        {this.menuNodes}
      </Menu>
    </div> 
    )
  }
}
/**
 * withRouter()高阶组件，包装非路由组件返回一个包装后的新组件
 * 新组件会向被包装组件传递history、location、match属性
 */
export default withRouter(leftNav)