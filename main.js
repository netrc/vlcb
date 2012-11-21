// npm install express
// npm install jade
// npm install mongolian

var express = require('express');
require('jade');
var vroutes = require('./vroutes');

var app = express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('foobar'));
app.use(express.session());
app.use(app.router);
app.use(express.static('views'));   // will check this for pages...

app.set('views', __dirname + '/views');

app.get('/', vroutes.vindex);
app.get('/about', vroutes.about);


app.listen(process.env.PORT);
console.log('listening on '+ process.env.PORT);