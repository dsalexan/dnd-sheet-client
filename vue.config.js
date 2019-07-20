module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },

  pluginOptions: {
    quasar: {
      theme: 'mat',
      treeShake: true
    }
  },

  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/
  ]
}
