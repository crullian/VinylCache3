var path = require('path');

var DATABASE_URI = require(path.join(__dirname, './server/env')).DATABASE_URI;

var mongoose = require('mongoose');

mongoose.connect(DATABASE_URI);

var server = require('./server');

var port = process.env.PORT || 1335;

mongoose.connection.once('open', function() {
  server.listen(port, function() {
    console.log('Server started on port: ', port);
  });
});