const mongoose = require('mongoose'),
    config = require('./subporter.config'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = mongoose.model('User');

const passportConfig = (passport) => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: config.jwt_secret
    };

    passport.use(new JwtStrategy(options, (jwt, next) => {
        User.findOne({
            email: jwt.email
        }, function(err, user) {
            if (err) {
                return next(err, false);
            } else if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    }));
};

module.exports = passportConfig;