/**
 * reducer函数模块：根据当前state和指定action返回一个新的state
 */
import {combineReducers} from '../lib/redux'
import {INCREMENT, DECREMENT} from './action-types'
// import { combineReducers } from 'redux'
/**
 * 管理count状态数据的reducer
 */
function count(state=1, action) {
    console.log('count()', action)
    switch(action.type) {
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}

function user(state={}, action) {
    console.log('user()', action);
    switch(action.type) {
        default:
            return state
    }
}
/**
 * 返回一个整合后的reducer
 */
export default combineReducers({
    count,
    user
})
