import store from 'store'
const USER_KEY = 'user_key'
/**
 * 包含n个操作local storage的工具函数的模块
 */
export default {
  // 保存user
  saveUser(user) {
    // localStorage中只能保存string，如果传递的是对象，就自动调用对象的toString()保存
    // localStorage.setItem(USER_KEY,JSON.stringify(user)) // 保存的必须是对象的json串
    store.set(USER_KEY, user) // 内部会自动转化为json再保存
  },
  // 读取user
  getUser() { // 如果存在，返回的需要是对象，如果没有值，返回{}
    // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY) || {}
  },
  // 删除user
  removeUser() {
    // localStorage.removeItem(USER_KEY)
    return store.remove(USER_KEY)
  }
}