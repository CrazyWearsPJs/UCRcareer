var config = require('../../app/config')
  , models = require('../../app/models')
  , logger = require('../../app/logger');


var mongoose = require('mongoose'),
    fs = require('fs');


/**
 * Setup database 
 */

var dbSettings = config.dbSettings;
var dbTestSettings = config.dbTestSettings;

var db = mongoose.createConnection(dbSettings.host
                                , dbSettings.database
                                , dbSettings.port);

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

var postsRaw = JSON.parse(fs.readFileSync('MOCK_JOB_POSTINGS.json', 'utf8'));

var JobPosting = models.jobPosting();


var savePost = function(postRaw) {
    var post = new JobPosting(postRaw);
    post.save();
};

postsRaw.forEach(savePost);

logger.info("DB successfully populated!");
db.close();

