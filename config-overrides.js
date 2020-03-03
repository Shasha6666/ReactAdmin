const { override, fixBabelImports, addLessLoader } = require('customize-cra')
module.exports = override(
    // 针对antd实现按需加载，根据import来打包（使用babel-plugin-import）
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,  // 自动打包相关样式
  }),
  //  使用less-loader对源码中的less变量进行修改
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
)