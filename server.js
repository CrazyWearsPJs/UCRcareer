/**
 * Module Dependencies
 */

var express        = require('express')
  , expressWinston = require('express-winston')
  , fs             = require('fs')
  , mongoose       = require('mongoose')
  , path           = require('path')
  , winston        = require('winston')
  , app            = express();

var config = require('./app/config')
  , models = require('./app/models')
  , logger = require('./app/logger');

/**
 * Setup database 
 */

var dbSettings = config.dbSettings;

logger.info("Connecting to mongodb://%s/%s:%s", dbSettings.host
                                              , dbSettings.database
											  , dbSettings.port);

var db = mongoose.createConnection(dbSettings.host
                                 , dbSettings.database
                                 , dbSettings.port);
// Register models
models.register(db);

/**
 * Setup server
 */

var serverSettings = config.serverSettings;

// Set up HTTP logging (non-errors). Needs
// to be done before any route handlers!
app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			colorize:    true
		  , exitOnError: false
		})
	  , new winston.transports.File({
			filename: path.join('.', serverSettings.httpLogFile)
		  , exitOnError: false
		})
	]
  , msg:         "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  , colorStatus: true
}));

// Serve static files
app.use(express.static(__dirname + '/site'));

// Set up HTTP error logging
// Needs to be placed after routes and static
// files, else it won't have errors to catch!
app.use(expressWinston.errorLogger({
	transports: [
		new winston.transports.Console({
			colorize:    true
		  , exitOnError: false
		})
	  , new winston.transports.File({
			filename: path.join('.', serverSettings.httpErrLogFile)
		  , exitOnError: false
		})
	]
  , msg:         "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  , colorStatus: true
}));

/**
 * Start application
 */

var port = serverSettings.port || 8080;

app.listen(port, function (){
	logger.info("Application started on port %s", port);
});

