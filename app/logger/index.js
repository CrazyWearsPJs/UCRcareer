/**
 * Module Dependancies
 */

var winston = require('winston')
  , path    = require('path');

var config  = require('../config')

/**
 * Create logger for the application
 */

var serverSettings = config.serverSettings
  , appErrLogPath  = path.join(__dirname, serverSettings.appErrLogFile)
  , appInfoLogPath = path.join(__dirname, serverSettings.appInfoLogFile)
  , appWarnLogPath = path.join(__dirname, serverSettings.appWarnLogFile);

var logger = new winston.Logger({
	transports: [
        // By specifying info as the level, warn and
		// error will also be logged to the console
		new winston.transports.Console({ 
			level:     'info'
		  , colorize:  true
		})
		// Info file logging
	  , new winston.transports.File({
	  		level:     'info'
		  , filename:  appInfoLogPath
		  , timestamp: true
		  , json:      false
		  , name:      'log.info'
		})
		// Warn file logging 
	  , new winston.transports.File({
	  		level:     'warn'
		  , filename:  appWarnLogPath
		  , timestamp: true
		  , json:      false
		  , name:      'log.warn'
		})
		// Error file logging
	  , new winston.transports.File({
	  		level:     'error'
		  , filename:  appErrLogPath
		  , timestamp: true
		  , json:      false
		  , name:      'log.err'
		})
    ]
});

/**
 * export logger
 */

exports = module.exports = logger;
