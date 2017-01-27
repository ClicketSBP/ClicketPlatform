const passport = require('passport'),
    config = require('../../config/subporter.config'),
    jwt = require('jwt-simple'),
    authorization = require('../helpers/authorization');

const authenticate = (req, res, next) => {
    if (passport.authenticate('jwt', { session: false })) {
		try {
			let token = authorization.getToken(req.headers);
			if (token) {
				let user = jwt.decode(token, config.jwt_secret);
				if (user) {
					req.jwtUser = user;
					req.granted = true;
				} else {
					req.granted = false;
				}
			} else {
				req.granted = false;
			}
		} catch (err) {
			req.granted = false;
		}
    } else {
		req.granted = false;
	}
    next();
};

module.exports = authenticate;