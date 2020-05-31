/**
 * redux库的主模块
 * 1）redux库向外暴露下面几个函数
 *     createStore()：接收的参数为reducer函数，返回为store对象
 *     combineReducers():接收包含n个reducer方法的对象，返回一个新的reducer函数
 *     applyMiddleware():暂不实现
 * 2）store对象的内部结构
 *     getState():返回值为内部保存的state数据
 *     dispatch():参数为action对象
 *     subscribe():参数为监听内部state更新的回调函数
 */
/**
 * 根据指定的reducer函数创建对象并返回
 * @param {指定的} reducer 
 */
export function createStore(reducer) {
    // 用来存储内部状态数据的变量,初始值为调用reducer函数返回的结果（外部指定的默认值）
    let state = reducer(undefined, {type: '@@redux/init'})
    // 用来存储监听state更新回调函数的数组容器
    const listeners = []
    /**
     * 返回当前内部的state数据
     */
    function getState () {
        return state
    }
    /**
     * 分发action
     * 1）触发reducer调用
     * 2）保存新的state
     * 3）调用所有已存在的监视回调函数
     * @param {*} action 
     */
    function dispatch (action) {
        const newState = reducer(state, action)
        state = newState
        listeners.forEach(listener => listener())
    }
    /**
     * 绑定内部state改变的监听回调
     * 可以给一个对象绑定多个监听
     * @param {} listener 
     */
    function subscribe (listener) {
        // 保存到环迅listener容器中
        listeners.push(listener)
    }

    // 返回store
    return {
        getState,
        dispatch,
        subscribe
    }
}
/**
 * 整合传入参数对象中的多个reducer函数，返回一个新的reducer
 * @param {*} reducers 
 */
/**
 * 得到的总状态的结构
 * {
 *   count:count(state.count, action),
 *   user:user(state.user, action)
 * }
 */
export function combineReducers(reducers) {
    return (state ={}, action) => {
        const newState = Object.keys(reducers).reduce((preState, key) => {
            preState[key] = reducers[key](state[key], action)
            return preState
        }, {})
        return newState
    }
}