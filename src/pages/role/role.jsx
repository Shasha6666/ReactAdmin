import React, { Component } from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import { reqRoles, reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
/**
 * 角色管理路由组件
 */
class Role extends Component {
  state = {
    roles: [], // 所有的roles列表
    role: {}, // 选中的role
    isShowAdd: false,
    isShowAuth: false
  }
  constructor(props) {
    super(props)
    this.af = React.createRef()
  }
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }
  onRow = (role)=> {
    return {
      onClick: event => { // 点击行
        this.setState({role})
      }
    }
  }
  getRoles = async() => {
    const result = await reqRoles()
    if(result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  /**
   * 添加角色
   */
  addRole = () => {
    // 进行表单验证
    this.form.validateFields(async(error, values) => {
      if(!error) {
        this.setState({
          isShowAdd: false
        })
        // 收集输入数据
        const {roleName} = values
        this.form.resetFields()
        const result = await reqAddRole(roleName)   
        if(result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles()
          const role = result.data
          // const roles = this.state.roles // 尽量不要直接更新状态数据
          // roles.push(role)
          // this.setState({
          //   roles
          // })

          // 更新roles状态：基于原本状态数据更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }
  /**
   * 更新角色
   */
  updateRole = async() => {
    const role = this.state.role
    const menus = this.af.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username
    const result = await reqUpdateRole(role)
    this.setState({
      isShowAuth: false
    })
    if(result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if(role._id === this.props.user.role_id) {
        this.props.logout()
        message.info('当前角色权限更新，请重新登录')
      } else {
        message.success('设置权限成功')
        this.getRoles()
      } 
    }
  }
  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }
  render() { 
    const {roles, role,isShowAdd, isShowAuth} = this.state
    const title = (
      <span>
        <Button type="primary" style={{marginRight: 20}} onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>
        <Button type="primary" disabled={!role._id ? true:false} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          rowSelection={{
            type: 'radio', 
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({ // 选择 某个radio时回调
                role
              })
            }
          }}
          dataSource={roles} 
          columns={this.columns}
          pagination={
            {
              defaultPageSize: PAGE_SIZE,
            }
          }
          onRow={this.onRow}
        />
        <Modal 
          title='添加角色' 
          visible={isShowAdd} 
          onOk={this.addRole} 
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
        }}>
          <AddForm setForm={(form) => this.form = form}/>
        </Modal>
        <Modal 
          title='设置角色权限' 
          visible={isShowAuth} 
          onOk={this.updateRole} 
          onCancel={() => {
            this.setState({isShowAuth: false})
        }}>
          <AuthForm role={role} ref={this.af}/>
        </Modal>
      </Card>

    )
  }
}
 
export default connect(
  state => ({user: state.user}),
  {logout}
)(Role) 