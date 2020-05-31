import React, { Component } from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/**
 * 折线图路由组件
 */
class Line extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20], 
    stores:  [15, 30, 46, 20, 20, 40]
  }
  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store - 1)
        return pre
      }, [])
    }))
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
          type: 'line',
          data: sales
        },
        {
          name: '库存',
          type: 'line',
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
 
export default Line