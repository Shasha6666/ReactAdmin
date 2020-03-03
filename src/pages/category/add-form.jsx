import React, { Component } from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'
class AddFrom extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() { 
    const Item = Form.Item
    const Option = Select.Option
    const { getFieldDecorator } = this.props.form
    const {categorys, parentId} = this.props
    return ( 
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            }) (
              <Select>
                <Option value='0'>一级分类列表</Option>
                {categorys.map(c => <Option value={c._id}>{c.name}</Option>)}
              </Select>
            )
          }
        </Item>
        <Item>
        {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
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