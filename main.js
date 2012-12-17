// npm install express
// npm install jade
// npm install mongolian
// npm install coffee-script
// checking trello

var express = require('express');
require('jade');
var DbMgr = require('./db2');
var vroutes = require('./vroutes');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

// ????
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var AppBaseUrl = 'http://vlcb.netrc.c9.io/';
if (process.env.NODE_ENV === "production") {
    // set: heroku config:add NODE_ENV=production --app vlcb
    AppBaseUrl = 'http://vlcb.netrc.heroku.com/';
}
var PassportReturnUrl = AppBaseUrl + 'auth/google/return';
var PassportRealm = AppBaseUrl;

passport.use(new GoogleStrategy({
    returnURL: PassportReturnUrl,
    realm: PassportRealm
  },  function(identifier, profile, done) {
//    User.findOrCreate({ openId: identifier }, function(err, user) {
//      done(err, user);
//    });
        console.log("google has returned:");
        console.log("ident: "+identifier);
        console.log("profile: dn:" + profile.displayName+" email:"+ profile.emails[0].value);
        // maybe this is where I figure out the authorization role? reader / editor
      //profile.identifier = identifier;
      profile.role = "vlcbEditor";
      return done(null, profile);        
  }
));


var vlcbAuthorization = function( req, res, next ) {
    if (req.method != "POST") {
        return next();   // not a POST, go ahead
    }
    if ( (req.user) && (req.user.role == "vlcbEditor")) {
        return next();   // POST and an editor, go ahead
    }
    // POST but not an editor !!
    //console.log("vlcba:", req.method, ":not permitted");
    // set a res.flashUnauthPost
    res.redirect('back');
};


var app = express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('foobar'));
app.use(express.bodyParser());
app.use(express.session({ secret: 'vlcb!083c4n#M.vAs' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(vlcbAuthorization);
app.use(app.router);
app.use(express.static('views'));   // will check this dir for undefined pages...

app.set('views', __dirname + '/views');  // sets render dir

// html views
app.get('/', vroutes.vindex);
app.get('/about', vroutes.about);
app.get('/church', vroutes.church);
app.get('/church/:cname', vroutes.churchShow);  // TODO no more church show, this is a 'search'
app.get('/brass', vroutes.brass);
app.get('/rubbing', vroutes.rubbing);
app.get('/pic', vroutes.pic);
app.get('/software', vroutes.software);
app.get('/dobatch', vroutes.doBatch);
// Authorization / Passport
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/login' } ));
// rest interfaces
app.get('/rest/dumpData',vroutes.restDumpData);
app.get('/rest/Note/about', vroutes.restGetAboutMD);
app.post('/rest/Note/about', vroutes.restPostAboutMD);
app.get('/rest/Pic',vroutes.restGetPic);
app.post('/rest/Pic', vroutes.restPostPic);
app.get('/rest/Church',vroutes.restGetChurch);
app.get('/rest/Church/:cname',vroutes.restGetChurchShow);  // TODO no more Church show
app.get('/rest/Church/:cname/Brass',vroutes.restGetBrassByChurch);
app.get('/rest/Church/:cname/Pic',vroutes.restGetPicByChurch);
//app.post('/rest/Church/:cname/latlon',vroutes.restPostChurch_latlon);
//app.get('/rest/Church/:cname/mainNote',vroutes.restGetChurch_mainNote);
//app.post('/rest/Church/:cname/mainNote',vroutes.restPostChurch_mainNote);
app.get('/rest/Brass',vroutes.restGetBrass);
app.post('/rest/Brass',vroutes.restPostBrass);
app.get('/rest/Rubbing',vroutes.restGetRubbing);
app.get('/rest/Rubbing/:vlcn/Pics',vroutes.restGetPicsByRubbing);
app.get('/rest/:cat/:name/Pics', vroutes.restGetPicsByCategory);
app.get('/rest/:cat/:name/:field', vroutes.restGetGenericField);
app.post('/rest/:cat/:name/:field', vroutes.restPostGenericField);
app.get('/rest/xeditSelect/Church',vroutes.restXeditSelectChurch);
app.get('/rest/xeditSelect/Brass', vroutes.restXeditSelectBrass);

DbMgr.initConn( "vlc", "vlcmdb!", "ds033307.mongolab.com", "33307", "vlcbtest");
console.log('initConn - done');

app.listen(process.env.PORT);
console.log('listening on '+ process.env.PORT);