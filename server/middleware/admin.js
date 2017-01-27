const mongoose = require('mongoose'),
    User = mongoose.model('User');

const admin = (req, res, next) => {
    if (req.granted) {
        User.getUserByEmailForAuth(req.jwtUser.email, (err, user) => {
            if (err) {
                req.granted = false;
            } else {
                if (user.admin === true) {
                    req.granted = true;
                } else {
                    req.granted = false;
                }
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = admin;