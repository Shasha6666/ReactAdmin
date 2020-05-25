/**
 * 包含n个用来创建action的工厂函数
 */
import {INCREMENT, DECREMENT} from './action-types'
/**
 * 增加的action
 */
export const increment = number => ({type: INCREMENT, data: number})
/**
 * 减少的action
 */
export const decrement = number => ({type: DECREMENT, data: number})
/**
 * 异步的action
 */
export const incrementAsync = number => {
    return dispatch => {
        // 执行异步（定时器，ajax，promise）
        setTimeout(() => {
            // 当前异步任务执行完成时，分发一个同步action
            dispatch(increment(number))
        }, 1000);
    }
}