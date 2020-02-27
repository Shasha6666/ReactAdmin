import React from 'react'
import ReactDOM from 'react-dom'
// import 'antd/dist/antd.css'
import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
/**
 * 入口js文件
 */
// 将app组件渲染到index页面的div上
const user = storageUtils.getUser()
// 如果localStorage中保存了user，将user保存到内存中
if (user && user._id) {
  memoryUtils.user = user
}
ReactDOM.render(
  <App/>, document.getElementById('root')
)
