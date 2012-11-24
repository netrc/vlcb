
var Mongolian = require("mongolian");

var mdbConnStr;
var mdb;
var noteColl, brassColl, rubbingColl, churchColl, picColl;

exports.initConn = function (mdbUser, mdbPwd, mdbHost, mdbPort, mdbDbName) {
		mdbConnStr = "mongo://" + mdbUser + ":" + mdbPwd + "@" + mdbHost + ":" + mdbPort + "/" + mdbDbName;

		console.log("initConn: "+mdbConnStr);
		mdb = new Mongolian(mdbConnStr);
       
        noteColl = mdb.collection("Note");
        churchColl = mdb.collection("Church");
        picColl = mdb.collection("Pic");
        rubbingColl = mdb.collection("Rubbing");
        brassColl = mdb.collection("Brass");
};

exports.collectionNames = function() {
       mdb.collectionNames( function( err, val ) {
            if (err) {
                console.warn("Error getting collection names: "+err);
            } else {
                console.log("cnames: " + val);
            }
        });
};

// 'about' is one specific note
exports.about = function(doIt) {
    noteColl.findOne( {category:'aboutNote'}, function(err,docData){
        if (err) {
            docData = { mdtext: "error finding 'about' note: " + err };
        }
        docData._id = "";    // this val is very long and involved, so I clear it  
        console.log("about: "+docData.mdtext);
        doIt(docData);
    } );
};

exports.aboutStore = function(newText, doIt) {
    // mongodb  db.people.update( { name:"Joe" }, { $inc: { n : 1 } } );
    //noteColl.findOne( {category:'aboutNote'}, function(err,docData){
    var newAboutNote = { category: 'aboutNote', date: 'foo', mdtext: newText };
    noteColl.update( {category:'aboutNote'}, newAboutNote, function(err,docData){
        if (err) {
            console.error("error updating 'about' note: " + err);
        }
        doIt();
    } );
};

var dbFindAll = function( mColl, doIt) {
    mColl.find({}).toArray(function(err, valArray) {
        if (err) {
            console.error("dbFindAll error:" + err);
            valArray = [];
        }
        valArray.forEach(function(p){p._id="";});  // don't pass _id; big uninteresting string
        doIt(valArray);
    });    
}

exports.churchAll = function(doIt) {
    dbFindAll(churchColl, doIt);
};

exports.brassAll = function(doIt) {
    dbFindAll(brassColl, doIt);
};

exports.rubbingAll = function(doIt) {
    dbFindAll(rubbingColl, doIt);
};


exports.picAll = function(doIt) {
    dbFindAll(picColl, doIt);
};

exports.pic = {
    coll : picColl,
    findAll : function(doIt) {
        dbFindAll(this.coll, doIt);
    }
};

exports.picFindOne = function (name, doIt) {
    picColl.findOne( {name:name}, function(err,picData){
        if (err) {
            picData = { mdtext: "error finding '"+name+"' pic: " + err };
        }
        picData._id = "";   
        console.log("pic found: ");
        doIt(picData);
    } );
};
exports.picStore = function(picObj, doIt) {
    // mongodb  db.people.update( { name:"Joe" }, { $inc: { n : 1 } } );
    //noteColl.findOne( {category:'aboutNote'}, function(err,docData){
    picColl.update( {name:picObj.name}, picObj, function(err,picObj){
        if (err) {
            console.error("error updating '"+picObj.name+"' pic: " + err);
        }
        doIt();
    } );
};
