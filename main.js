// npm install express
// npm install jade
// npm install mongolian

var express = require('express')
  , a = require('jade')
  , app = express();

console.log(express.json());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('foobar'));
app.use(express.session());
app.use(express.static('views'));   // will check this for pages...

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index.jade', {title: 'vlc'});
});

app.listen(process.env.PORT);
console.log('listening on '+ process.env.PORT);