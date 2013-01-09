
var DbMgr = require('./db2');
var Software = require('./software');

// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { title: ''});
};

exports.rubbing = function(req, res) {
    //console.log("r: rname: "+req.params.rname);
    var rname = (req.params.rname) ? req.params.rname : "";
    res.render('rubbing.jade', { title: '/rubbing', rname: rname});
};

exports.brass = function(req, res) {
    //console.log("bs. bn:" + ((req.params.bname) ? req.params.bname : "no bname"));
    var bname = (req.params.bname) ? req.params.bname : "";
    res.render('brass.jade', { title: '/brass', bname: bname});
};

exports.church = function(req, res) {
    //console.log("yep, got to cs. cs:" + ((req.params.cname) ? req.params.cname : "no cname"));
    var cname = (req.params.cname) ? req.params.cname : "";
    res.render('church.jade', { title: '/church', cname: cname});
};

exports.map = function(req, res) {
    var cname = (req.params.cname) ? req.params.cname : "";
    res.render('map.jade', { title: '/map', cname: cname});
};

exports.blog = function(req, res) {
    res.render('blog.jade', { title: '/blog'});
};

exports.note = function(req, res) {
    var noteURL = "/rest/Note/" + req.params.nname + "/";  //n.b. empty title
    res.render('note.jade', { title: '/note/'+req.params.nname, noteURL: noteURL });
};

exports.software = function(req, res) {
    res.render('software.jade', { title: '/software' } );
};

exports.pic = function(req, res) {
    res.render('pic.jade', { title: '/pic'});
};

exports.rss = function(req, res) {
    DbMgr.rssCreate( function( rssString ) {
        res.set({  'Content-Type': 'application/rss+xml' });
        res.send( rssString );
    } );
};

exports.restGetGenericField = function(req,res) {
    console.log("ggf: " + req.params.cat + " name: " + req.params.name + " field: " + req.params.field);
    DbMgr.getGenericField( req.params.cat, req.params.name, req.params.field, function(data) {
        res.send( data );
    });
};

exports.restGetNoteMD = function(req,res) {
    console.log("restGetNoteMD cat:" + req.params.cat + " t: "+req.params.title);
    DbMgr.note(req.params.cat, req.params.title, function(data){
        res.send(data.mdtext);
    });
};

exports.restPostNoteMD = function(req,res) {
    var newText = req.body.value;
    console.log("rest post note: put new text:"+newText);
    DbMgr.noteStore( req.params.cat, req.params.title, newText, function(){
        res.send(newText);
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
        res.redirect("/pic");
    });
};
exports.restPostBrass = function(req,res) {
    var bn = req.param('bn');
    console.log("brass post new:"+bn);
    DbMgr.brassStore( bn, function(d){
        res.redirect("/brass");
    });
};

exports.restPostBlog = function(req,res) {
    var bn = req.param('bn');
    console.log("blog post new:"+bn);
    DbMgr.blogStore( bn, function(d){
        res.redirect("/blog");
    });
};

exports.restGetChurch = function(req,res) {
    //console.log('rGC: query:"' + req.query.search + '" sort:"' + req.query.sort+'"');
    DbMgr.churchAll( req.query.search, req.query.sort, function(pa){
       res.send(pa); 
    });
};

exports.restGetChurchShow = function(req,res) {
    DbMgr.churchFind( req.params.cname, function(pa){
       res.send(pa); 
    });
};

exports.restGetBrass = function(req,res) {
    //console.log('rGB: query:"' + req.query.search + '" sort:"' + req.query.sort+'"');
    DbMgr.brassAll( req.query.search, req.query.sort, function(pa){
       res.send(pa); 
    });
};

exports.restGetBrassByChurch = function(req,res) {
    DbMgr.brassByChurch( req.params.cname, function(pa){
       res.send(pa); 
    });
};

exports.restGetRubbingByBrass = function(req,res) {
    DbMgr.rubbingByBrass( req.params.bname, function(pa){
       res.send(pa); 
    });
};

exports.restGetPicsByCategory = function(req,res) {
    DbMgr.picsByCategoryIndex( req.params.cat, req.params.name, function(pa){
       res.send(pa); 
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
    //console.log('rGR: query:"' + req.query.search + '" sort:"' + req.query.sort+'"');
    DbMgr.rubbingAll( req.query.search, req.query.sort, function(pa){
       res.send(pa); 
    });
};

exports.restXeditSelectChurch = function(req,res) {
    DbMgr.churchAll( "", {}, function(ca){
        var selArray = [];
        ca.forEach( function(c) {
            selArray.push( { value: c.name, text: c.name} );
        });
        selArray.push( { value: "unknown", text: "unknown" });
       res.send(selArray); 
    });
};

exports.restXeditSelectBrass = function(req,res) {
    DbMgr.brassAll( "", {}, function(ba){
        var selArray = [];
        ba.forEach( function(b) {
            selArray.push( { value: b.name, text: b.name} );
        });
        selArray.push( { value: "unknown", text: "unknown" });
       res.send(selArray); 
    });
};

exports.restGetBlog = function(req,res) {
    DbMgr.blogAll( function(pa){
       res.send(pa); 
    });
};

exports.restDumpData = function(req, res) {
    DbMgr.dumpData( function(data) {
        var now = new Date();
        var nVals = [now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() ];
        var fname = "vlcb."+nVals.join("-")+".json";
        res.set({  'Content-Type': 'application/json' });
        res.setHeader('Content-disposition', 'attachment; filename='+fname);
        res.send(data);
    });
};

exports.restQAtest = function(req,res) {
        var tn = req.params.testname;
        //console.log("vr: "+tn)
        Software.doTest(tn, req, res);
};

exports.doBatch = function(req,res) {
    DbMgr.doBatch( function() {
        res.send("OK");
    } );
};
