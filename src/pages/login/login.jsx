import React, {Component} from 'react'
import { Form, Icon, Input, Button } from 'antd'

import './login.less'
import logo from './images/logo.png'

const Item  = Form.Item // 只能写在import后面，否则会报错
/**
 * 登录的路由组件
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              <Input 
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />}
                placeholder="用户名"/>
            </Item>
            <Form.Item>
              <Input
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                placeholder="密码"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}