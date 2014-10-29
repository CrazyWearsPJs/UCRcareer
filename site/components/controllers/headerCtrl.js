angular.module('ucrCareerControllers')
        .controller('HeaderCtrl', ['$scope', '$modal', '$location', 'User', 
        function($scope, $modal, $location, User){
                $scope.registerOpen = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'templates/registerModal.html',
                        controller: 'RegisterModalCtrl',
                        size: 'lg'
                    });

                    modalInstance.result.then(function(user) {
                        User.addCredentials(user.email, user.password);
                        $location.path('/register');
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
                    }, function() {
        	        });
        	    };
        }])
        .controller('RegisterModalCtrl', ['$scope', '$modalInstance',
        function($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: "",
                reEnterPassword: ""
            };
            var differentPassword = function() {
                return $scope.user.password !== $scope.user.reEnterPassword;
            };

            $scope.invalidPasswordTouched = function() {
                return $scope.register.password.$invalid && $scope.register.password.$touched;
            };

            $scope.differentPasswordTouched = function() {
                return $scope.register.reEnterPassword.$touched && 
                    $scope.register.password.$viewValue !== $scope.register.reEnterPassword.$viewValue;
            };

            $scope.ok = function() {
                if ($scope.register.$valid && !differentPassword()) {
                    $modalInstance.close($scope.user);
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]).controller('LoginModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
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
