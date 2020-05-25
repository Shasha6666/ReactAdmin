/**
 * reducer函数模块：根据当前state和指定action返回一个新的state
 */
import {combineReducers} from 'redux'
import {INCREMENT, DECREMENT} from './action-types'
/**
 * 管理count状态数据的reducer
 */
function count(state=1, action) {
    switch(action.type) {
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}

/**
 * 管理user状态数据的reducer
 */
const initUser = {}
function user(state = initUser, action) {
    switch (action.type) {
        default:
            return state
    }
}
/**
 * combineReducers函数：接收包含所有reducer函数的对象，返回一个新的reducer函数（总reducer）
 * 总reducer函数管理的state的结构是一个对象
 */
export default combineReducers({
    count,
    user
})