angular.module('ucrCareerControllers')
    .controller('EmployerRegisterCtrl', ['$scope', '$location', 'AuthService', 'User', 'USER_ROLES', function EmployerRegisterCtrl($scope, $location, AuthService, User, USER_ROLES){
        $scope.user = {
            'companyName': {},
            'credentials': {},
            'personal': {},
            'contact': {},
            'location': {}
        };

        var credentials = User.getCredentials();
        if (credentials.email !== null) {
            $scope.user.credentials.email = credentials.email;
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
                User.setCredentials($scope.user.credentials.email, $scope.user.credentials.password);
                User.setProfileData($scope.user, USER_ROLES.employer);
                AuthService.register(USER_ROLES.employer)
                    .then(function() {
                        //registration successful
                        $location.path('/thankyou');
                    });
            }
        };

        $scope.cancel = function() {
            $location.path('/');
        };
   }]);
