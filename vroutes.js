
var Md = require('markdown').markdown;
var DbMgr = require('./db2');

// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { thisAction: 'Main'});
};

exports.about = function(req, res) {
    DbMgr.about(function(data){
        //console.log('back in about, md:'+Md.toHTML(data.mdtext));
        res.render('about.jade', { thisAction: 'About', mdtext: Md.toHTML(data.mdtext)});
    });
};

// needs to return just the raw markdown text
exports.restGetAboutMD = function(req,res) {
    DbMgr.about( function(data){
        res.send(data.mdtext);
    });
};
// puts the markdown text back to the database, then returns the rendered text (the page or the text?)
// exports.restAboutPut = function(req,res) {
//    DbMgr.aboutPut(function(req=.data){
//        res.render('about.jade', { thisAction: 'About', mdtext: Md.toHTML(req.data)});
//      or res.send( Md.toHTML(req.data) );
//    });
//};
//
// OR.... about.html could have the html template, and then read() calls the restGet AJAX/REST to put in the html'd data
//  but that just simplifies exports.about by 1 line (in other words, gets rid of DbMgr in .about; DbMgr calls then just in two rest functions)
//
// This restXXXGet called from javascript in the html page may be the paradigm for other pages....