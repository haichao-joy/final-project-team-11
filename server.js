var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var videoPostData = require('./videoPostData.json');

var app = express();
var port = process.env.PORT || 8000;
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'completeTemplate'}));
app.set('view engine', 'handlebars');

app.use(express.json());


//renders main page for renaLand
app.get('/', function(req, res, next){
    res.status(200).render('mainPageTemplate',{videoPosts: videoPostData});
  });


app.get('*', function (req, res, next) {
  res.status(404).render('404Template.handlebars');
  });
  

app.post('/addVideo', function (req, res, next) {
  console.log("test");
  if (req.body && req.body.data-genre && req.body.source && req.body.caption) {
    var videoPost = req.params.videoPost.toLowerCase();
    if (videoPostData[videoPost]) {
      videoPostData.push({
        genre: req.body.data-genre,
        video: req.body.source,
        caption: req.body.caption
      });
    }
    fs.writefile(
      __dirname + '/videoPostData.json',
      JSON.stringify(videoPostData, null, 2),
      function (err,data) {
        if (err) {
          console.log("--err", err);
          res.status(500).send("error");
        }
        else {
          res.status(200).send("successful");
        }
      }
    );
  }
  else {
    next();
  }
});






app.listen(port, function () {
    console.log("== Server is listening on port", port);
});