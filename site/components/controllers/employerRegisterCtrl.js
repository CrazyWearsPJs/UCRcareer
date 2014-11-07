angular.module('ucrCareerControllers')
        .controller('EmployerRegisterCtrl', ['$scope', '$route', 'User', 
        function($scope, $route, User){
            $scope.user = {
                email: "", 
                password: ""
            };

            var credentials = User.getCredentials();
            if (credentials.email !== null) {
                $scope.user.email = credentials.email;
            }
            
            if(credentials.password !== null) {
                $scope.user.credentials.password = credentials.password;
                $scope.user.credentials.reEnterPassword = credentials.password;
            }

            $scope.differentPassword = function() {
                return $scope.user.credentials.password !== $scope.user.credentials.reEnterPassword;
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
                $route = '/';
            };
       }]);


