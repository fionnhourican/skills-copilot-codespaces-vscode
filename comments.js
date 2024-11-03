// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var commentsFile = 'comments.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to read comments from file
function readComments(callback) {
  fs.readFile(commentsFile, function(err, data) {
    if (err) {
      console.error('Error reading comments file: ' + err);
      return callback([]);
    }
    try {
      callback(JSON.parse(data));
    } catch (e) {
      console.error('Error parsing comments file: ' + e);
      callback([]);
    }
  });
}

// Function to write comments to file
function writeComments(comments, callback) {
  fs.writeFile(commentsFile, JSON.stringify(comments), function(err) {
    if (err) {
      console.error('Error writing comments file: ' + err);
      return callback(false);
    }
    callback(true);
  });
}

// Function to get comments
app.get('/comments', function(req, res) {
  readComments(function(comments) {
    res.json(comments);
  });
});

// Function to post comments
app.post('/comments', function(req, res) {
  readComments(function(comments) {
    comments.push(req.body);
    writeComments(comments, function(success) {
      if (success) {
        res.json(comments);
      } else {
        res.status(500).send('Error writing comments file');
      }
    });
  });
});

// Function to delete comments
app.delete('/comments', function(req, res) {
  writeComments([], function(success) {
    if (success) {
      res.json([]);
    } else {
      res.status(500).send('Error writing comments file');
    }
  });
});

// Start web server
var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});