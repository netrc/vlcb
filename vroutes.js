
// Main/simple routes

exports.vindex = function(req, res) {
    res.render('index.jade', { thisAction: 'Main', title:'vlc-r'});
};

exports.about = function(req, res) {
    res.render('about.jade', { thisAction: 'About'});
};
