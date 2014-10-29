angular.module('ucrCareerControllers')
        .controller('headerCtrl', ['$scope', '$modal', 
        function($scope, $modal){
                $scope.user = {
                    email: "",
                    password: ""
                };
                $scope.registerOpen = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'templates/registerModal.html',
                        controller: 'registerModalCtrl',
                        size: 'lg'
                    });

                    modalInstance.result.then(function(user) {
                        $scope.user.email = user.email;
                        $scope.user.password = user.password;
			            //then register
                    }, function() {
                    });
                };

        	$scope.loginOpen = function() {
            	var modalInstance = $modal.open({
                	templateUrl: 'templates/loginModal.html',
	                controller: 'loginModalCtrl',
        	        size: 'lg'
	            });
        	    modalInstance.result.then(function(user) {
        	        $scope.user.email = user.email;
                	$scope.user.password = user.password;
	            }, function() {
        	    });
        	};
        }])
        .controller('registerModalCtrl', ['$scope', '$modalInstance',
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
        }]).controller('loginModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: "",
            };

            $scope.ok = function() {
                    $modalInstance.close($scope.user);
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);
