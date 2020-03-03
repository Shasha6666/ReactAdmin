import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Admin from './pages/admin/admin'
import Login from './pages/login/login'
/**
 * 应用的根组件
 */
export default class App extends React.Component{
  render() {
    return (
      <BrowserRouter>
        <Switch> 
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}