const winston = require('winston'),
    winstonRotator = require('winston-daily-rotate-file');

const loggerConfig = (() => {
	const consoleConfig = [
	    new winston.transports.Console({
	        'colorize': true
	    })
	];

	const createLogger = new winston.Logger({
	    'transports': consoleConfig
	});

	let errorLogger = createLogger;

	errorLogger.add(winstonRotator, {
	    'name': 'error-file',
	    'level': 'error',
	    'filename': './logs/error.log',
	    'json': false,
	    'datePattern': 'yyyy-MM-dd-',
	    'prepend': true
	});

	return {
		errorLogger: errorLogger
	};
})();

module.exports = loggerConfig;