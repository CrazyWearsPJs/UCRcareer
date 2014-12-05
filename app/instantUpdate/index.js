/**
 * Module dependancies
 */

var socketio = require('socket.io');

var io               = null
  , connectedClients = []; // Array of objects { applicantId:String, socket: SocketObj}

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
 * Returns index of applicant in connectedClients list. Returns
 * -1 if not found
 * @param applicantId {ObjectId} applicants id
 */

function findClient(applicantId){
    for (var i = 0; i < connectedClients.length; ++i){
        if (connectedClients[i].applicantId == String(applicantId)){
            return i;
        }
    }
    return -1;
}

/**
 * Add a applicant id and their associated socket id to connectedClients
 * list
 * @param applicantId {ObjectId} applicant id
 * @param socket {SocketObj} Socket object 
 */

function addClient(applicantId, socket){
    // If applicant is already connected, nothing to do
    if (findClient(applicantId) !== -1){
        return;
    }

    connectedClients.push({applicantId : String(applicantId), socket : socket});
}

/**
 * Remove a client from the connectedClients list given their applicant id
 * @param applicantId {ObjectId} applicant id
 */

function removeClient(applicantId){
    var clientPos = findClient(applicantId);
    // If applicant isn't connected, nothing to do
    if (clientPos === -1){
        return;
    }

    connectedClients.splice(clientPos, 1);
}

/**
 * Send array of notifications to client
 * @param applicantId {ObjectId} applicant id
 * @param notifications {Array} array of notifications
 */

function sendNotifications(applicantId, notifications){
    var clientPos = findClient(applicantId);
    // If applicant isn't connected, nothing to do
    if(clientPos === -1){
        return;
    }

    connectedClients[clientPos].socket.emit('mulipleNotifications', {'notifications' : notifications});
}

/**
 * Send a single notification to client
 * @param applicantId {ObjectId} applicant id
 * @param notification {Object} notification object
 */

function sendNotification(applicantId, notification){
    var clientPos = findClient(applicantId);
    // If applicant isn't connected, nothing to do
    if(clientPos === -1){
        return;
    }

    connectedClients[clientPos].socket.emit('singleNotification', {'notification' : notification});
}

/**
 * Start instant update system
 */

function start (){
    // Start handling on connection events
    io.on('connection', function(socket){
        // In case user is authenticated already,
        // but lost socket connection temporarily
        if(socket.request.session.applicantId){
            addClient(socket.request.session.applicantId, socket);
        }

        // Login authentication 
        socket.on('login', function(){
            var applicantId = socket.request.session.applicantId;
            if (applicantId) {
                addClient(applicantId, socket);
            }
        });

        socket.on('logout', function(){
            var applicantId = socket.request.session.applicantId;
            if (applicantId){
                removeClient(applicantId);
            }
        });
        
        socket.on('disconnect', function(){
            var applicantId = socket.request.session.applicantId;
            if (applicantId){
                removeClient(applicantId);
            }
        });
    });
}

/**
 * Exports
 */

exports = module.exports = {
    attachToServer:             attachToServer
  , attachSessions:             attachSessions
  , start:                      start
  , sendNotification:           sendNotification
  , sendNotifications:          sendNotifications
};