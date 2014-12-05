angular.module('huntEdu.controllers')
    .controller('MainCtrl', ['$rootScope', 'socket', 'User', function($rootScope, socket, User){
        $rootScope.notifications = [];
       
        socket.on('multipleNotifications', function(data){
            for (var i = 0; i < data.notifications.length; ++i){
                $rootScope.notifications.push(data.notifications[i]);
            }
        });

        socket.on('singleNotification', function(data){
            $rootScope.notifications.push(data.notification);
        });    
    }]);
