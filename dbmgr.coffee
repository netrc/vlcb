
class CBase
    constructor: (@cname) ->
		@coll = DbMgr.mdb().collection(@cname)
		# if it exists, maybe log count() # else create

	setUniqueIndex: (field) ->
		@coll.ensureIndex( { field : 1 }, {unique:true} )
	validate: ->
	add: (doc) ->
		console.log("cb inserting another")
		@coll.insert( doc )
	delete: ->
	all: (cb) ->
		console.log("cb all of " + @cname + ":")
		@coll.find({}).toArray (err, ca) =>
			cb(null, ca)
	dump: ->
		console.log("cb dump of " + @cname + ":")
		@coll.find({}).forEach  (t) => 
			console.log("cbdump-" + @cname + ": "+t.name)
	findById: ->
	findByName: ->
	searchText: ->

# * required; ^ reference
# { *name, address, year, geoAddress, ^pics, ^notes }
class Church extends CBase
	constructor: () ->
		super "Church"
		#@setUniqueIndex("name");
	validate: (aDoc) ->
	getLatLon: (cb) ->
		@coll.find({} , {"name":1, "latlon":1}).toArray (err, ca) =>
			cb(null,ca)

# { *name, *church, year, loc, ^pics, ^notes }   # primary note or Description?
class Brass extends CBase
	constructor: () ->
		super "Brass"
		#@setUniqueIndex("name");
	validate: (aDoc) ->

# { *name, *brass, yearRubbed, pics, notes }   # primary note or Description?
class Rubbing extends CBase
	constructor: () ->
		super "Rubbing"
		#@setUniqueIndex("name");
	validate: (aDoc) ->

# { *name, *urlFull, urlThumb }
class Pic extends CBase
	constructor: () ->
		super "Pic"
		#@setUniqueIndex("name");
	validate: (aDoc) ->

# { *id?, *richText, dateCreated }  # track updates?/changes?
class Note extends CBase
	constructor: () ->
		#super "Note"
		@setUniqueIndex("name");
	validate: (aDoc) ->

# log of db changes?

# do we need a class Colindex to track autoincrement index numbers

class DbMgr
	@initConn: (mdbUser, mdbPwd, mdbHost, mdbPort, mdbDbName) ->
		@_mdbConnStr = "mongo://" + mdbUser + ":" + mdbPwd + "@" + mdbHost + ":" + mdbPort + "/" + mdbDbName

		@Mongolian = require("mongolian")
		console.log("initConn: "+@_mdbConnStr)
		@_mdb = new @Mongolian(@_mdbConnStr)
		

	@mdb: =>
		return(@_mdb)

	@church: =>
		return(@_church)

	@brass: =>
		return(@_brass)

	@rubbing: =>
		return(@_rubbing)

	@pic: =>
		return(@_pic)

	@note: =>
		return(@_note)

	@test2: ->
		console.log("t2")
		@_church.add()
		@_church.dump()
		@_brass.dump()


module.exports = DbMgr
