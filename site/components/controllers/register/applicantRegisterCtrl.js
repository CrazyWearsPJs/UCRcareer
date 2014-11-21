angular.module('huntEdu.controllers')
    .controller('ApplicantRegisterCtrl', ['$scope', '$location', 'User', 'AuthService', 'fileUpload', 'USER_ROLES', function ApplicantRegisterCtrl($scope, $location, User, AuthService, fileUpload, USER_ROLES){
        $scope.user = {
            'credentials': {},
            'spec': {},
            'location': {},
            'personal': {},
            'interests': []
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
                User.setProfileData($scope.user, USER_ROLES.applicant);
                AuthService.register(USER_ROLES.applicant)
                    .then(function(){
                        //if registration is successful
                        if($scope.user.spec.resume){
                            fileUpload.uploadFileToUrl($scope.user.spec.resume, '/upload', function(){ 
                                //upload users resume
                                $location.path('/thankyou');
                            });
                        } else {
                            $location.path('/thankyou');
                        }
                    });
            }
        };

        $scope.cancel = function() {
            $location.path('/');
        };
    }]);
