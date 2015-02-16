
var DbMgr = require('../db2');
var assert = require('assert');


describe("dbtest", function() {

	before( function(){
		DbMgr.initConn( "vlc", "vlcmdb!", "ds033307.mongolab.com", "33307", "vlcbtest");
	} );

	describe('#foobar', function(){
		it('should set foo to 3', function() {
			var foo = 3;
			assert.equal(foo,3,"foo should be set");
			});
		it('xxbar should be 3', function() {
			var bar = 3;
			assert.equal(bar,3,"bar should be set");
			});
		});

	describe('#churchAll', function() {
		var cnum = 22;
		it('should get '+cnum+' churches', function(done) {
			DbMgr.churchAll( {}, "", function(d){
				//console.log("inside dca", d.length);
   				//d.map(function(c){ console.log("c: ",c.name) });
				done(assert.equal(d.length,cnum));
				} );
			});
		});

	describe('#brassAll', function() {
		var bnum = 39;
		it('should get '+bnum+' brasses', function(done) {
			DbMgr.brassAll( {}, "", function(d){
				//console.log("brass length: ",d.length);
				//d.map(function(b){ console.log("b: ",b.name) });
				done(assert.equal(d.length,bnum));
				} );
			});
		});

	describe('#rubbingAll', function() {
		var rnum = 106;
		it('should get '+rnum+' rubbings', function(done) {
			DbMgr.rubbingAll( {}, "", function(d){
				//console.log("rubbing length: ",d.length);
				//d.map(function(c){ console.log("c: ",c.name) });
				done(assert.equal(d.length,rnum));
				} );
			});
		});

	describe('#churchFindOne', function() {
		var cname = "St. Peter and St. Paul";
		var cyear = "1200s";
		it('should find '+cname+' church', function(done) {
			DbMgr.churchFind( cname, function(d){
				//console.log("rubbing length: ",d.length);
				done(assert.equal(d.year,cyear));
				} );
			});
		});



	describe('#bar', function(){
		it('bar should be 3', function() {
			var bar = 3;
			assert.equal(bar,3,"bar should be set");
			});
		});
	});
