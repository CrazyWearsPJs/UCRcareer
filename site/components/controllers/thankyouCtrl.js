angular.module('huntEdu.controllers')
    .controller('ThankyouCtrl', ['$scope','$timeout', '$location', 'User', 
        function($scope, $timeout, $location, User){
        var timeoutMs = 3000;
        $scope.user = {};
       
        /**
         * timeOutMs milliseconds 
         * after the page loads, redirect the user 
         * to the splash page
         */
        $scope.$on('$viewContentLoaded', function(){
            $scope.user.fName = User.getProfileData().personal.fName;
            $timeout(function redirectUser(){
                if(User.isEmployer()){
                    $location.path('/employerProfile');
                } else if(User.isApplicant()) {
                    $location.path('/home');
                } else {
                    $location.path('/');
                }
            }, timeoutMs);
        });
    }]);
