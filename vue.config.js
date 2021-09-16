const Timestamp = new Date().getTime()

const path = require('path')

// 导入compression-webpack-plugin
const CompressionPlugin = require('compression-webpack-plugin');

// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 转译不能兼容ie的插件中的es6写法
  transpileDependencies: [],
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/index.scss";`,
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  chainWebpack: c => {
    c.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@com', resolve('src/components'))
      .set('@utils', resolve('src/utils'))
    // 开启js、css压缩
    if (isProduction) {
      c.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|svg|json|html)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false // 删除源文件
        }));
    }
  },
  configureWebpack: {
    name: 'vue3项目',
    output: { // 输出重构  打包编译后的 文件名称
      filename: `js/[name].[hash].${Timestamp}.js`,
      chunkFilename: `js/[name].[hash].${Timestamp}.js`
    }
  },
  // webpack-dev-server 相关配置
  devServer: {
    port: 5000,
    // proxy: {// 设置代理
    //   '/api': {
    //     target: 'http://127.0.0.1:3000/',
    //     changeOrigin: false
    //   }
    // },
    // before: app => { }
  },
  // 第三方插件配置
  pluginOptions: {}
}
