import React, { Component } from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/**
 * 柱状图路由组件
 */
class Bar extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20], 
    stores:  [15, 30, 46, 20, 20, 40]
  }
  update = () => {
    const sales = this.state.sales.map(sale => sale + 1)
    const stores = this.state.stores.map(_store => _store - 1)
    this.setState({
      sales, stores
    })
  }
  getOptions = (sales, stores) => {
    return {
      title: {
        text: 'Echarts xxxxxx'
      },
      tooltip: {

      },
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"] 
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: sales
        },
        {
          name: '库存',
          type: 'bar',
          data: stores
        }
      ]
    }
  }
  render() { 
    const {sales, stores} = this.state
    return ( 
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card> 
        <Card title='柱状图一'>
          <ReactEcharts option={this.getOptions(sales, stores)}/>
        </Card> 
      </div>
    )
  }
}
 
export default Bar