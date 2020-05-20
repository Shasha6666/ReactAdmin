import React, { Component } from 'react'
import './index.less';
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu
class leftNav extends Component {

  /**
   * 判断当前登录用户对item是否有权限
   */
  hasAuth = (item) => {
    const {key, isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item权限
    */
   if(username === 'admin' || isPublic || menus.indexOf(key)!== -1) {
     return true
   } else if(item.children){
     // 4. 如果当前用户有此item的某个子item的权限
    return !!item.children.find(child => menus.indexOf(child.key) !== -1)
   }
   return false
  }
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
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)) {
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