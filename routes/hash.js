var express = require('express');
var router = express.Router();
var mime 			= require('mime');
var mongoose = require('mongoose');
var db = mongoose.connection;

var connection = mongoose.createConnection('mongodb://localhost/twitter');

var post = mongoose.model('post');
var url = mongoose.model('url');

router.get('/', function(req, res) {
	res.send('please specify hash');
});
router.get(/^\/(\w+)$/, function (req, res, next) { // /s/123 tesqi cankacac request kanchum a es function@
	var hash = req.url.substr(1);
	post.find({ 'hashes': new RegExp("#" + hash, "i") }, function (err, docs) {
		var allposts = "";
		for (var i = 0; i < docs.length; i++) {
			var finaltext = docs[i].text;
			finaltext = finaltext.replace(/(\s#[a-z0-9][a-z0-9\-_]*)/ig, function(hashtag){ // /#/hash
				return ' <a href="/hash/' + hashtag.substr(2) + '">' + hashtag.trim() + '</a>'
			});
			allposts += "<div> " + finaltext + " </div>";
			if (i == docs.length-1) {
				res.render('hash', { title: '#' + hash, posts: allposts });
			};

		};

	});
});

module.exports = router;