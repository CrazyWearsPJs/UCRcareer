/**
 * Module dependancies
 * NOTE: This module requires the models module to already
 * have a db connection
 */

var socketio = require('socket.io')
  , models   = require('../models');

var Applicant    = models.applicant()
  , Notification = models.notification()
  , io           = null; 

/**
 * These are the different kinds of notifications
 * we can send, and their associated messages. 
 */

var notificationTypes = {
    "UpdatedJobPost" : {
        "message": "Job post has new updates"
      , "meta": {
            "jobPost": null
        }
    }
};

/**
 * Configure io to listen on an http server
 * @param server {HTTP} HTTP server instance
 */

function attachToServer(server){
    io = socketio(server);
}

/**
 * Give socket io access to express middleware
 * See http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x/25618636#25618636
 * @param sessionMiddleware {Function} express middleware function
 */

function attachSessions(sessionMiddleware){
    io.use(function (socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });
}

/**
 * Start notifications system
 */

function start (){
    // Start handling on connection events
    io.on('connection', function(socket){
        console.log(socket.request.session);
    });
}

/**
 * Send a notification to a applicant
 * TODO: Use socket.io to send realtime notification if
 * user is connected
 * @param applicantId {ObjectId} Applicant id
 * @param notificationData {Object} Notification object
 * @param cb {Function} callback function
 */

function sendNotification (applicantId, notificationData, cb){
    Applicant.findById(applicantId, function(err, applicant){
        if (err || !applicant){
            var Err = new Error("Failed to send notification");
            return cb(Err);
        }

        // Create Notification 
        var notification = new Notification(notificationData);
        notification.save(function(err, _notification){
            if (err){
                return cb(err);
            }

            // Add notification to applicant
            applicant.addNotification(_notification._id, cb);
        })
    });
}

/**
 * Exports
 */

exports = module.exports = {
    attachToServer: attachToServer
  , attachSessions: attachSessions
  , start:          start
};