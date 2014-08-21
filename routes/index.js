var express = require('express');
var router = express.Router();
var simple_recaptcha = require('simple-recaptcha');

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
			res.json(text);
		};
	});
});

module.exports = router;
