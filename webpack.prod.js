const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js')

const appCSS = new ExtractTextPlugin('style.css');
const customCSS = new ExtractTextPlugin('custom.css');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /app\.scss$/,
        use: appCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /custom\.scss$/,
        use: customCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /styleAnimation\.scss$/,
        use: appCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
    ]
  },
  plugins: [
    appCSS, customCSS,
    new CopyWebpackPlugin([
      { from: 'src/webfonts', to: 'webfonts' },
      { from: 'src/assets', to: 'assets' },
      { from: 'src/settings.txt', to: '' },
      { from: 'src/locales', to: 'locales' },
    ])
  ]
})
