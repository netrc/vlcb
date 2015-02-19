
var Mongolian = require("mongolian");

var mdbConnStr;
var mdb;
var noteColl, brassColl, rubbingColl, churchColl, picColl, logColl;

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
        logColl = mdb.collection("Log");
};

// not exported
var log = function(actionStr, detailStr) {
    var n = new Date();
    detailStr = (detailStr) ? detailStr.substring(100) : "";
    var newLog = {secs: n.getTime(), date: n.toLocaleString(), action: actionStr, detail: detailStr.substring(100) };
    logColl.insert( newLog,  function(err,docData){
        if (err) {
            console.error("error logging: " + err);
        }
    });  
};

exports.getGenericField = function ( cat, name, field, doIt ) {
    var thisColl = mdb.collection(cat);
    thisColl.findOne( {name: name}, function(err, docData) {
        if (err) {
            console.error("error finding: " + cat + " name:" + name + " (field: " + field + ")"); 
        } else {
            if (docData[field]) {
                doIt(docData[field]);
            } else {
                console.error("error finding field: " + cat + " name:" + name + " field: " + field); 
            }
        }
    });
};
exports.postGenericField = function ( cat, name, field, val, doIt ) {
    var thisColl = mdb.collection(cat);
    var fv = {}; fv[field] = val;
    var indexFieldName = (cat === "Rubbing") ? "vlcn" : "name";
    var i = {}; i[indexFieldName] = name;
    console.log("index "+indexFieldName+": "+i[indexFieldName]+ " field: "+field+" val: "+val);
    thisColl.update( i, { $set: fv }, function(err, docData) {
        if (err) {
            console.error("error updating: " + cat + " name:" + name + " (field: " + field + ")"); 
        } 
        // not much else goes on with Post
        log( "post: "+cat+"/"+name+"/"+field,val);
        doIt();
    });
};


// expecting just one specific note, e.g. for Church, Brass
exports.note = function(c, t, doIt) {
    if (!t) { t = ""; }
    console.log("db note: c:"+c+" t:"+t);
    var sObj = { category: c, title: t };
    // need to check if t is blank
    noteColl.findOne( sObj, function(err,docData){
        if (! docData) {
            docData = { mdtext: "*no note found*" };
        }
        if (err) {
            docData = { mdtext: "error getting note: " + err };
        }
        delete(docData._id);    // this val is very long and involved, so I clear it  
        //console.log("about: "+docData.mdtext);
        doIt(docData);
    } );
};
exports.noteStore = function(c, t, newText, doIt) {
    if (!t) { t = ""; }   // just for single category notes, e.g. about, bibliography...
//    var n = new Date();
//    var newNote = { category: c, title: t, date: n.toLocaleString(), mdtext: newText };
//    var newNote = { category: c, title: t, mdtext: newText };
//    ... now using $set notation to just update the mdtext field
    noteColl.update( {category:c, title: t}, { $set : { mdtext: newText } }, function(err,docData){
        if (err) {
            console.error("error updating 'about' note: " + err);
        }
        log("note store for "+c+"/"+t, newText);
        doIt();
    } );
};

var dbFindAll = function( mColl, sObj, doIt) {
    mColl.find(sObj).sort({name:1}).toArray(function(err, valArray) {
        if (err) {
            console.error("dbFindAll error:" + err);
            valArray = [];
        }
        //console.log("dbfa: va.l="+valArray.length);
        valArray.forEach(function(p){delete(p._id);});  // don't pass _id; big uninteresting string
        doIt(valArray);
    });    
};

exports.churchAll = function( searchText, sortType, doIt) {
    var searchArg = {};
    //if (searchText !== "") {
     //  searchArg = { mainNote : { $regex: searchText, $options:'ix' } };
    //
    dbFindAll(churchColl, searchArg, doIt);
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

exports.brassAll = function( searchText, sortType, doIt) {
    var searchArg = {};
    //if (searchText !== "") {
    //    searchArg = { mainNote : { $regex: searchText, $options:'ix' } };
    //}
    dbFindAll(brassColl, searchArg, doIt);
};

exports.brassByChurch = function(n,doIt) {
    dbFindAll(brassColl, {church:n}, doIt);
};

exports.rubbingByBrass = function(n,doIt) {
    dbFindAll(rubbingColl, {brass:n}, doIt);
};


exports.rubbingAll = function( searchText, sortType, doIt) {
    var searchArg = {};
    //if (searchText !== "") {
    //    searchArg = { mainNote : { $regex: searchText, $options:'ix' } };
    //}
    dbFindAll(rubbingColl, searchArg, doIt);
};

var bsort = function(a, b) {
    return (b.secs - a.secs);
};

exports.logAll = function(doIt) {
    dbFindAll(logColl, {}, function(la) {
        la.sort(bsort);
        doIt(la);
        } );
};

exports.blogAll = function(doIt) {
    dbFindAll(noteColl, {category:"blog"}, function(ba) {
        ba.sort(bsort);
        doIt(ba);
        } );
};

// check out http://feedvalidator.org/
exports.rssCreate = function(doIt) {
    dbFindAll(noteColl, {category:"blog"}, function(ba) {
        ba.sort(bsort);
        var rssString = '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>';
        rssString += '<title>VLCB Blog</title><description>The Blog for the website of Virginia Lee Campbell\'s Brass Rubbings</description>';
        rssString += '<link>http://vlcb.herokuapp.com/</link>';
        for (var i=0; i<(ba.length);i++) {
            var b = ba[i];
            rssString += '<item>';
            rssString += '<title>' + b.title + '</title>';
            rssString += '<link>http://vlcb.herokuapp.com/blog/</link>';
            rssString += '<pubDate>' + b.date.substring(0,25) + '-0500</pubDate>';
            rssString += '<guid>' + b.secs + '</guid>';
            rssString += '<description>' + b.mdtext + '</description>';
            rssString += '</item>';
        }
        rssString += '</channel></rss>';
        doIt(rssString);
        } );
        };


exports.picsByCategoryIndex = function( c, x, doIt ) {
    dbFindAll( picColl,  { category: c, name: x }, doIt );
};

exports.picAll = function(doIt) {
    dbFindAll(picColl, {}, doIt);
};
exports.picStore = function(pn, pc, pt, pf, doIt) {
    var newPic = { category: pc, name: pn, thumb: pt, full: pf };
    //console.log("db2 store pic: ",pn);
    picColl.insert( newPic, function(err,docData){
        if (err) {
            console.error("error updating 'pict': " + err);
        }
        log("new "+pc+" pic",pn);
        doIt();
    } );
    console.log("db2 store pic done");
};

exports.brassStore = function(bn, doIt) {
    var newBrass = { name: bn };
    console.log("db2 store brass: ",bn);
    brassColl.insert( newBrass, function(err,docData){
        if (err) {
            console.error("error updating 'brass': " + err);
        }
        log("new brass",bn);
        doIt();
    } );
    console.log("db2 store brass done");
};

exports.blogStore = function(bn, doIt) {
    var n = new Date();
    var newBlog = { category: "blog", title: bn, secs: n.getTime(), date: n.toLocaleString() };
    console.log("db2 store blog: ",bn, "  secs:",n.getTime(), "  date:",n.toLocaleDateString());
    noteColl.insert( newBlog, function(err,docData){
        if (err) {
            console.error("error updating 'blog': " + err);
        }
        log("new blog",bn);
        doIt();
    } );
    console.log("db2 store blog done");
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

exports.dumpData = function( doIt ) {
    console.log("dumpdata...");
    dbFindAll(brassColl,{}, function(bData){
        dbFindAll(churchColl, {}, function(cData) {
            dbFindAll(rubbingColl,{}, function(rData) {
                dbFindAll(picColl,{}, function(pData) {
                    dbFindAll(noteColl, {}, function(nData) {
                        var dumpJSON = JSON.stringify( {
                                            copyright : "copyright(2012) Richard Campbell",
                                            brassArray : bData,
                                            churchArray : cData,
                                            rubbingArray : rData,
                                            picArray : pData,
                                            noteArray : nData
                                            });
                        doIt(dumpJSON);                                                                    
                    });
                });
            });
        });
    });
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
/*
    console.log("db dobatch pic");
    var t, ufull, tn,pn,newPic;
    Br.pArray1.map( function( uthumb ) {
        t = uthumb.split("/");
        tn = t[8].split(".")[0];
        pn = tn.replace(/%2520/g,"");
        t[7] = "s800";
        ufull = t.join("/");
        console.log ("pn:"+pn + "  uf:"+ufull);
        newPic = { category: "Rubbing", name: pn, thumb: uthumb, full: ufull };
        picColl.insert( newPic, function(err,docData){
            if (err) {
                console.error("error updating 'pict': " + err);
            }
        } );
    });
*/
/* Fix up pic names!!
   var newp, newpn;
    picColl.find({ name: /-/ }).toArray(function(err, valArray) {
        if (err) {
            console.error("dbFindAll error:" + err);
            valArray = [];
        }
        valArray.forEach(function(p){
            newpn = p.name.replace("VLC-","").replace(/-[a-z12]/,"").replace(/[a-z]$/,"");
            console.log("pcname:"+p.name+ " newp:",newpn);
            newp = { name: newpn, category: p.category, thumb : p.thumb, full: p.full };
            picColl.update( {name:p.name}, newp, function(err,docData){
                if (err) {
                console.error("error updating pic: " + err);
                }
           });
        });
    });
*/
    doIt();
};
// old batch
//    Br.rArray1.map( function(r) { rubbingColl.insert(r); } );
//    Br.rArray2.map( function(r) { rubbingColl.insert(r); } );
