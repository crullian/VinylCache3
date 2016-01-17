var path = require('path');
var webpack = require('webpack');
var isDev = (process.env.NODE_ENV !== 'production');

var DATABASE_URI = require(path.join(__dirname, './server/env')).DATABASE_URI;

var mongoose = require('mongoose');

mongoose.connect(DATABASE_URI);

var server = require('./server');

var port = process.env.PORT || 1335;

mongoose.connection.once('open', function() {
  server.listen(port, function() {
    console.log('NODE Server started on port: ', port);
  });
});

if (isDev) {
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('./webpack.config.js');
  new WebpackDevServer(webpack(config), {
     publicPath: config.output.publicPath,
     hot: true,
     stats: {colors: true},
     historyApiFallback: true,
     inline: true
  }).listen(8080, 'localhost', function (err, result) {
     if (err) {
       console.log(err);
     }

     console.log('WEBPACK Listening at localhost:8080');
  });
}