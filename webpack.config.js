var path = require('path');
var webpack = require('webpack');

module.exports = {
  // context: __dirname + "",
  entry: [
    // javascript: "./js/index.js",
    // html: "../index.html"
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './public/js/index.js'
  ],

  output: {
    path: path.join(__dirname, "/public/dist"),
    filename: "app.js",
    publicPath: '/public/dist/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    extensions:['', '.js']
  },
  
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["react-hot-loader", "babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=react"],
      }
      // ,
      // {
      //   test: /\.html$/,
      //   loader: "file?name=[name].[ext]"
      // }
    ]
  }
}
