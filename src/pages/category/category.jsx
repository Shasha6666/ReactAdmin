import React, { Component } from 'react'
import {Card, Button, Icon, Table, message, Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/**
 * 品类管理路由组件
 */
class Category extends Component {
  state = {
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类子列表
    loading: false, // 是否显示数据正在加载中
    parentId: '0',
    parentName: '',
    showStatus: 0 // 显示新增/更新对话框，0：不显示，1：显示新增，2：显示更新
  }

  /**
   * 初始化Table所有列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/** 如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据*/}
            {this.state.parentId === '0' ?  <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
          </span>
        )
      },
    ];
  }
  /**
   * 异步获取一级分类列表显示
   */
  getCategorys = async() => {
    const {parentId} = this.state
    this.setState({loading: true})
    const result = await reqCategorys(parentId)
    this.setState({loading: false})
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        // 更新一级列表
        this.setState({categorys})
      } else {
        // 更新二级列表
        this.setState({subCategorys: categorys})
      }
    } else {
      message.error('获取列表失败')
    }
  }
  /**
   * 指定一级分类对应的二级分类列表
   */
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { // 在状态更新且重新render()后执行
      this.getCategorys()
    })
  }
  /**
   * 显示指定一级分类列表--修改state中的状态为显示一级列表的状态即可
   */
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  // 为第一次render准备数据/处理同步请求数据
  componentWillMount() {
    this.initColumns()
  }
  // 执行异步任务：发异步ajax请求
  componentDidMount() {
    // 获取一级分类列表显示
    this.getCategorys()
  }
  // 显示新增分类的操作
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 更新状态
    this.setState({
      showStatus: 2
    })
  }
  /**
   * 处理取消的点击事件
   */
  handleCancle = () => {
    // 清楚输入数据
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }
  /**
   * 处理新增的事件
   */
  addCategory = () => {
    console.log('新增分类')
  }
  /**
   * 处理更新的事件
   */
  updateCategory = async() => {
    console.log('更新分类')
    // 1.隐藏确认框
    this.setState({
      showStatus: 0
    })
    const categoryId = this.category._id
    const categoryName = this.form.getFieldValue('categoryName')
    // 清楚输入数据
    this.form.resetFields()
    // 2.发请求更新分类
    const result = await reqUpdateCategory({categoryName, categoryId})
    if (result.status === 0) {
      // 3.重新显示列表
      this.getCategorys()
    }
  }
  render() { 
    // 读取状态数据
    const {categorys, loading, parentId, parentName, subCategorys, showStatus} = this.state
    // 读取指定的分类
    const category = this.category || {} // 如果没有指定为{}
    const title = parentId === '0' ? "一级分类列表" : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{marginRight: 5}}></Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type = "plus"/> 添加
      </Button>
    )
    return ( 
      <Card title={title} extra={extra}>
        <Table 
          dataSource={parentId === '0' ? categorys: subCategorys} 
          columns={this.columns} 
          loading={loading}
          bordered 
          rowKey="_id"
          pagination={{defaultPageSize: 5, showQuickJumper:true}}
          />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancle}
        >
          <AddForm/>
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancle}
        >
          <UpdateForm 
            categoryName={category.name}
            setForm={(form) => {this.form=form}}
          />
        </Modal>
      </Card>
    )
  }
}
 
export default Category