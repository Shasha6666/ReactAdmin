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
    products: [
      {
        "status": 1,
        "imgs": [
            "image-1559402396338.jpg"
        ],
        "_id": "5ca9e05db49ef916541160cd",
        "name": "联想ThinkPad 翼4809",
        "desc": "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9",
        "price": 65999,
        "pCategoryId": "5ca9d6c0b49ef916541160bb",
        "categoryId": "5ca9db9fb49ef916541160cc",
        "detail": "<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！</span> 222</p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">99999</span></p>\n",
        "__v": 0
    },
    {
        "status": 1,
        "imgs": [
            "image-1559402448049.jpg",
            "image-1559402450480.jpg"
        ],
        "_id": "5ca9e414b49ef916541160ce",
        "name": "华硕(ASUS) 飞行堡垒",
        "desc": "15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
        "price": 6799,
        "pCategoryId": "5ca9d6c0b49ef916541160bb",
        "categoryId": "5ca9db8ab49ef916541160cb",
        "detail": "<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">华硕(ASUS) 飞行堡垒6 15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)火陨红黑</span>&nbsp;</p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">【4.6-4.7号华硕集体放价，大牌够品质！】1T+256G高速存储组合！超窄边框视野无阻，强劲散热一键启动！</span>&nbsp;</p>\n",
        "__v": 0
    }
    ], // 商品列表，默认为空 
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
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status=== 1 ? 2 : 1
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(_id, newStatus)}>
                {status === 1 ? '下架': '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
          </span>
          )
          }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
            <LinkButton>修改</LinkButton>
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
      <Button type='primary'>
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