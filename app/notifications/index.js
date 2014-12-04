/**
 * Module dependancies
 * NOTE: This module requires the models module to already
 * have a db connection
 */

var socketio = require('socket.io');

var io = null; 

/**
 * These are the different kinds of notifications
 * we can send, and their associated messages. 
 */

var notificationTypes = {
    UpdatedJobPost : function(jobPostId) {
        return {
            "message": "Job post has new updates"
          , "meta": {
                "jobPost": jobPostId
            }
        };
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
 * Exports
 */

exports = module.exports = {
    attachToServer:             attachToServer
  , attachSessions:             attachSessions
  , start:                      start
  , notificationTypes:          notificationTypes
};