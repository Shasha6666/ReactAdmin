import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
// import 'antd/dist/antd.css'
import App from './containers/App'
import store from './redux/store'

/**
 * 入口js文件
 */
ReactDOM.render(
  (<Provider  store = {store}>
    <App/>
  </Provider>), document.getElementById('root')
)
