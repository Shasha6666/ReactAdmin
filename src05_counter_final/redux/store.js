import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk' // 用来实现redux异步的中间件
import {composeWithDevTools} from 'redux-devtools-extension'
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))