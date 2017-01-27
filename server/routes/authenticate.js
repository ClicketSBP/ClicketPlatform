const express = require('express'),
    config = require('../../config/clicket.config'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    bodyValidator = require('../helpers/bodyValidator'),
    User = mongoose.model('User');

let router = express.Router();

/* Register */
router.post("/register", (req, res) => {
    if (Object.keys(req.body).length !== 5 || bodyValidator(req.body.email, req.body.firstname, req.body.name, req.body.password, req.body.username)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        User.addUser(req.body, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during creating user, e-mail or username could be already in use or there might be some validation errors",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                let expires = moment().add(7, 'days').unix();
                let token = jwt.encode({
                    email: user.email,
                    exp: expires
                }, config.jwt_secret);
                res.json({
                    info: "User created successfully",
                    success: true,
                    token: token,
                    expires: moment().add(7, 'days').format('dddd, MMMM Do YYYY, h:mm:ss')
                });
            } else {
                res.json({
                    info: "Error during creating user",
                    success: false
                });
            }
        });
    }
});

/* Login */
router.post("/login", (req, res) => {
    if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.email, req.body.password)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        User.getUserByEmailForLogin(req.body.email, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during reading user",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                user.comparePassword(req.body.password, user.password, (err, isMatch) => {
                    if (err || !isMatch) {
                        res.json({
                            info: "Error during login, wrong password",
                            success: false
                        });
                    } else {
                        let expires = moment().add(7, 'days').unix();
                        let token = jwt.encode({
                            email: user.email,
                            exp: expires
                        }, config.jwt_secret);
                        res.json({
                            info: "Logged in successfully",
                            success: true,
                            token: token,
                            expires: moment().add(7, 'days').format('dddd, MMMM Do YYYY, h:mm:ss'),
                            id: user.id
                        });
                    }
                });
            } else {
                res.json({
                    info: "User not found",
                    success: false
                });
            }
        });
    }
});

/* Check email */
router.get("/check/email/:email", (req, res) => {
    User.getUserByEmail(req.params.email, (err, user) => {
        if (err) {
            res.json({
                info: "Error during reading user",
                success: false,
                error: err.errmsg
            });
        } else if (user) {
            res.json({
                info: "User with this email already exists",
                success: true,
                found: true
            });
        } else {
            res.json({
                info: "User not found",
                success: true,
                found: false
            });
        }
    });
});

/* Check username */
router.get("/check/username/:username", (req, res) => {
    User.getUserByUsername(req.params.username, (err, user) => {
        if (err) {
            res.json({
                info: "Error during reading user",
                success: false,
                error: err.errmsg
            });
        } else if (user) {
            res.json({
                info: "User with this username already exists",
                success: true,
                found: true
            });
        } else {
            res.json({
                info: "User not found",
                success: true,
                found: false
            });
        }
    });
});

/* Check admin */
router.get("/check/admin", authenticate, admin, (req, res) => {
    if (req.granted) {
        res.status(200);
        res.json({
            info: "Authorized",
            success: true
        });
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

module.exports = router;