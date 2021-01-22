const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js')
const ZipFilesPlugin = require('webpack-zip-files-plugin');
var path = require("path");
const VersionFile = require('webpack-version-file');

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
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      }
    ]
  },
  plugins: [
    appCSS, customCSS, 
    new VersionFile({
      output: './src/version.txt'
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'src/assets', to: 'assets' },
          { from: 'src/settings.txt', to: 'settings.txt' },
          { from: 'src/library.json', to: 'library.json' },
          { from: 'src/locales', to: 'locales' },
          { from: 'src/version.txt', to: 'version.txt' }
        ]
      }),
    new ZipFilesPlugin({
      entries: [
        { src: path.join(__dirname, './dist'), dist: 'release' }
      ],
      output: path.join(__dirname, './release'),
      format: 'zip',
    })
  ]
})
