const express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	passport = require('passport');

/* Initialize DB & authentication */
require("../config/db");
require("../config/passport");

/* Routes */
let routes = require("./server/routes/index");

/* Initialize app */
let app = express();

/* View enginge */
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

/* Favicon */
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

/* Static */
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../app')));
app.use('/lib', express.static(path.join(__dirname, '../node_modules')));
app.use('/app', express.static(path.join(__dirname, '../app')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/vendor', express.static(path.join(__dirname, '../public/vendor')));
app.use('/config', express.static(path.join(__dirname, '../config')));

/* Passport */
app.use(passport.initialize());

/* Routes */
app.use('/', routes);

/* Error handlers */
/* 404 error handler */
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/* 401 error handler: unauthorized */
app.use((err, req, res, next) => {
	if (err.name == "UnauthorizedError") {
		res.status = 401;
		res.json({
			message: err.name + ": " + err.message
		});
	}
});

/* Development error handler: stacktrace */
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

/* Production error handler: no stacktrace */
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;