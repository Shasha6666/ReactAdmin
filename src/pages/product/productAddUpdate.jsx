import React, { Component } from 'react'
import {Card, Form, Input, Icon, Button} from 'antd'
import LinkButton from '../../components/link-button'


const {Item} = Form
const {TextArea} = Input

/**
 * 商品增加和更新路由组件
 */
class ProductAddUpdate extends Component {
  render() { 
    const {getFieldDecorator} = this.props.form
    const FormItemLayout = {
      labelCol: {span: 2}, // 左侧label的宽度
      wrapperCol: {span: 8} // 右侧包裹的宽度
    }
    const title = (
      <span>
        <LinkButton>
          <Icon type="arrow-left" style={{fontSize: 20}}/>
        </LinkButton>
        <span>
          添加商品
        </span>
      </span>
    )
    return ( 
      <Card title={title}>
        <Form {...FormItemLayout}>
          <Item label="商品名称：">
            {getFieldDecorator( 'name', {
              initialValue: '',
              rules: [
                {required: true, message: '商品名称必须输入'}
              ]
            }
            )(
              <Input placeholder="请输入商品名称"/>
            )}
          </Item>
          <Item label="商品描述：">
          {getFieldDecorator( 'desc', {
              initialValue: '',
              rules: [
                {required: true, message: '商品描述必须输入'}
              ]
            }
            )(
              <TextArea placeholder="请输入商品描述" autosize ={{minRows: 2, maxRows: 6}} />
            )}
          </Item>
          <Item label="商品价格：">
          {getFieldDecorator( 'price', {
              initialValue: '',
              rules: [
                {required: true, message: '商品价格必须输入'},
                {validator: this.validatePrice}
              ]
            }
            )(
              <Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>
            )}
            
          </Item>
          <Item label="商品分类：">
            <div>商品分类</div>
          </Item>
          <Item label="商品图片：">
            <div>商品图片</div>
          </Item>
          <Item label="商品详情：">
            <div>商品详情</div>
          </Item>
          <Item>
            <Button type="primary">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
 
export default Form.create()(ProductAddUpdate)