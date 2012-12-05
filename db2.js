
var Mongolian = require("mongolian");

var mdbConnStr;
var mdb;
var noteColl, brassColl, rubbingColl, churchColl, picColl;

exports.initConn = function (mdbUser, mdbPwd, mdbHost, mdbPort, mdbDbName) {
		mdbConnStr = "mongo://" + mdbUser + ":" + mdbPwd + "@" + mdbHost + ":" + mdbPort + "/" + mdbDbName;

		console.log("initConn: "+mdbConnStr);
		mdb = new Mongolian(mdbConnStr);

       mdb.collectionNames( function( err, val ) {
            if (err) {
                console.warn("Error getting collection names: "+err);
            } else {
                console.log("cnames: " + val);
            }
        });

        noteColl = mdb.collection("Note");
        churchColl = mdb.collection("Church");
        picColl = mdb.collection("Pic");
        rubbingColl = mdb.collection("Rubbing");
        brassColl = mdb.collection("Brass");        
};

// 'about' is one specific note
exports.about = function(doIt) {
    noteColl.findOne( {category:'aboutNote'}, function(err,docData){
        if (err) {
            docData = { mdtext: "error finding 'about' note: " + err };
        }
        delete(docData._id);    // this val is very long and involved, so I clear it  
        //console.log("about: "+docData.mdtext);
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

exports.postChurch_latlon = function( cn, val, doIt ) {
    console.log("pcll: "+cn + " - " + val);
    churchColl.update( {name:cn}, { $set: { latlon: val } }, function(err,docData){
        if (err) {
            console.error("error updating latlon: " + err);
        }
        doIt();
    } );
    
};

// expecting just one specific note, e.g. for Church, Brass
exports.note = function(c, t, doIt) {
    var sObj = { category: c, title: t };
    // need to check if t is blank
    noteColl.findOne( sObj, function(err,docData){
        if (err) {
            docData = { mdtext: "no note: " + err };
        }
        delete(docData._id);    // this val is very long and involved, so I clear it  
        //console.log("about: "+docData.mdtext);
        doIt(docData);
    } );
};


var dbFindAll = function( mColl, sObj, doIt) {
    mColl.find(sObj).toArray(function(err, valArray) {
        if (err) {
            console.error("dbFindAll error:" + err);
            valArray = [];
        }
        valArray.forEach(function(p){delete(p._id);});  // don't pass _id; big uninteresting string
        doIt(valArray);
    });    
};

exports.churchAll = function(doIt) {
    dbFindAll(churchColl, {}, doIt);
};
exports.churchFind = function(n, doIt) {
    churchColl.findOne( {name: n}, function(err, d) {
        if (err) {
            console.error("db church Find ("+n+") error:"+err);
            d = {};
        }
        console.log("db church find("+n+"): "+d);
        delete(d._id);
        doIt(d);
        } );
};

exports.brassAll = function(doIt) {
    dbFindAll(brassColl, {}, doIt);
};
exports.brassByChurch = function(n,doIt) {
    dbFindAll(brassColl, {church:n}, doIt);
};
exports.picByChurch = function(n,doIt) {
    //console.log("db2 get pic by curch: ",n);
    dbFindAll(picColl, {category:"Church", name:n}, doIt);
};

exports.rubbingAll = function(doIt) {
    dbFindAll(rubbingColl, {}, doIt);
};


exports.picAll = function(doIt) {
    dbFindAll(picColl, {}, doIt);
};
exports.picStore = function(pn, pc, pt, pf, doIt) {
    var newPic = { category: pc, name: pn, thumb: pt, full: pf };
    console.log("db2 store pic: ",pn);
    picColl.insert( newPic, function(err,docData){
        if (err) {
            console.error("error updating 'pict': " + err);
        }
        doIt();
    } );
    console.log("db2 store pic done");
};

/// these are not developed yet. trying to get a class set up
exports.xxxpic = {
    coll : picColl,
    findAll : function(doIt) {
        dbFindAll(this.coll, doIt);
    }
};

exports.xxxpicFindOne = function (name, doIt) {
    picColl.findOne( {name:name}, function(err,picData){
        if (err) {
            picData = { mdtext: "error finding '"+name+"' pic: " + err };
        }
        picData._id = "";   
        console.log("pic found: ");
        doIt(picData);
    } );
};
exports.xxxpicStore = function(picObj, doIt) {
    // mongodb  db.people.update( { name:"Joe" }, { $inc: { n : 1 } } );
    //noteColl.findOne( {category:'aboutNote'}, function(err,docData){
    picColl.update( {name:picObj.name}, picObj, function(err,picObj){
        if (err) {
            console.error("error updating '"+picObj.name+"' pic: " + err);
        }
        doIt();
    } );
};

var Br = require("./views/batch-nNames");
exports.doBatch = function(doIt) {
/*
    console.log("db dobatch");
    Br.rArray5.map( function(r) {
        rubbingColl.update( {vlcn:r.vlcn}, {$set: r.$set}, function(err,r){
            if (err) {
                 console.error("error updating r:"+r.vlcn+" err: " + err);
            };
        } );
        } );
*/
    console.log("db dobatch pic");
    var t, ufull, pn;
    Br.pArray1.map( function( uthumb ) {
        t = uthumb.split("/");
        pn = t[8].split(".")[0];
        t[7] = "s800";
        ufull = t.join("/");
        console.log ("pn:"+pn + "  uf:"+ufull);
    });
    doIt();
};
// old batch
//    Br.rArray1.map( function(r) { rubbingColl.insert(r); } );
//    Br.rArray2.map( function(r) { rubbingColl.insert(r); } );
