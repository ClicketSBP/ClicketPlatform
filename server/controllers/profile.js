const mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports.profileRead = function (req, res) {
	if (!req.payload._id) {
		res.status(401);
		res.json({
			"message": "UnauthorizedError: private profile"
		});
	} else {
		User.findById(req.payload._id)
			.exec(function (err, user) {
                res.status(200);
				res.json(user);
			});
	}
};