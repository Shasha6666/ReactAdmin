import React, { Component } from 'react'
import {Card, Select, Input, Icon, Button, Table,message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option
/**
 * 商品默认首页路由组件
 */
class ProductHome extends Component {
  state = {
    total: 0, // 返回的总记录数
    loading: false, // 是否显示正在加载
    products: [], // 商品列表，默认为空 
    searchType:'productName', // 搜索类型，默认按商品名称搜索
    searchName:'' // 搜素的关键字
  }
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price // 当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 200,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status=== 1 ? 2 : 1
          return (
            <span style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
              <Button type='primary' onClick={() => this.updateStatus(_id, newStatus)}>
                {status === 1 ? '下架': '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
          </span>
          )
          }
      },
      {
        width: 150,
        title: '操作',
        render: (product) => (
          <span style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
          </span>
        )
      }
    ]
  }
  /**
   * 更新商品状态
   */
  updateStatus = async(productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品状态成功')
      this.getProducts(this.pageNum)
    }
  }
  getProducts = async(pageNum) => {
    this.pageNum = pageNum
    this.setState({loading: true}) // 显示loading
    const {searchName, searchType} = this.state
    // 如果搜索关键字有值，说明我们要做搜索分页
    let result
    if(searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {
      console.log('不按关键字搜索')
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    console.log('result', result)
    this.setState({loading: false})
    if(result.status === 0) {
      // 取出分页数据，更新状态，显示列表
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() { 
    const {products, total, loading, searchType, searchName} = this.state
    const title = (
      <span>
        <Select 
          value={searchType} 
          style={{width: 120}}
          onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
          placeholder='关键字' 
          style={{width: 200, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button 
          type='primary'
          onClick={() => this.getProducts(1)}
        >搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        添加
      </Button>
    )
    return ( 
      <Card title={title} extra={extra}>
        <Table 
          loading={loading}
          bordered
          rowKey='_id'
          dataSource={products} 
          columns={this.columns}
          pagination={
            {
              defaultPageSize: PAGE_SIZE, 
              showQuickJumper:true,
              total: {total},
              onChange: this.getProducts
            }
          }
        />
      </Card>
    )
  }
}
 
export default ProductHome
/**
 * 分页列表
 *   1. 纯前台分页
 *      请求获取数据：一次获取所有数据，翻页时不需要再发请求
 *      请求接口：
 *          不需要指定请求参数：页码（pageNum）和每页数量（pageSize）
 *          响应数据：所有数据的数组
 *   2. 后台分页
 *      请求获取数据：每次只获取当前页的数据，翻页时要发请求
 *      请求接口：
 *         需要指定请求参数：页码（pageNum）和每页数量（pageSize）
 *         响应数据：当前页数据的数组+总的数据个数（total）
 *   3. 如何选择
 *      基本根据数据多少来选择
 */