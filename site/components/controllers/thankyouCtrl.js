angular.module('ucrCareerControllers')
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
            console.log(User.getProfileData());
            $scope.user.fName = User.getProfileData().personal.fName;
            $timeout(function redirectUser(){
                $location.path('/');
            }, timeoutMs);
        });
    }]);
