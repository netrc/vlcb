
// module "Software

var DbMgr = require("./db2");
var Version = require("./version");

exports.doTest = function ( tn, req, res ) {
    if ( tn == "rubbingOK") {
        return( testRubbingOK(req, res) );
    } else if ( tn == "brassOK") {
        return( testRubbingOK()() );
    } else if ( tn == "churchOK"){
        return( testRubbingOK()() );
    }
};

// Simple Q/A Progress Tests
// - return a triple
//      - num ok
//      - total num
//      - array of names of not ok
var testRubbingOK = function(req, res) {
    
    return ( DbMgr.rubbingAll( "", {}, function(ra) {
        var total = ra.length;
        var numOK = 0;
        var notOKarray = [];

        ra.forEach( function(r) {
           if ((r.brass) && (r.brass != "unknown")) {
               numOK++;
           } else {
               notOKarray.push( [r.vlcn, r.name]);
           }
        });
        console.log("nok: "+numOK+" t:"+total);
        res.send([ numOK, total, notOKarray, Version.VersionString() ]);
    }) ); 
};
