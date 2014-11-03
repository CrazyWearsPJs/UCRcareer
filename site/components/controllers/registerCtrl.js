angular.module('ucrCareerControllers')
        .controller('RegisterCtrl', ['$scope', '$location', 'User', 
        function($scope, $location, User){
            $scope.user = {
                email: "", 
                password: ""
            };
            var credentials = User.getCredentials();
            if (credentials.email !== null) {
                $scope.user.email = credentials.email;
            }
            
            if(credentials.password !== null) {
                $scope.user.password = credentials.password;
            }

            $scope.differentPassword = function() {
                return $scope.user.password !== $scope.user.reEnterPassword;
            };

            $scope.differentPasswordTouched = function() {
               return $scope.register.reEnterPassword.$touched &&
                $scope.register.password.$viewValue !== $scope.register.reEnterPassword.$viewValue; 
            };

            $scope.ok = function() {
                if($scope.register.$valid && !$scope.differentPassword()) {
                    // api call
                }
            };

            $scope.cancel = function() {
                $location.path('/');
            };
       }]);


