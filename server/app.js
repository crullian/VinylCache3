var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
module.exports = app;

var publicPath = path.join(__dirname, '../public');
var indexHtmlPath = path.join(__dirname, '../index.html');

var RecordModel = require('./models/record-model');

app.use(express.static(publicPath));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.sendFile(indexHtmlPath);
});

app.get('/records', function(req, res) {
  var modelParams = {};
  if (req.query.artist) {
    modelParams.artist = req.query.artist;
  }
  if (req.query.title) {
    modelParams.title = req.query.title;
  }
  RecordModel.find(modelParams, function(err, records) {
    setTimeout(function() {
      res.send(records);
    }, Math.random() * 3000);
  });
});

app.post('/records', function(req, res) {
  // Reference schema for what is expected as the POST body.
  var recordData = req.body;
  RecordModel.create(recordData, function(err, record) {
    // res.status(200).end();
    if (!err) {
      RecordModel.find({}, function(err, records) {
        res.send(records);
      })
    }
  });
});

app.put('/records/:id', function(req, res) {
  RecordModel.findById(req.params.id, function(err, record) {
    console.log('RECORD', record);
    console.log("REQ.PARAMS: ", req.params);
    console.log("REQ.BODY: ", req.body);
    record.update(req.body, function() {
      record.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Hoooray, Updated!')
          // res.status(200).end();
          RecordModel.find({}, function(err, records) {
            res.send(records);
          })
        }
      })
    })
  })
})

app.delete('/records/:id', function(req, res) {
  RecordModel.findById(req.params.id, function(err, record) {
    record.remove(function(err) {
      if (!err) {
        RecordModel.find({}, function(err, records) {
          res.send(records);
        });
        // res.status(204).end();
      } else {
        console.log(err);
      }
    })
  })
})
