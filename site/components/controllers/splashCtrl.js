angular.module('ucrCareerControllers')
        .controller('splashCtrl', ['$scope', '$modal', function($scope, $modal){
                $scope.user = {
                    email: "",
                    password: ""
                };
                $scope.open = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'templates/registerModal.html',
                        controller: 'registerModalCtrl',
                        size: 'lg'
                    });

                    modalInstance.result.then(function(user) {
                        console.log(user);
                        $scope.user.email = user.email;
                        $scope.user.password = user.password;
                    }, function() {
                    });
                };
        }])
        .controller('registerModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: "",
                reEnterPassword: ""
            };
            
            var noErrors = false;
            var updated_email = "", updated_password = "", updated_reEnterPassword = "";
            $scope.differentPasswords = false;
            $scope.invalidEmail = false;
            $scope.submitAvailable = false;

            $scope.$watchGroup(["user.email", "user.password","user.reEnterPassword"], function(updated) {
                updated_email = updated[0];
                updated_password = updated[1];
                updated_reEnterPassword = updated[2];

                $scope.submitAvailable = updated_email && updated_password.length > 8 &&  
                    updated_password === updated_reEnterPassword;
            });


            $scope.ok = function() {
                $scope.differentPasswords = $scope.user.password !== $scope.user.reEnterPassword;
                $scope.invalidEmail = !$scope.user.email;

                noErrors = !$scope.differentPassword && !$scope.invalidEmail;
                if (noErrors) {
                    $modalInstance.close($scope.user);
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);
