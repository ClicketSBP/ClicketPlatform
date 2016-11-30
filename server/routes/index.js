const express = require('express'),
	router = express.Router(),
	jwt = require('express-jwt'),
	config = require('../config/subporter'),
	auth = jwt({
		secret: config.jwt.secret,
		userProperty: 'payload'
	});

let profileController = require('../controllers/profile');
let authenticationController = require('../controllers/authentication');

// profile
router.get('/profile', profileController.profileRead);

// authentication
router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);

module.exports = router;