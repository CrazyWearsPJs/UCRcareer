/**
 * Module Dependencies
 */

var express        = require('express')
  ,expressWinston = require('express-winston')
  , mongoose       = require('mongoose')
  , path           = require('path')
  , winston        = require('winston')
  , app            = express();

var config = require('./app/config')
  , models = require('./app/models')
  , logger = require('./app/logger')
  , router = require('./app/router');

/**
 * Setup database 
 */

var dbSettings = config.dbSettings;
var dbTestSettings = config.dbTestSettings;

var db = undefined;
if (process.env.TEST) {
    db = mongoose.createConnection(dbTestSettings.host
                                , dbTestSettings.database
                                , dbTestSettings.port);
} else {
    db = mongoose.createConnection(dbSettings.host
                                , dbSettings.database
                                , dbSettings.port);
}

db.on('error', function(err) {
    logger.error("DB error", err);
});

db.on('connected', function() {
    logger.info("Connected to mongodb://%s/%s:%s", db.host
                                                 , db.name
                                                 , db.port);
});

db.on('disconnected', function() {
    logger.warn("DB connection has been lost!")
});

db.on('reconnected', function() {
    logger.info("DB connection has been restarted!");
});

db.on('close', function() {
    logger.warn("DB connection has been closed!");
});

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
app.use(express.static(path.join(__dirname, serverSettings.staticPath)));

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

/**
 * Router
 */
var routerRef = router(app, db);

app.listen(port, function (){
    logger.info("Application started on port %s", port);
});
