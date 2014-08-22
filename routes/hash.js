var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;

var connection = mongoose.createConnection('mongodb://localhost/twitter');

var post = mongoose.model('post');

/* GET home page. */
router.get('/', function(req, res) {
	res.send('please specify hash');
});
router.get(/^\/(\w+)$/, function (req, res, next) { // /s/123 tesqi cankacac request kanchum a es function@
	var hash = req.url.substr(1);
	var allposts = "";
	post.find({ 'hashes': new RegExp("#" + hash, "i") }, function (err, docs) {
		//res.render('hash', { title: '#' + hash });
		//res.send(typeof docs[0].text)
		for (var i = docs.length - 1; i >= 0; i--) {
			var finaltext = docs[i].text;
			finaltext = finaltext.replace(/(\s#[a-z0-9][a-z0-9\-_]*)/ig, function(hashtag){
				return '<a href="/hash/' + hashtag.split(/#/)[1] + '">' + hashtag.trim() + '</a>'
			});
			allposts += "<div>" + finaltext + "</div>";
		};
		res.send(allposts);
	});
});

module.exports = router;