angular.module('huntEdu.controllers')
    .controller('MainCtrl', ['$rootScope', 'socket', function($rootScope, socket){
        $rootScope.notifications = [];
       
        socket.on('multipleNotifications', function(data){
            $rootScope.notifications = data.notifications;
        });

        socket.on('singleNotification', function(data){
            $rootScope.notifications.push(data.notification);
        });    
    }]);
