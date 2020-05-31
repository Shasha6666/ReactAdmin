import React, { Component } from 'react'
import {Card, Form, Input, Icon, Button,Cascader, message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './picturesWall'
import RichTextEditor from './RichTextEditor'
import memoryUtils from '../../utils/memoryUtils'


const {Item} = Form
const {TextArea} = Input

/**
 * 商品增加和更新路由组件
 */
class ProductAddUpdate extends Component {
  state = {
    options: [],
  }
  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }
  // 获取一级/二级分类列表,并显示
  getCategorys = async(parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      // 如果是一级分类列表
      if(parentId === '0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys // 返回二级列表 ==> 当前async函数返回的promise就会成功且value值为categorys
      }
    }
  }
  initOptions = async(categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))
    // 如果是一个二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option上
      targetOption.children = childOptions
    }
    this.setState({
      options
    })
  }
  validatePrice = (rule, value, callback) => {
    if(value*1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }
  submit =() => {
    this.props.form.validateFields(async(error, values) => {
      if(!error) {
        // 1. 收集数据并封装成对象
        const {name, price, desc, categoryIds} = values
        let pCategoryId, categoryId
        if(categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, price, desc, imgs, detail, pCategoryId, categoryId}
        // 如果是更新
        if(this.isUpdate) {
          product._id = this.product._id
        }
        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        // 3. 根据结果提示
        if(result.status === 0) {
          message.success(`${this.isUpdate? '更新': '添加'}商品成功`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate? '更新': '添加'}商品失败`)
        }
      } else {
        alert('error')
      }
    })
  }
  /**用于加载下一级列表的回调函数 */
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    targetOption.loading = true

    // 根据选中的分类获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if(subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的二级分类没有子分类
      targetOption.isLeaf = true
    }
    // 更新options状态
    this.setState({
     options: [...this.state.options],
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }
  componentWillMount () {
    // 取出携带的state
    const product = memoryUtils.product
    // 保存是否更新的标识
    this.isUpdate = !!product._id
    // 保存商品，如果没有，保存的是{}
    this.product = product || {}
  }
  /**
   * 再卸载之前清除保存的数据
   */
  componentWillUnmount () {
    memoryUtils.product = {}
  }
  render() { 
    const {getFieldDecorator} = this.props.form
    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const categoryIds = []
    if(isUpdate) {
      // 商品是一个一级分类商品
      if(pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }


    // 指定Item布局的配置对象
    const FormItemLayout = {
      labelCol: {span: 2}, // 左侧label的宽度
      wrapperCol: {span: 8} // 右侧包裹的宽度
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{fontSize: 20}}/>
        </LinkButton>
        <span>
          {isUpdate ? '修改商品': '添加商品'}
        </span>
      </span>
    )
    return ( 
      <Card title={title}>
        <Form {...FormItemLayout}>
          <Item label="商品名称：">
            {getFieldDecorator( 'name', {
              initialValue: product.name,
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
              initialValue: product.desc,
              rules: [
                {required: true, message: '商品描述必须输入'}
              ]
            }
            )(
              <TextArea placeholder="请输入商品描述" autoSize ={{minRows: 2, maxRows: 6}} />
            )}
          </Item>
          <Item label="商品价格：">
          {getFieldDecorator( 'price', {
              initialValue: product.price,
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
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: '商品分类必须指定'}
                ]
              })(
                <Cascader 
                  placeholder='请指定商品分类'
                  options={this.state.options}  /* 需要显示的列表数据数组*/
                  loadData={this.loadData}  /*当选择某个列表项，加载下一级的监听回调 */
              />
              )
            }
            
          </Item>
          <Item label="商品图片：">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情：" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
 
export default Form.create()(ProductAddUpdate)
/**
 * 1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
 * 2. 父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
 */