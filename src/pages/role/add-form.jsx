import React, { Component } from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'
class AddFrom extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() { 
    const Item = Form.Item
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 15}
    }
    return ( 
      <Form>
        <Item label='角色名称' {...formItemLayout}>
        {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [
                {required: true, message: '角色名称必须输入'}
              ]
            })(
              <Input placeholder="请输入角色名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}
 
export default Form.create()(AddFrom)