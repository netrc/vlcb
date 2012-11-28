// npm install express
// npm install jade
// npm install mongolian
// npm install coffee-script

var express = require('express');
require('jade');
require('coffee-script');
var DbMgr = require('./db2');
var vroutes = require('./vroutes');

var app = express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('foobar'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static('views'));   // will check this dir for undefined pages...

app.set('views', __dirname + '/views');  // sets render dir

// html views
app.get('/', vroutes.vindex);
app.get('/about', vroutes.about);
app.get('/church', vroutes.church);
app.get('/church/:cname', vroutes.churchShow);
app.get('/brass', vroutes.brass);
app.get('/rubbing', vroutes.rubbing);
// rest interfaces
app.get('/rest/Note/about', vroutes.restGetAboutMD);
app.post('/rest/Note/about', vroutes.restPostAboutMD);
app.get('/rest/Pic',vroutes.restGetPic);
app.get('/rest/Church',vroutes.restGetChurch);
app.get('/rest/Church/:cname',vroutes.restGetChurchShow);
app.get('/rest/Brass',vroutes.restGetBrass);
app.get('/rest/Church/:cname/Brass',vroutes.restGetBrassByChurch);
app.get('/rest/Church/:cname/Pic',vroutes.restGetPicByChurch);
app.get('/rest/Rubbing',vroutes.restGetRubbing);


DbMgr.initConn( "vlc", "vlcmdb!", "ds033307.mongolab.com", "33307", "vlcbtest");
console.log('initConn - done');

app.listen(process.env.PORT);
console.log('listening on '+ process.env.PORT);