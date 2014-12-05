angular.module('huntEdu.controllers')
    .controller('MainCtrl', ['$rootScope', 'socket', '_', function($rootScope, socket, _){
        $rootScope.notifications = [];
       
        var forEach = _.forEach;
        socket.on('multipleNotifications', function(data){
            $rootScope.notifications = data.notifications;
            
            forEach(data.notifications, function(notification) {
                toastr.success(notification);
            });
        });

        socket.on('singleNotification', function(data){
            $rootScope.notifications.push(data.notification);
            toastr.success("data.notification");
        });    
    }]);
