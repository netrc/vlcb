
var DbMgr = require('./db2');
var Software = require('./software');

// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { thisAction: 'Main'});
};

exports.rubbing = function(req, res) {
    res.render('rubbing.jade', { thisAction: 'Rubbing'});
};

exports.brass = function(req, res) {
    res.render('brass.jade', { thisAction: 'Brass'});
};

exports.church = function(req, res) {
    res.render('church.jade', { thisAction: 'Church', cname: ""});
};

exports.churchShow = function(req, res) {
    console.log("yep, got to cs. cs:" + ((req.params.cname) ? req.params.cname : "no cname"));
    res.render('church.jade', { thisAction: 'Church', cname: req.params.cname});
};

exports.map = function(req, res) {
    res.render('map.jade', { thisAction: 'map'});
};

exports.about = function(req, res) {
    res.render('about.jade', { thisAction: 'About'});
};

exports.software = function(req, res) {
    res.render('software.jade');
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
    DbMgr.rubbingAll( function(pa){
       res.send(pa); 
    });
};

exports.restXeditSelectChurch = function(req,res) {
    DbMgr.churchAll( function(ca){
        var selArray = [];
        ca.forEach( function(c) {
            selArray.push( { value: c.name, text: c.name} );
        });
        selArray.push( { value: "unknown", text: "unknown" });
       res.send(selArray); 
    });
};

exports.restXeditSelectBrass = function(req,res) {
    DbMgr.brassAll( function(ba){
        var selArray = [];
        ba.forEach( function(b) {
            selArray.push( { value: b.name, text: b.name} );
        });
        selArray.push( { value: "unknown", text: "unknown" });
       res.send(selArray); 
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
