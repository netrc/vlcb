
var Md = require('markdown').markdown;
var DbMgr = require('./db2');

// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { thisAction: 'Main'});
};

exports.about = function(req, res) {
    DbMgr.about(function(data){
        console.log('back in about, md:'+Md.toHTML(data.mdtext));
        res.render('about.jade', { thisAction: 'About', mdtext: Md.toHTML(data.mdtext)});
    });
};
