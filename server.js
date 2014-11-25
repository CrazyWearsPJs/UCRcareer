/**
 * Module Dependencies
 */

var express        = require('express')
  , http           = require('http')
  , session        = require('express-session')
  , bodyParser     = require('body-parser')
  , expressWinston = require('express-winston')
  , mongoose       = require('mongoose')
  , path           = require('path')
  , winston        = require('winston');

var config        = require('./app/config')
  , models        = require('./app/models')
  , logger        = require('./app/logger')
  , router        = require('./app/router')
  , notifications = require('./app/notifications');

var app    = express()
  , server = http.Server(app);

/**
 * Setup database 
 */

var dbSettings = config.dbSettings;
var dbTestSettings = config.dbTestSettings;

var db = undefined;
if (app.get('env') === 'development') {
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
 * Attach server to notifications module
 */

notifications.attachToServer(server);

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
 * Use body parser
 */
app.use(bodyParser.json());

/**
 * Use Session Cookies
 */

var sessionMiddleware = session({
    'name': 'ucrCareer.api-token',
    'resave': true,
    'secret': 'test',
    'saveUninitialized' : true
});

// Register session middleware for socket.io
notifications.attachSessions(sessionMiddleware);

// Register session middleware for express server
app.use(sessionMiddleware);

/**
 * Set application routes
 */

router(app);

/**
 * Start application
 */

var port = serverSettings.port || 8080;
server.listen(port, function (){
    logger.info("Application started on port %s", port);
});

notifications.start();