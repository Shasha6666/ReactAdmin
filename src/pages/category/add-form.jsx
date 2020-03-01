import React, { Component } from 'react'
import {Form, Input, Select} from 'antd'
class AddFrom extends Component {
  render() { 
    const Item = Form.Item
    const Option = Select.Option
    const { getFieldDecorator } = this.props.form
    return ( 
      <Form>
        <Item>
          {
            getFieldDecorator('ParentId', {
              initialValue: '0'
            }) (
              <Select>
                <Option value='0'>一级分类</Option>
                <Option value='1'>分类一</Option>
                <Option value='2'>分类二</Option>
              </Select>
            )
          }
        </Item>
        <Item>
        {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder="请输入分类名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}
 
export default Form.create()(AddFrom)