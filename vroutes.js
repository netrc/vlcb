
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

exports.church = function(req, res) {
    res.render('church.jade', { thisAction: 'Church'});
};

exports.churchShow = function(req, res) {
    res.render('churchShow.jade', { thisAction: 'Church', cname: req.params.cname});
};

exports.brass = function(req, res) {
    res.render('brass.jade', { thisAction: 'Brass'});
};

exports.rubbing = function(req, res) {
    res.render('rubbing.jade', { thisAction: 'Rubbing'});
};

exports.pic = function(req, res) {
    res.render('pic.jade', { thisAction: 'Pic'});
};


// needs to return just the raw markdown text
exports.restGetAboutMD = function(req,res) {
    DbMgr.about( function(data){
        res.send(data.mdtext);
    });
};
// store the raw markdown *and* return html
exports.restPostAboutMD = function(req,res) {
    var newText = req.body.value;
    //console.log("put new text:"+newText);
    DbMgr.aboutStore( newText, function(){
        res.send(Md.toHTML(newText));
    });
};
exports.restGetNoteMD = function(req,res) {
    DbMgr.note(req.params.category, req.params.title, function(data){
        res.send(data.mdtext);
    });
};

exports.restGetPic = function(req,res) {
    DbMgr.picAll( function(pa){
       res.send(pa); 
    });
};
exports.restPostPic = function(req,res) {
    var pn = req.param('pn');
    var pc = req.param('pc');
    var pt = req.param('pt');
    var pf = req.param('pf');
    console.log("vr post new text:"+pn);
    DbMgr.picStore( pn, pc, pt, pf, function(d){
        res.send("");
    });
};

exports.restGetChurch = function(req,res) {
    DbMgr.churchAll( function(pa){
       res.send(pa); 
    });
};

exports.restGetChurchShow = function(req,res) {
    DbMgr.churchFind( req.params.cname, function(pa){
       res.send(pa); 
    });
};

exports.restGetBrass = function(req,res) {
    DbMgr.brassAll( function(pa){
       res.send(pa); 
    });
};
exports.restGetBrassByChurch = function(req,res) {
    DbMgr.brassByChurch( req.params.cname, function(pa){
       res.send(pa); 
    });
};
exports.restGetPicByChurch = function(req,res) {
    DbMgr.picByChurch( req.params.cname, function(pa){
       res.send(pa); 
    });
};
exports.restPostChurch_latlon = function(req,res) {
    var newVal = req.body.value;
    console.log("vr postcl:" + newVal);
    DbMgr.postChurch_latlon( req.params.cname, newVal, function() {
        res.send(newVal);
    });
};

exports.restGetRubbing = function(req,res) {
    DbMgr.rubbingAll( function(pa){
       res.send(pa); 
    });
};

//
// OR.... about.html could have the html template, and then read() calls the restGet AJAX/REST to put in the html'd data
//  but that just simplifies exports.about by 1 line (in other words, gets rid of DbMgr in .about; DbMgr calls then just in two rest functions)
//
// This restXXXGet called from javascript in the html page may be the paradigm for other pages....