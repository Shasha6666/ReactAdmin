import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductHome from './productHome'
import ProductAddUpdate from './productAddUpdate'
import ProductDetail from './productDetail'

/**
 * 商品管理路由组件
 */
class Product extends Component {
  render() { 
    return ( 
      <Switch>
        <Route path='/product' component={ProductHome} exact/> 
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
 
export default Product