import React, {Component} from 'react'
import { Form, Icon, Input, Button, message} from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

const Item  = Form.Item // 只能写在import后面，否则会报错
/**
 * 登录的路由组件
 */

class Login extends Component {
  handleSubmit = (event) => {
  // 阻止事件的默认行为
  event.preventDefault()

  // 获取form对象
  const form = this.props.form
  // 提交前对表单所有数据进行统一验证
  form.validateFields(async(err, values) => {
    // 校验成功
    if (!err) {
      // TODO:提交登录的ajax请求
      const {username, password} = values
      // 1、采用异步方式处理
      // reqLogin(username, password).then(response => {
      //   console.log('成功了', response.data)
      // }).catch(error => {
      //   console.log('失败了', error)
      // })
      // 2、采用async和await同步方式处理异步
      // try {
      //   const promise = await reqLogin(username, password)
      //   console.log('请求成功', promise.data)
      // } catch (error) {
      //   console.log('请求失败', error)
      // }
      // 3、在ajax请求中统一处理请求异常，页面中不用处理
      const result = await reqLogin(username, password)
      console.log('请求成功', result)// {status: 0, data: user} {status: 1, msg: 'xxx'}
      if (result.status === 0) { // 登录成功
        message.success('登录成功')
        // 跳转到管理页面(不需要再回退回来)
        const user = result.data
        // 将user对象存到内存中
        memoryUtils.user = user
        // 将对象保存到localStorage中
        storageUtils.saveUser(user)
        this.props.history.replace('/')
      }else { // 登录失败
        message.error(result.msg)
      }
      console.log('Recevied values of form: ', values)
    } else {
      console.log('提交失败：', err)
    }
  })
  // 获取表单的输入数据
  // const values = form.getFieldsValue()
  // console.log('========', values)
  }
  /**
   * 自定义表单校验规则
   */
  validatePwd = (rule, value, callback) => {
    const pwdReg = /^[a-zA-Z0-9]+$/
    const length = value && value.length
    if (!value) {
      callback('密码不能为空')
    } else if (length < 4) {
      callback('密码不能小于4位')
    } else if (length > 12) {
      callback('密码长度不能大于12位')
    } else if (!pwdReg.test(value)) {
      callback('密码必须是英文、数组或者下划线组成')
    } else {
      callback() // 必须调用callback()
    }
  }
  render() {
    const form = this.props.form
    // 得到表单项的输入数据--解构赋值
    const { getFieldDecorator } = form
    if (memoryUtils.user && memoryUtils.user._id) {
      return <Redirect to="/"/>
    }
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
              {getFieldDecorator('username', {
                // 声明式验证：直接使用别人定义好的验证规则进行验证
                rules: [
                  {required: true, whitespace: true, message: '用户名必须输入' },
                  {min: 4, message: '用户名必须超过4位' },
                  {max: 12, message: '用户名不能大于12位' },
                  {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                ]
              })(
                <Input 
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  placeholder="用户名"/>
              )}
            </Item>
            <Form.Item>
            {getFieldDecorator('password', {
              // 自定义表单校验规则
              rules: [
                {validator: this.validatePwd}
              ]
            })(
              <Input
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                placeholder="密码"
                type="password" />
              )}
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

/**
 * 1.高阶函数
 *   1).一类特殊的函数
 *     a. 接收函数作为参数
 *     b.函数返回值是函数类型
 *   2).常见
 *     a. 定时器：setTime()/setInterval()
 *     b. Promise: Promnise(() => {}) then(value => {}, reason => {})
 *     c. 数组遍历相关方法：ForEach()/filter()/map()/reduce()/find()/findIndex()
 *     d. 函数对象的bind()
 *     e. Form.create()()/getFieldDecorator()()
 *   3). 高阶函数更新动态，更加具有扩展性
 * 2.高阶组件，WrapLogin
 *   1). 本质就是一个函数
 *   2). 接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
 *   3). 作用：扩展组件的作用
 *   4). 高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数
 */
/**
 * 包装Form组件生成一个新的组件：Form（Login），
 * 新组件会向Form组件传递一个强大的对象属性：form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin
/**
 * 1.前台验证表单数据
 * 2.收集表单数据
 */
/**
 * async和await
 * 1、作用？
 *    简化promise对象的使用：不用再使用then（）来指定成功/失败的回调函数
 *    以同步编码（没有回调函数了）方式实现异步流程
 * 2、哪里写await？
 *    在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据
 * 3、哪里写async？
 *    await所在（最近）函数定义的左侧写async
 */