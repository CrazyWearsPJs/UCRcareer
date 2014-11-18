angular.module('huntEdu.controllers')
    .controller('HeaderCtrl', 
    ['$scope', '$modal', '$location', 'AuthService', 'User', 'JobListService', 
    function HeaderCtrl($scope, $modal, $location, AuthService, User, JobListService){

        $scope.ok = function() {
            if($scope.splash.search[0]) {
                var search = $scope.splash.search.toString();
                search = search.split(" ");
                // TODO redirect to search page
            }
        };

        $scope.showGuest = function() {
            $scope.welcome = User.getProfileData();
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
                    User.clearAll();
                    JobListService.clearAll();
                    $location.path('/');   
                });
        };

        $scope.registerOpen = function() {
            var modalInstance = $modal.open({
                templateUrl: 'templates/register/registerModal.html',
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
                modalInstance.result.then(function(){
			     if(User.isEmployer()) {
				        $location.path('/employerProfile');
			        } else if(User.isApplicant()){
			    	    $location.path('/home');
			        }
		    });
        };

        $scope.$watch(User.getUserRole);

    }]);

    angular.module('huntEdu.controllers')
        .controller('LoginModalCtrl', ['$scope', '$modalInstance', '$location', 'User', 'AuthService', 
        function LoginModalCtrl($scope, $modalInstance, $location, User, AuthService){
            $scope.user = {
                email : "",
                password: "",
            };

            $scope.ok = function() {
                if ($scope.login.$valid) {
                    User.setCredentials($scope.user.email, $scope.user.password);
                    AuthService.login()
                        .then(function(){	
				$modalInstance.close(); 
                            }, function(){
                        });
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);

    angular.module('huntEdu.controllers')
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

