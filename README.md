vlcb
====

== Todo
- package.json
- banner
- Church list
- Church add
- test scripts for mongolab
- google analytics
- powered by vim, c9.io, node.js, bootstrap, mondodb, mongolab, jeditable, express
- fixup CDNs
- not used? knockout.js
- not needed? content flow - http://www.jacksasylum.eu/ContentFlow/

== Arch
- json on mongolab
- pics on picasa
- node.js and client javascript
- infinite scroll for lists
- Rubbings, Brasses, Churches, Notes - Map, Quality
- host somewhere - heroku

== Done
- add mongodb
- set up mongolab host
- tabs (nope - using bootstrap)
- bootstrap carousel - http://twitter.github.com/bootstrap/examples/carousel.html#
- bootstrap ?

== Data Model
* General
* * 1-to-N relationship is held solely by "backrefs" from each N to 1
* * 1-to-1 is held solely by "forward ref" (meaning e.g. from Brass to mainpic)
* Church -  name, address, latlon, mainpic, note
* * note includes pamphlet link; other pics are from pic item 'index' value back to church name
* Brass - name, church, location, year, tags, mainpic, note
* * n.b. back link from brass to church name; location is place inside the church
* Rubbing - vlcnum, brass, name, location, date, mainpic, note
* * things like inscription, framed, condition, foil are in the text of the note
* Note - name, tag, date, [versionNum]
* * tag is a category, e.g. About, blog, brass; (n.b. don't need an index here)
* * could be immutable and just add new versions....
* Pic - name, tag, index, thumburl, fullurl
* * tag is a category, index is the key back to the item (brass, church)

Seems like the right thing to do is put values like "note" and "pics", which
are really related to just one thing (a church or brass) into their enclosing doc
(the church doc or brass doc). But that makes updating cumbersome - when changing
a picture's owner, e.g. a church, you need to update the old owner and the new owner
doc. By separting into a quasi-"normal" form, you can update in just one place.

== Notes on c9.io
- npm install jade
- npm install mongolian
- npm install express
- git remote add origin git@github.com:C9Support/testPush.git 

node.js
* http://nodemanual.org/latest/
* http://nodeguide.com/style.html

Hosting
* https://github.com/joyent/node/wiki/Node-Hosting
* http://webbynode.com - 384MB/18GBdisk/256GBbandwidth - $15/month
* http://nodejitsu.com/paas/pricing.html - free dev ; $3/month 1drone
* http://www.cloudfoundry.com/ from VMware; free for now??
* http://www.heroku.com/ - 1 dyno free; 1 worker $35/month
* * - http://support.cloud9ide.com/entries/20710298-deploy-your-application-to-heroku
* * - https://devcenter.heroku.com/articles/nodejs
* http://www.webfaction.com/services/hosting  - $6-$9/month
* http://aws.amazon.com/ec2/pricing/
* * small $0.065/hour == $46/month   - reserved small $69/year == $6/month
* * micro $0.02 = $15/month
* * spot instance small - $5/m
* http://www.rackspace.com/cloud/public/sites/pricing/ - $150/m !!

jade
* http://www.devthought.com/code/use-jade-blocks-not-layouts/
* https://github.com/visionmedia/jade#a18
* http://shapeshed.com/creating-a-basic-site-with-node-and-express/
* http://scalate.fusesource.org/documentation/jade-syntax.html

express

mongo
* https://mongolab.com/databases/vlcbtest/collections/
* mongodb - http://www.mongodb.org/display/DOCS/node.JS;jsessionid=6DCF010D05B06229511682DD673568FA
* mongolian - https://github.com/marcello3d/node-mongolian

bootstrap and html
* http://www.appelsiini.net/projects/jeditable

OtherCDNs
* http://www.bootstrapcdn.com/
* http://cdnjs.com/index.html
* http://cachedcommons.org/


old notes on myhost
* added git
    # rpm -Uvh http://repo.webtatic.com/yum/centos/5/latest.rpm
	# yum install --enablerepo=webtatic git-all