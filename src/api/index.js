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
  const url = `http://v.juhe.cn/weather/index?format=2&cityname=${city}&key=81f583558962dd121fb5b7f6bff8467e`
  // 发送jsonp请求
  return new Promise((resolve, reject) => {
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      if(!err && data.error_code === 0) {
        // 取出需要的数据
        const {weather, temperature} = data.result.today
        resolve({weather, temperature})
      } else {
        alert('获取天气信息失败！')
      }
    })
  })
}
// 获取分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})
// 添加分类
export const reqAddCategory = ({parentId, categoryName}) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')
// 根据id获取分类的名称
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})
// 根据ID/Name搜索产品分页列表,searchType表示搜索的类型：productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {pageNum, pageSize, [searchType]:searchName})
// 更新商品状态
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')