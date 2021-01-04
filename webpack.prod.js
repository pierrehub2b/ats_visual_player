const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const common = require('./webpack.common.js')
var path = require("path");
const RobotstxtPlugin = require("robotstxt-webpack-plugin");

const appCSS = new ExtractTextPlugin('style.css');
const customCSS = new ExtractTextPlugin('custom.css');
const options = {}; // see options below

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
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      }
    ]
  },
  plugins: [appCSS, customCSS,new RobotstxtPlugin(options)]
})
