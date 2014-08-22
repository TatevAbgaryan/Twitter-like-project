var express			= require('express');
var router			= express.Router();
var simple_recaptcha= require('simple-recaptcha');
var request			= require('request');
var autoIncrement	= require('mongoose-auto-increment');
var mongoose		= require('mongoose');
var db				= mongoose.connection;
var datetime		= new Date();

var connection = mongoose.connect('mongodb://localhost/twitter');
autoIncrement.initialize(connection);

var urlschema = new mongoose.Schema({
	furl:String
}, {collection: 'surls'});
var postschema = new mongoose.Schema({
	text:String,
	hashes:String,
	date:Date
}, {collection: 'posts'});

urlschema.plugin(autoIncrement.plugin, 'url');

var url = mongoose.model('url', urlschema);
var post = mongoose.model('post', postschema);

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Twitter' });
});

router.post('/submit', function(req, res){
	var text = req.body.msg;

	var privateKey = '6LfS8vgSAAAAABZmF5jVCaSggRe_rbRjL-Aossol'; // your private key here
	var ip = req.ip;
	var challenge = req.body.recaptcha_challenge_field;
	var response = req.body.recaptcha_response_field;

	simple_recaptcha(privateKey, ip, challenge, response, function(err) {
		if (err) {
			return res.json(String(err))
		} else {
			var pieces = text.split(/[\s,-]+/);
			var hashes = [];
			var urls = [];
			for(var i=0; i<pieces.length; ++i){
				// alert(pieces[i]);
				var c = pieces[i].search("#");
				var b = pieces[i].search("http://");
				var n = pieces[i].search("https://");
				if(c == 0){
					hashes.push(pieces[i]);
				} else if(b == 0 || n == 0) {
					urls.push(pieces[i]);
					var towriteurl = new url({
						furl:pieces[i]
					});
					towriteurl.save(function(err, data) {
						if (err) return console.error(err);
					});
				}
				if(i == pieces.length-1){
					var towriteposts = new post({
						text:text,
						hashes:hashes,
						date:datetime
					});
					towriteposts.save(function(err, data) {
						if (err) return console.error(err);
					});
				}
			}

			res.json(urls + " " + hashes);
		};
	});
});
router.get(/^\/s\/(\d+)$/, function (req, res, next) { // /s/123 tesqi cankacac request kanchum a es function@
    var urlid = req.url.substr(3);
    url.find({ '_id': urlid }, function (err, docs) {
		var toredirect = docs[0].furl;
		res.redirect(toredirect);
	});
});

module.exports = router;
