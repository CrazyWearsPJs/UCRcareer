angular.module('ucrCareerControllers')
    .controller('HeaderCtrl', ['$scope', '$modal', '$location', 'AuthService', 'User', 'USER_ROLES', function HeaderCtrl($scope, $modal, $location, AuthService, User, USER_ROLES){

        $scope.showGuest = function() {
            return User.getUserRole() === USER_ROLES.guest;
        }; 
        $scope.showEmployer = function() {
            return User.getUserRole() === USER_ROLES.employer;
        };
        $scope.gotoProfile = function() {
            if(User.getUserRole() === USER_ROLES.applicant)
            {
                $location.path('/applicantProfile');
            }
            else if(User.getUserRole() === USER_ROLES.employer)
            {
                $location.path('/employerProfile');
            }
        };
        $scope.registerOpen = function() {
            var modalInstance = $modal.open({
                templateUrl: 'templates/registerModal.html',
                controller: 'RegisterModalCtrl',
                size: 'lg'
            });
            
            modalInstance.result.then(function(user) {
                User.setCredentials(user.email, user.password);
                if(user.employer) {
                    $location.path('/employerRegister');
                } else {
                    $location.path('/applicantRegister');
                }
            }, function() {
            });
        };

        $scope.loginOpen = function() {
                var modalInstance = $modal.open({
                templateUrl: 'templates/loginModal.html',
                controller: 'LoginModalCtrl',
                size: 'lg'
            });
                modalInstance.result.then(function(user) {
                    User.setCredentials(user.email, user.password);
                    AuthService.login()
                      .then(function success() {
                          if(User.getUserRole() === USER_ROLES.employer)
                          {
                              $location.path('/employerProfile');
                          }
                          else if(User.getUserRole() === USER_ROLES.applicant)
                          {
                              $location.path('/applicantProfile');
                          }
                      }, function failure(err) {
                          //TESTING PURPOSES ONLY
                          $location.path('/applicantProfile');
//TODO                    $scope.logInFailed = true;           
                    });
                }, function() {
            });
        };
    }]);

    angular.module('ucrCareerControllers')
        .controller('LoginModalCtrl', ['$scope', '$modalInstance', function LoginModalCtrl($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: "",
            };

            $scope.ok = function() {
                if ($scope.login.$valid) {
                    $modalInstance.close($scope.user);
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);

angular.module('ucrCareerControllers')
    .controller('RegisterModalCtrl', ['$scope', '$modalInstance', function RegisterModalCtrl ($scope, $modalInstance){
        $scope.user = {
            email : "",
            password: "",
            employer: false
        };

        var differentPassword = function() {
            return $scope.user.password !== $scope.user.reEnterPassword;
        };

        $scope.registerApplicant = function() {
            if (!differentPassword() && $scope.register.$valid) {
                $scope.user.employer = false;
                $modalInstance.close($scope.user);
            }
        };

        $scope.registerEmployer = function() {
            if (!differentPassword() && $scope.register.$valid) {
                $scope.user.employer = true;
                $modalInstance.close($scope.user);
            }
        };
        
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        }]);

