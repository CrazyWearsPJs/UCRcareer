angular.module('ucrCareerControllers')
    .controller('HeaderCtrl', 
    ['$scope', '$modal', '$location', 'AuthService', 'User', 
    function HeaderCtrl($scope, $modal, $location, AuthService, User){
       
        $scope.showGuest = function() {
            return User.isGuest();
        };  
        
        $scope.showLoggedIn = function() {
            return User.isLoggedIn();
        };

        $scope.showEmployer = function() {
            return User.isEmployer(); 
        };
        
        $scope.gotoProfile = function() {
            $location.path('/applicantProfile');
        };

        $scope.gotoJobPosting = function() {
            if(User.getUserRole() === USER_ROLES.employer)
            {
                $location.path('/jobPosting');
            }
        };

        $scope.logout = function() {
            AuthService.logout()
                .then(function(){
                    $location.path('/');   
                });
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
                    AuthService.login();
                }, function() {
            });
        };

        $scope.$watch(User.getUserRole);

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

