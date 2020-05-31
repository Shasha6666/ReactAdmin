import {createStore, applyMiddleware} from "redux"
import reducer from './reducer'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
// redux最核心的管理对象
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))