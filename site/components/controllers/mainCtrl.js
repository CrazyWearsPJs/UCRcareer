angular.module('huntEdu.controllers')
    .controller('MainCtrl', ['$rootScope', 'socket', '_', 'User', function($rootScope, socket, _, User){
        $rootScope.notifications = [];
       
        var forEach = _.forEach;
        socket.on('multipleNotifications', function(data){
            for (var i = 0; i < data.notifications.length; ++i){
                $rootScope.notifications.push(data.notifications[i]);
            }
            
            forEach(data.notifications, function(notification) {
                toastr.success(notification);
            });
        });

        socket.on('singleNotification', function(data){
            $rootScope.notifications.push(data.notification);
            toastr.success("data.notification");
        });    
    }]);
