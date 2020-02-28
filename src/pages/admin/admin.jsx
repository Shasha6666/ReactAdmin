import React, {Component} from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home' 
import Category from '../category/category' 
import Product from '../product/product' 
import Role from '../role/role' 
import User from '../user/user' 
import Bar from '../charts/bar' 
import Line from '../charts/line' 
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout

/**
 * 登录的路由组件
 */
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user
    if (!user || !user._id) {
      // 自动跳转到登录（在render（）中）
      return <Redirect to="/login"/>
    }
  return (
    <Layout style={{height: '100%'}}>
      <Sider>
        <LeftNav/>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{margin: 20,backgroundColor: '#fff'}}>
          <Switch>
            <Route path="/home" component={Home}/>
            <Route path="/category" component={Category}/>
            <Route path='/product' component={Product}/> 
            <Route path='/role' component={Role}/> 
            <Route path='/user' component={User}/>
            <Route path='/charts/bar' component={Bar}/> 
            <Route path='/charts/line' component={Line}/> 
            <Route path='/charts/pie' component={Pie}/>
            <Redirect to="/home"/>
          </Switch>
        </Content>
        <Footer style={{textAlign: 'center', color: '#aaaaaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
  }
}