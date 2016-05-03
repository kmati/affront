var webpack = require('webpack');
var path = require('path');
//const ExtractTextPlugin = require('extract-text-webpack-plugin')

// const sassLoaders = [
//   'css-loader',
//   'postcss-loader',
//   'sass-loader?indentedSyntax=scss&includePaths[]=' + path.resolve(__dirname, './client')
// ]

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'lib');

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.js/,
        include : APP_DIR,
        loader : 'babel',
        query: {
          presets: ['es2015']
        }
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      // },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ],
    // plugins: [
    //   new ExtractTextPlugin('[name].css')
    // ]
  }
};

module.exports = config;
