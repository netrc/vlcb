// npm install express
// npm install jade
// npm install mongolian
// npm install coffee-script

var express = require('express');
require('jade');
var DbMgr = require('./db2');
var vroutes = require('./vroutes');

//CORS middleware
//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
//http://cuppster.com/2012/04/10/cors-middleware-for-node-js-and-express/
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


var app = express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('foobar'));
app.use(express.session());
app.use(express.bodyParser());
app.use(allowCrossDomain);
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
app.get('/pic', vroutes.pic);
app.get('/software', vroutes.software);
app.get('/dobatch', vroutes.doBatch);
// rest interfaces
app.get('/rest/Note/about', vroutes.restGetAboutMD);
app.post('/rest/Note/about', vroutes.restPostAboutMD);
app.get('/rest/Pic',vroutes.restGetPic);
app.post('/rest/Pic', vroutes.restPostPic);
app.get('/rest/Church',vroutes.restGetChurch);
app.get('/rest/Church/:cname',vroutes.restGetChurchShow);
app.get('/rest/Brass',vroutes.restGetBrass);
app.get('/rest/Church/:cname/Brass',vroutes.restGetBrassByChurch);
app.get('/rest/Church/:cname/Pic',vroutes.restGetPicByChurch);
app.post('/rest/Church/:cname/latlon',vroutes.restPostChurch_latlon);
app.get('/rest/Rubbing',vroutes.restGetRubbing);
app.get('/rest/Rubbing/:vlcn/Pics',vroutes.restGetPicsByRubbing);


DbMgr.initConn( "vlc", "vlcmdb!", "ds033307.mongolab.com", "33307", "vlcbtest");
console.log('initConn - done');

app.listen(process.env.PORT);
console.log('listening on '+ process.env.PORT);