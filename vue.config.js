const path = require('path')

const devServerPort = 9810

module.exports = {
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        './src/less/normalise.less',
        './src/less/var.less'
      ]
    }
  },
  chainWebpack(config) {
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
