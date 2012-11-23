
var Mongolian = require("mongolian");

var mdbConnStr;
var mdb;
var noteColl;

exports.initConn = function (mdbUser, mdbPwd, mdbHost, mdbPort, mdbDbName) {
		mdbConnStr = "mongo://" + mdbUser + ":" + mdbPwd + "@" + mdbHost + ":" + mdbPort + "/" + mdbDbName;

		console.log("initConn: "+mdbConnStr);
		mdb = new Mongolian(mdbConnStr);
       
        noteColl = mdb.collection("Note");
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

exports.about = function(doIt) {
    noteColl.findOne( {category:'aboutNote'}, function(err,docData){
        if (err) {
            docData = { mdtext: "error finding 'about' note: " + err };
        }
        docData._id = "";   
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
