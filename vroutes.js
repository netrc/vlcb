
var Md = require('markdown').markdown;
var DbMgr = require('./db2');

// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { thisAction: 'Main'});
};

exports.about = function(req, res) {
//    DbMgr.about(function(data){
//        console.log('about route, md:'+Md.toHTML(data.mdtext));
//        res.render('about.jade', { thisAction: 'About', mdtext: Md.toHTML(data.mdtext)});
//    });
    console.log('about route2');
    res.render('about.jade', { thisAction: 'About'});
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

exports.restGetGenericField = function(req,res) {
    console.log("ggf: " + req.params.cat + " name: " + req.params.name + " field: " + req.params.field);
    DbMgr.getGenericField( req.params.cat, req.params.name, req.params.field, function(data) {
        res.send( data );
    });
};

// needs to return just the raw markdown text
exports.restGetAboutMD = function(req,res) {
    console.log("rgam: tf:", req.query.tFormat);
    var currFormat = (req.query.tFormat === "HTML") ? "HTML" : "markdown";
    console.log("rgam: cf:", currFormat);
    DbMgr.about( currFormat, function(data){
        res.send((currFormat==="HTML") ? data.htmltext : data.mdtext);
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

exports.restGetChurch_mainNote = function(req, res) {
    console.log("get cmn: tf:", req.query.tFormat);
    var currFormat = (req.query.tFormat === "HTML") ? "HTML" : "markdown";
    console.log("get cmn: cf:", currFormat);
    DbMgr.note( "Church", req.params.cname, currFormat, function(data){
        res.send((currFormat==="HTML") ? data.htmltext : data.mdtext);
    });    
};
exports.restPostChurch_mainNote = function( req, res ) {
    var newText = req.body.value;
    //console.log("put new text:"+newText);
    DbMgr.noteStore( "Church", req.params.cname, newText, function(){
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
exports.restGetPicsByCategory = function(req,res) {
    DbMgr.picsByCategoryIndex( req.params.cat, req.params.name, function(pa){
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
//  and note that this returns the new value -- assumed to be used for jeditable simple fields that want that val back
exports.restPostGenericField = function(req,res) {
    var cat = req.params.cat;
    var name = req.params.name;
    var field = req.params.field;
    var newVal = req.body.value;
    console.log("pgf cat:" + cat + " n:" + name + " f:" + field + " v:" + newVal);
    DbMgr.postGenericField( cat, name, field, newVal, function() {
        res.send(newVal);
    });
};

exports.restGetRubbing = function(req,res) {
    DbMgr.rubbingAll( function(pa){
       res.send(pa); 
    });
};
exports.restGetPicsByRubbing = function(req,res) {
    DbMgr.picsByRubbing( req.params.vlcn, function(pa){
       res.send(pa); 
    });
};

//
// OR.... about.html could have the html template, and then read() calls the restGet AJAX/REST to put in the html'd data
//  but that just simplifies exports.about by 1 line (in other words, gets rid of DbMgr in .about; DbMgr calls then just in two rest functions)
//
// This restXXXGet called from javascript in the html page may be the paradigm for other pages....

exports.software = function(req, res) {
    res.render('software.jade');
};

//////////////////
exports.doBatch = function(req,res) {
    DbMgr.doBatch( function() {
        res.send("OK");
    } );
};