
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  // publicPath: process.env.NODE_ENV === "production" ? "/vueDataV/" : "/",
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        target: "https://www.fastmock.site/mock/e2c192dbb092225e614b35bc114b4667/bigScreen",
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: (config)=>{
    //修改文件引入自定义路径
    config.resolve.alias
      .set('modelVanKe', resolve('public/static/modelVanKe'))
  },
  configureWebpack: {
    // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
    externals: {
     'jquery' : '$',
     'echarts': 'echarts',
     'axios' : 'axios'
    },
    // resolve:{
    //   alias:{
    //     // 'modelVanKe':path.resolve(__dirname,'public/static/modelVanKe')
    //     'modelVanKe': 'public/static/modelVanKe'
    //   }
    // }
  }
};