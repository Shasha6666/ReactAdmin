import React, { Component } from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const {TreeNode} = Tree
const Item = Form.Item
export default class AuthFrom extends Component {
  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)
    // 根据传入的角色的menu生成初始值
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    },[])
  }
  /**
   * 选中某个节点时触发
   */
  onCheck = (checkedKeys) => {
    console.log('checkedKeys', checkedKeys);
    this.setState({checkedKeys})
  }
  /**
   * 为父组件提供最新menus的方法
   */
  getMenus = () => this.state.checkedKeys

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  // 根据新传入的role来更新checkedKeys
  // 当组件接收到新的属性时自动调用,会在render之前调用,初始显示不会调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }
  render() { 
    const {role} = this.props
    const {checkedKeys} = this.state
    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 15}
    }
    return ( 
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck = {this.onCheck}
        >
          <TreeNode title='平台权限' key='all'>
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}