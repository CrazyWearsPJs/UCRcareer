/**
 * Module dependancies
 */

var socketio = require('socket.io')
  , models   = require('../models')
  , mongoose = require('mongoose');

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
 * Returns index of applicant in connectedClients list. Returns
 * -1 if not found
 * @param socket {Socket} 
 */

function findClient(socket){
    for (var i = 0; i < connectedClients.length; ++i){
        if (connectedClients[i].socket.id == socket.id){
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
 * Remove a client from the connectedClients list
 * @param socket {Socket}
 */

function removeClient(socket){
    var clientPos = findClient(socket);
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
    var clientPos = -1;
    for (var i = 0; i < connectedClients.length; ++i){
        if (connectedClients[i].applicantId == String(applicantId)){
            clientPos = i;
            break;
        }
    }
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
    var clientPos = -1;
    for (var i = 0; i < connectedClients.length; ++i){
        if (connectedClients[i].applicantId == String(applicantId)){
            clientPos = i;
            break;
        }
    }
    
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
    var Applicant    = models.applicant()
      , Notification = models.notification(); 
    // Start handling on connection events
    io.on('connection', function(socket){
        // Login authentication 
        socket.on('login', function(credentials){
            if (!credentials)
                return;
            Applicant.findByCredentials(credentials, function(err, applicant){
                if(!applicant || err){
                    return;
                }
		        addClient(applicant._id, socket);
                // Send notification info to client
                Notification.findByRecipientId(applicant._id, function(err, notifications){
                    socket.emit('multipleNotifications', {'notifications':notifications});
                });
            });
        });

        socket.on('remove', function(data){
            var clientPos = findClient(socket);
            if(clientPos !== -1){
                var applicantId = connectedClients[clientPos].applicantId;
                Notification.removeRecipient(mongoose.Types.ObjectId(applicantId), data.notification._id, function(){});
            }
        });

        socket.on('logout', function(){
            removeClient(socket);
        });
        
        socket.on('disconnect', function(){
            removeClient(socket); 
        });
    });
}

/**
 * Exports
 */

exports = module.exports = {
    attachToServer:             attachToServer
  , start:                      start
  , sendNotification:           sendNotification
  , sendNotifications:          sendNotifications
};
