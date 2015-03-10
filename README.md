vlcb
====

== Bugs
- jeditable? calls latlon Get - GET /rest/Church/St.%20Laurence/latlon?id=clatlon 404 1ms

== Todo
- package.json
- banner
- Church list - which details?
- Church add
- Church full show
- Church full show edit
- make sure *all* updates use $set functionality
- test scripts for mongolab
- data import for mongolab
- pic picture in About text
- global search
- session login for editing - https://coldie.net/?p=88
- Rubbing search, brass search, church search, notes search
- Rubbing page - filter/sort by none, year, brass, church, shire
- VLC Diary - one note or multi?
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
* General - See https://github.com/netrc/vlcb/wiki/DataArchitecture
* Church -  name, address, latlon, mainpic, note
* Brass - name, church, location, year, tags, mainpic, note
* Rubbing - vlcnum, status, brass, name, location, date, mainpic, note
* Note - name, tag, date, [versionNum]
* Pic - name, tag, index, thumburl, fullurl

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

Tagging
* get done with revision and tests
* git commit and git push origin (to github)
* git tag -a vNextNum    (creates tag with current commit SHA1)
* git push tags  (to github)
* put 'git show vNextNum' text in to version.js
* git commit and git push origin
* git push master heroku

Security
* see https://console.developers.google.com/project/general-test-1/apiui/credential
* n.b. the google app name is 'generalTest'
* upgraded to OAuth2 with passport and google auth march 2015

Locations
* 1 - 7 : 7B on display
* 8 - 33 : 7B box in workroom
* 34 - 58 : 7B box in workroom
* 59 - 76 : 7B upstairs closet (larger rubbings)
* 77 - 83 : external - Jody
* 84 - 92 : 7B box in workroom
* 93 - 100 : 7B box in workroom
* 101 - 106 : external - jody, ginny, jim
* 107 - 111 : TBD 7B atop box in workroom
* 112 - 120 : TBD sitting room foil