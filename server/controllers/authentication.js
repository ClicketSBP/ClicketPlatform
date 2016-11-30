const passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

let sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	let user = new User();

	user.name = req.body.name;
	user.email = req.body.email;

	user.setPassword(req.body.password);

	user.save(function (err) {
		let token;
		token = user.generateJwt();
		res.status(200);
		res.json({
			"token": token
		});
	});
};

module.exports.login = function (req, res) {
	passport.authenticate('local', function (err, user, info) {
		let token;

		if (err) {
			res.status(404);
			res.json(err);
			return;
		}

		if (user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				"token": token
			});
		} else {
			res.status(401);
			res.json(info);
		}
	})(req, res);
};