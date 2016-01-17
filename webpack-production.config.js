var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './public/js/index.js'
  ],

  output: {
    path: path.join(__dirname, "/public/dist"),
    filename: "app.js",
    publicPath: '/public/dist/'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],

  resolve: {
    extensions: ['', '.js']
  },
  
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=react"],
      }
    ]
  }
}