const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
	},
  plugins: [
    new CopyPlugin([
      { from: 'src/webfonts', to: 'webfonts' },
      { from: 'src/library.json', to: '' },
      { from: 'src/locales', to: 'locales' },
      { from: 'src/ATSV', to: 'ATSV' }
    ])
  ],
})
