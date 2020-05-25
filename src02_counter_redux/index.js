import React from 'react'
import ReactDOM from 'react-dom'
// import 'antd/dist/antd.css'
import App from './App'
import store from './redux/store'
/**
 * 入口js文件
 */
ReactDOM.render(
  <App store = {store}/>, document.getElementById('root')
)
// 给store绑定 状态更新的监听
store.subscribe(() => { // store内部的状态数据发生改变时回调
  // 重新渲染app标签
  ReactDOM.render(
    <App store = {store}/>, document.getElementById('root')
  )
})