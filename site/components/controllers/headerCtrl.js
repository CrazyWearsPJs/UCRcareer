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
            if(User.isApplicant()) {
                $location.path('/applicantProfile');
            } else if (User.isEmployer()) {
                $location.path('/employerProfile');
            }
        };

        $scope.gotoJobPostingPage = function() {
            if(User.isEmployer()) {
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
                modalInstance.result.then();
        };

        $scope.$watch(User.getUserRole);

    }]);

    angular.module('ucrCareerControllers')
        .controller('LoginModalCtrl', ['$scope', '$modalInstance', 'User', 'AuthService', 
        function LoginModalCtrl($scope, $modalInstance, User, AuthService){
            $scope.user = {
                email : "",
                password: "",
            };

            $scope.ok = function() {
                if ($scope.login.$valid) {
                    User.setCredentials($scope.user.email, $scope.user.password);
                    AuthService.login()
                        .then($modalInstance.close, 
                            function(){
                                //login failed
                        });
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);

    angular.module('ucrCareerControllers')
    .controller('RegisterModalCtrl', ['$scope', '$modalInstance', 
    function RegisterModalCtrl ($scope, $modalInstance){
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

