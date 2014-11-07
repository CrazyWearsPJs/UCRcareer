angular.module('ucrCareerControllers')
        .controller('HeaderCtrl', ['$scope', '$modal', '$location', 'AuthService', 'User', 
        function($scope, $modal, $location, AuthService, User){
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
	                    User.addCredentials(user.email, user.password);
                        AuthService.login();
                    }, function() {
        	    });
        	};
        }])
	.controller('LoginModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
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
        }])
	.controller('RegisterModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
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
