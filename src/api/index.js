/**
 * 要求：能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

import ajax from "./ajax"
import jsonp from 'jsonp'

// 登录请求的接口
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
// 添加用户的接口
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')
// 通过jsonp请求获取天气的值
export const reqWeather = (city) => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=TTgFOsWYqQtZm3CSToBVkY71GOGF3XHv`
  // 发送jsonp请求
  return new Promise((resolve, reject) => {
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      if(!err && data.status === 'success') {
        // 取出需要的数据
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        alert('获取天气信息失败！')
      }
    })
  })
}
reqWeather('北京')